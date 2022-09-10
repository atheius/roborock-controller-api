"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/bin", async function (request, reply) {
    try {
      fastify.log.info("Going to bin 🧹");
      await fastify
        .roborockController()
        .connect()
        .goToTarget(opts.binTarget.x, opts.binTarget.y);
      return { done: true };
    } catch (err) {
      fastify.log.error(err);
      return fastify.httpErrors.internalServerError();
    }
  });

  fastify.get("/dock", async function (request, reply) {
    try {
      fastify.log.info("Going to dock 🔋");
      await fastify.roborockController().connect().activateCharging();
      return { done: true };
    } catch (err) {
      fastify.log.error(err);
      return fastify.httpErrors.internalServerError();
    }
  });
};
