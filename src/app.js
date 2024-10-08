import url from 'url'
import path from 'path'
import AutoLoad from '@fastify/autoload'
import Env from '@fastify/env'
import { createRequire } from 'module'
import { S } from 'fluent-json-schema'
import { scheduleJob } from 'node-schedule'

const PJSON = createRequire(import.meta.url)('../package.json')

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function (fastify, opts) {
  fastify.log.info(`🤖 App version: ${PJSON.version}`)

  // Get environment config
  await fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().required().default('dev'))
      .prop('AUTH_ENABLED', S.boolean().default(false))
      .prop('AUTH_USERNAME', S.string().required().default('robo'))
      .prop('AUTH_PASSWORD', S.string().required().default('password'))
      .prop('DEVICE_ADDRESS', S.string().required().default(''))
      .prop('DEVICE_TOKEN', S.string().required().default(''))
      .prop('BIN_SCHEDULE_ENABLED', S.boolean().default(false))
      .prop('BIN_TARGET', S.string().required().default('0,0'))
      .prop('BIN_SCHEDULE_CRON', S.string().default('0 7 * * *'))
      .valueOf(),
  })

  const binTarget = {
    x: Number(fastify.config.BIN_TARGET.split(',')[0]),
    y: Number(fastify.config.BIN_TARGET.split(',')[1]),
  }

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign(
      {
        authEnabled: fastify.config.AUTH_ENABLED,
        authUsername: fastify.config.AUTH_USERNAME,
        authPassword: fastify.config.AUTH_PASSWORD,
        deviceAddress: fastify.config.DEVICE_ADDRESS,
        deviceToken: fastify.config.DEVICE_TOKEN,
      },
      opts
    ),
  })

  // Disable logging of healthcheck route
  fastify.addHook('onRoute', (opts) => {
    if (opts.path === '/healthcheck') {
      opts.logLevel = 'silent'
    }
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({ binTarget }, opts),
    autoHooks: true,
  })

  // Go to the bin location on a schedule
  if (fastify.config.BIN_SCHEDULE_ENABLED) {
    fastify.log.info(
      `🚮 Bin schedule enabled: ${fastify.config.BIN_SCHEDULE_CRON}`
    )
    scheduleJob(fastify.config.BIN_SCHEDULE_CRON, async () => {
      try {
        const device = await fastify.roborockController().connect()
        device.goToTarget(binTarget.x, binTarget.y)
      } catch (error) {
        fastify.log.error('❌ Failed to run scheduled command')
      }
    })
  }
}
