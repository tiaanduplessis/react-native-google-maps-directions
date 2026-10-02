import getDirections from 'react-native-google-maps-directions'
import type { directions } from 'react-native-google-maps-directions'

const point: directions.LatLng = { latitude: -33.86, longitude: 18.69 }
const mode: directions.travelMode = 'driving'
const key: directions.paramsKeys = 'travelmode'
const param: directions.paramsProps = { key, value: mode }
const options: directions.getDirectionsProps = { destination: point }

const result: Promise<any> = getDirections()
getDirections(undefined)
getDirections({})
getDirections(options)
getDirections({ source: point })
getDirections({ params: [] })
getDirections({ waypoints: [] })
getDirections({ params: [param, { key: 'custom', value: 'value' }] })
getDirections({ source: point, destination: point, params: [param], waypoints: [point] })

// @ts-expect-error The runtime exports getDirections as its default, not a named export.
import { getDirections as namedGetDirections } from 'react-native-google-maps-directions'
// @ts-expect-error Coordinates must be numbers.
getDirections({ destination: { latitude: '1', longitude: 2 } })
// @ts-expect-error Both coordinates are required when a point is supplied.
getDirections({ source: { latitude: 1 } })
// @ts-expect-error Waypoints must contain coordinates.
getDirections({ waypoints: ['1,2'] })
// @ts-expect-error Parameters must have a string value.
getDirections({ params: [{ key: 'travelmode', value: 123 }] })
// @ts-expect-error The promise is not a synchronous result.
const synchronous: string = getDirections()
// @ts-expect-error Null is not an options object.
getDirections(null)
