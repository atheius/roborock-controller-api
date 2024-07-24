import { describe, it, beforeEach, afterEach, mock } from 'node:test'
import { deepEqual, equal, rejects } from 'node:assert'
import miio from 'miio'

import { build } from '../app.js'
import roborockController from '../../src/plugins/roborockController.js'

describe('Roborock controller plugin', () => {
  let app

  beforeEach(async () => {
    app = build()
    await app.register(roborockController, {
      deviceAddress: '0.0.0.0',
      deviceToken: 'token',
    })
  })

  afterEach(() => {
    app.close()
  })

  it('Connect', async () => {
    const deviceMock = mock.method(miio, 'device', () => ({
      goToTarget: mock.fn(),
      activateCharging: mock.fn(),
    }))

    const device = await app.roborockController().connect()

    equal(deviceMock.mock.calls.length, 1)
    deepEqual(deviceMock.mock.calls[0].arguments[0], {
      address: '0.0.0.0',
      token: 'token',
    })

    await device.goToTarget(1, 2)
    await device.activateCharging()

    equal(device.goToTarget.mock.calls.length, 1)
    equal(device.activateCharging.mock.calls.length, 1)
  })

  it('Connection failed', async () => {
    mock.method(miio, 'device', () => {
      throw new Error('Connection failed')
    })

    rejects(async () => app.roborockController().connect(), /Connection failed/)
  })
})
