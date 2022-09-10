"use strict";

const fp = require("fastify-plugin");

const miio = require("miio");

class Controller {
  /**
   * IP address of the device
   */
  deviceAddress;

  /**
   * API token for the device
   */
  deviceToken;

  /**
   * Fastify logger
   */
  logger;

  constructor({ deviceAddress, deviceToken, logger }) {
    this.deviceAddress = deviceAddress;
    this.deviceToken = deviceToken;
    this.logger = logger;
  }

  async connect() {
    try {
      // Create a fresh connection to the device
      this.logger.info("⌛ Connecting to device");
      this.device = await miio.device({
        address: this.deviceAddress,
        token: this.deviceToken,
      });
      this.logger.info("🚀 Connected");
      return this.device;
    } catch (err) {
      this.logger.error("❌ Failed to connect to device");
      throw err;
    }
  }
}

module.exports = fp(async function (fastify, opts) {
  fastify.decorate("roborockController", function () {
    return new Controller({
      logger: fastify.log,
      deviceAddress: opts.deviceAddress,
      deviceToken: opts.deviceToken,
    });
  });
});
