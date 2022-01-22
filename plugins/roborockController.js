"use strict";

const fp = require("fastify-plugin");

const miio = require("miio");

class Controller {
  constructor({ deviceAddress, deviceToken, logger }) {
    this.deviceAddress = deviceAddress;
    this.deviceToken = deviceToken;
    this.logger = logger;
  }

  async connect() {
    this.logger.info("Connecting to Roborock device...");
    this.device = await miio.device({
      cacheTime: 60,
      address: this.deviceAddress,
      token: this.deviceToken,
    });
    this.logger.info("Connected 🚀");
    return this.device;
  }
}

module.exports = fp(async function (fastify, opts) {
  const device = await new Controller({
    logger: fastify.log,
    deviceAddress: opts.deviceAddress,
    deviceToken: opts.deviceToken,
  }).connect();

  fastify.decorate("roborockController", function () {
    return device;
  });
});
