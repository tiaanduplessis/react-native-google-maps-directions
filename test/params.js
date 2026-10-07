const assert = require('assert')

const base = 'https://www.google.com/maps/dir/?api=1&'

function capture (loadRuntime) {
  const checked = []
  const opened = []
  const result = { opened: true }
  const getDirections = loadRuntime({
    canOpenURL: async url => { checked.push(url); return true },
    openURL: async url => { opened.push(url); return result }
  })
  return { getDirections, checked, opened, result }
}

function options () {
  return {
    params: [{ key: 'travelmode', value: 'walking' }],
    destination: { latitude: 1, longitude: 2 },
    source: { latitude: 3, longitude: 4 }
  }
}

const coordinateUrl = `${base}travelmode=walking&destination=1,2&origin=3,4`

module.exports = [
  ['repeated calls preserve the caller array, entries, ordering and encoding', async loadRuntime => {
    const { getDirections, checked, opened, result } = capture(loadRuntime)
    const params = [
      { key: 'destination', value: 'user destination' },
      { key: 'origin', value: 'user%20origin' },
      { key: 'custom', value: 'a&b=東京' },
      { key: 'travelmode', value: 'walking' }
    ]
    const original = params.map(param => ({ ...param }))
    const entries = params.slice()
    const data = { ...options(), params, waypoints: [{ latitude: 5, longitude: 6 }] }
    assert.strictEqual(await getDirections(data), result)
    assert.strictEqual(await getDirections(data), result)
    const expected = `${base}destination=user destination&origin=user%20origin&custom=a&b=東京&travelmode=walking&destination=1,2&origin=3,4&waypoints=5,6`
    assert.deepStrictEqual(opened, [expected, expected])
    assert.deepStrictEqual(checked, opened)
    assert.strictEqual(data.params, params)
    assert.deepStrictEqual(params, original)
    entries.forEach((entry, index) => assert.strictEqual(params[index], entry))
  }],
  ['changed coordinates replace the previous generated coordinates', async loadRuntime => {
    const { getDirections, checked, opened } = capture(loadRuntime)
    const data = options()
    await getDirections(data)
    data.destination = { latitude: -90, longitude: -180 }
    data.source = { latitude: 90, longitude: 180 }
    await getDirections(data)
    assert.deepStrictEqual(opened, [coordinateUrl, `${base}travelmode=walking&destination=-90,-180&origin=90,180`])
    assert.deepStrictEqual(checked, opened)
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['removed coordinates leave no stale generated parameters', async loadRuntime => {
    const { getDirections, checked, opened } = capture(loadRuntime)
    const data = options()
    await getDirections(data)
    delete data.destination
    await getDirections(data)
    delete data.source
    await getDirections(data)
    assert.deepStrictEqual(opened, [coordinateUrl, `${base}travelmode=walking&origin=3,4`, `${base}travelmode=walking`])
    assert.deepStrictEqual(checked, opened)
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['invalid replacement coordinates leave no stale generated parameters', async loadRuntime => {
    const { getDirections, checked, opened } = capture(loadRuntime)
    const data = options()
    await getDirections(data)
    data.destination = { latitude: 91, longitude: 2 }
    data.source = { latitude: 3, longitude: -181 }
    await getDirections(data)
    assert.deepStrictEqual(opened, [coordinateUrl, `${base}travelmode=walking`])
    assert.deepStrictEqual(checked, opened)
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['frozen options, parameter arrays and entries are supported', async loadRuntime => {
    const { getDirections, checked, opened, result } = capture(loadRuntime)
    const data = options()
    data.params.forEach(Object.freeze)
    Object.freeze(data.params)
    Object.freeze(data.destination)
    Object.freeze(data.source)
    Object.freeze(data)
    assert.strictEqual(await getDirections(data), result)
    assert.strictEqual(await getDirections(data), result)
    assert.strictEqual(await getDirections({ ...data, params: Object.freeze([]) }), result)
    assert.deepStrictEqual(opened, [coordinateUrl, coordinateUrl, `${base}destination=1,2&origin=3,4`])
    assert.deepStrictEqual(checked, opened)
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['unsupported URLs preserve inputs and reject without opening', async loadRuntime => {
    const checked = []
    const data = options()
    const getDirections = loadRuntime({
      canOpenURL: async url => { checked.push(url); return false },
      openURL: () => assert.fail('openURL must not run for an unsupported URL')
    })
    await assert.rejects(getDirections(data), { message: `Could not open the url: ${coordinateUrl}` })
    await assert.rejects(getDirections(data), { message: `Could not open the url: ${coordinateUrl}` })
    assert.deepStrictEqual(checked, [coordinateUrl, coordinateUrl])
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['canOpenURL rejections preserve inputs and the original error', async loadRuntime => {
    const checked = []
    const error = new Error('check failed')
    const data = options()
    const getDirections = loadRuntime({
      canOpenURL: async url => { checked.push(url); throw error },
      openURL: () => assert.fail('openURL must not run when canOpenURL rejects')
    })
    await assert.rejects(getDirections(data), actual => actual === error)
    await assert.rejects(getDirections(data), actual => actual === error)
    assert.deepStrictEqual(checked, [coordinateUrl, coordinateUrl])
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['openURL rejections preserve inputs and the original error', async loadRuntime => {
    const checked = []
    const opened = []
    const error = new Error('open failed')
    const data = options()
    const getDirections = loadRuntime({
      canOpenURL: async url => { checked.push(url); return true },
      openURL: async url => { opened.push(url); throw error }
    })
    await assert.rejects(getDirections(data), actual => actual === error)
    await assert.rejects(getDirections(data), actual => actual === error)
    assert.deepStrictEqual(opened, [coordinateUrl, coordinateUrl])
    assert.deepStrictEqual(checked, opened)
    assert.deepStrictEqual(data.params, options().params)
  }],
  ['sparse parameter arrays retain their existing URL formatting', async loadRuntime => {
    const { getDirections, checked, opened } = capture(loadRuntime)
    const params = new Array(1)
    params.push({ key: 'travelmode', value: 'walking' })
    await getDirections({ ...options(), params })
    assert.deepStrictEqual(opened, [`${base}&travelmode=walking&destination=1,2&origin=3,4`])
    assert.deepStrictEqual(checked, opened)
    assert.strictEqual(params.length, 2)
    assert.strictEqual(0 in params, false)
  }]
]
