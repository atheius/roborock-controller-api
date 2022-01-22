module.exports = async function (fastify, opts) {
  fastify.addHook("onRequest", fastify.basicAuth);
};
