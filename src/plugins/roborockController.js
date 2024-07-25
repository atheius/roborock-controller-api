import fp from 'fastify-plugin'
import miio from 'miio'

/**
 * Represents a controller for a Roborock device.
 */
class Controller {
  /**
   * IP address of the device
   */
  deviceAddress

  /**
   * API token for the device
   */
  deviceToken

  /**
   * Fastify logger
   */
  logger

  /**
   * The Roborock device
   */
  device

  /**
   * Creates a new instance of the Controller class.
   * @param {Object} options - The options for the controller.
   * @param {string} options.deviceAddress - The IP address of the device.
   * @param {string} options.deviceToken - The API token for the device.
   * @param {Object} options.logger - The Fastify logger.
   */
  constructor({ deviceAddress, deviceToken, logger }) {
    this.deviceAddress = deviceAddress
    this.deviceToken = deviceToken
    this.logger = logger
  }

  /**
   * Connects to the Roborock device.
   * @returns {Promise<Object>} A promise that resolves to the connected device.
   * @throws {Error} If failed to connect to the device.
   */
  async connect() {
    try {
      // Create a fresh connection to the device
      this.logger.info('⌛ Connecting to device')
      this.device = await miio.device({
        address: this.deviceAddress,
        token: this.deviceToken,
      })
      this.logger.info('🚀 Connected')
      return this.device
    } catch (err) {
      this.logger.error('❌ Failed to connect to device')
      throw err
    }
  }
}

export default fp(async function (fastify, opts) {
  fastify.decorate('roborockController', function () {
    return new Controller({
      logger: fastify.log,
      deviceAddress: opts.deviceAddress,
      deviceToken: opts.deviceToken,
    })
  })
})
