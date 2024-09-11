import fp from 'fastify-plugin'
import auth from '@fastify/basic-auth'

/**
 * This plugins adds basic auth
 *
 * @see https://github.com/fastify/fastify-basic-auth
 */
export default fp(async function (fastify, opts) {
  if (opts.authEnabled) {
    fastify.log.info('🔒 Basic auth enabled')
    fastify.register(auth, {
      validate: function (username, password, req, reply, done) {
        if (username === opts.authUsername && password === opts.authPassword) {
          done()
        } else {
          done(new Error('Unauthorized request.'))
        }
      },
    })
  }
})
