import { describe, it, beforeEach, afterEach } from 'node:test'
import { equal, deepEqual } from 'node:assert'

import { build } from '../../app.js'

describe('/healthcheck', () => {
  let app

  beforeEach(() => {
    app = build()
  })

  afterEach(() => {
    app.close()
  })

  it('GET (200)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/healthcheck',
    })

    equal(response.statusCode, 200)
    deepEqual(response.payload, JSON.stringify({ ok: true }))
  })
})
