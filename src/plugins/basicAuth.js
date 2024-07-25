import fp from 'fastify-plugin'

/**
 * This plugins adds basic auth
 *
 * @see https://github.com/fastify/fastify-basic-auth
 */
export default fp(async function (fastify, opts) {
  if (opts.authEnabled) {
    fastify.log.info('🔒 Basic auth enabled')
    fastify.register(require('@fastify/basic-auth'), {
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
