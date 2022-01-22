"use strict";

const path = require("path");
const AutoLoad = require("fastify-autoload");
const Env = require("fastify-env");
const S = require("fluent-json-schema");

module.exports = async function (fastify, opts) {
  // Get environment config
  await fastify.register(Env, {
    schema: S.object()
      .prop("NODE_ENV", S.string().required().default("dev"))
      .prop("AUTH_ENABLED", S.boolean().default(false))
      .prop("AUTH_USERNAME", S.string().required().default("robo"))
      .prop("AUTH_PASSWORD", S.string().required().default("password"))
      .prop("DEVICE_ADDRESS", S.string().required().default(""))
      .prop("DEVICE_TOKEN", S.string().required().default(""))
      .prop("BIN_TARGET", S.string().required().default("0,0"))
      .valueOf(),
  });

  const binTarget = {
    x: Number(fastify.config.BIN_TARGET.split(",")[0]),
    y: Number(fastify.config.BIN_TARGET.split(",")[1]),
  };

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
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
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({ binTarget }, opts),
    autoHooks: true,
  });
};
