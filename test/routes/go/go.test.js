import { describe, it, beforeEach, afterEach, mock } from 'node:test'
import { equal, deepEqual } from 'node:assert'
import fp from 'fastify-plugin'

import { build } from '../../app.js'
import { stat } from 'node:fs'

const registerMockRoborockControllerPlugin = async (app, opts) => {
  const goToTargetMock = mock.fn()
  const activateChargingMock = mock.fn()
  const connectMock = mock.fn(async () => ({
    goToTarget: goToTargetMock,
    activateCharging: activateChargingMock,
  }))

  await app.register(
    fp(async (fastify) => {
      fastify.decorate('roborockController', () => ({
        connect: connectMock,
      }))
    }),
    opts
  )

  return {
    connectMock,
    goToTargetMock,
    activateChargingMock,
  }
}

describe('/go', () => {
  let app

  beforeEach(() => {
    app = build({ binTarget: { x: 1, y: 2 } })
  })

  afterEach(() => {
    app.close()
  })

  describe('/dock', () => {
    it('GET (200)', async () => {
      const { connectMock, activateChargingMock } =
        await registerMockRoborockControllerPlugin(app)

      const response = await app.inject({
        method: 'GET',
        url: '/go/dock',
      })

      equal(response.statusCode, 200)
      equal(connectMock.mock.calls.length, 1)
      equal(activateChargingMock.mock.calls.length, 1)
      deepEqual(response.payload, JSON.stringify({ done: true }))
    })

    it('GET (500)', async () => {
      const { connectMock } = await registerMockRoborockControllerPlugin(app)

      connectMock.mock.mockImplementation(() => {
        throw new Error('Failed to connect')
      })

      const response = await app.inject({
        method: 'GET',
        url: '/go/dock',
      })

      equal(response.statusCode, 500)
      equal(connectMock.mock.calls.length, 1)
      deepEqual(
        response.payload,
        JSON.stringify({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Internal Server Error',
        })
      )
    })
  })

  describe('/bin', () => {
    it('GET (200)', async () => {
      const { connectMock, goToTargetMock } =
        await registerMockRoborockControllerPlugin(app)

      const response = await app.inject({
        method: 'GET',
        url: '/go/bin',
      })

      equal(response.statusCode, 200)
      equal(connectMock.mock.calls.length, 1)
      equal(goToTargetMock.mock.calls.length, 1)
      deepEqual(goToTargetMock.mock.calls[0].arguments, [1, 2])
      deepEqual(response.payload, JSON.stringify({ done: true }))
    })

    it('GET (500)', async () => {
      const { connectMock } = await registerMockRoborockControllerPlugin(app)

      connectMock.mock.mockImplementation(() => {
        throw new Error('Failed to connect')
      })

      const response = await app.inject({
        method: 'GET',
        url: '/go/bin',
      })

      equal(response.statusCode, 500)
      equal(connectMock.mock.calls.length, 1)
      deepEqual(
        response.payload,
        JSON.stringify({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Internal Server Error',
        })
      )
    })
  })
})
