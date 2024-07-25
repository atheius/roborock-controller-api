import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Fastify from 'fastify'
import AutoLoad from '@fastify/autoload'
import sensible from '../src/plugins/sensible.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// A test version of the app
function build(opts = {}) {
  const app = Fastify()

  app.register(sensible)

  // Load all the routes
  app.register(AutoLoad, {
    dir: join(__dirname, '../src/routes'),
    options: Object.assign({}, opts),
  })

  return app
}

export { build }
