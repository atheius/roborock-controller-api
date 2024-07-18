module.exports = async function (fastify, opts) {
  if (fastify.basicAuth) {
    fastify.addHook("onRequest", fastify.basicAuth);
  }
};
