import { Linking } from 'react-native'

const isValidLatLong = (num, range) => typeof num === 'number' && num <= range && num >= -1 * range

const isValidCoordinates = coords =>
  isValidLatLong(coords.latitude, 90) && isValidLatLong(coords.longitude, 180)

const getParameterString = (params = []) => {
  return params
    .map(({ key, value }) => {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(value)

      return `${encodedKey}=${encodedValue}`
    })
    .join('&')
}

function getDirections ({ destination, source, params = [] } = {}) {
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

  const url = `https://www.google.com/maps/dir/?api=1&${getParameterString(params)}`
  return Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      return Promise.reject(new Error(`Could not open the url: ${url}`))
    } else {
      return Linking.openURL(url)
    }
  })
}

export default getDirections
