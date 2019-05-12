import { Linking } from 'react-native'

const isValidLatLng = (num, range) => typeof num === 'number' && num <= range && num >= -1 * range

const isValidCoordinates = coords =>
  isValidLatLng(coords.latitude, 90) && isValidLatLng(coords.longitude, 180)

const getParams = (params = []) => {
  return params
    .map(({ key, value }) => {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(value)
      return `${encodedKey}=${encodedValue}`
    })
    .join('&')
}

const getWaypoints = (waypoints = []) => {
  if (waypoints.length === 0) {
    return ''
  }

  const params = waypoints
    .map(value => `${value.latitude},${value.longitude}`)
    .join('|')

  return `&waypoints=${params}`
}

function getDirections ({ destination, source, params = [], waypoints = [] } = {}) {
  if (destination && isValidCoordinates(destination)) {
    params.push({
      key: 'destination',
      value: `${destination.latitude},${destination.longitude}`
    })
  }
  if (source && isValidCoordinates(source)) {
    params.push({
      key: 'origin',
      value: `${source.latitude},${source.longitude}`
    })
  }
  if (source && isValidCoordinates(source)) {
    params.push({
      key: 'origin',
      value: `${source.latitude},${source.longitude}`
    })
  }

  const url = `https://www.google.com/maps/dir/?api=1&${getParams(
    params
  )}${getWaypoints(waypoints)}`
  return Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      return Promise.reject(new Error(`Could not open the url: ${url}`))
    } else {
      return Linking.openURL(url)
    }
  })
}

export default getDirections
