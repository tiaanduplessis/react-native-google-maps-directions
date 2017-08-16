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
      key: 'daddr',
      value: `${destination.latitude},${destination.longitude}`
    })
  }
  if (source && isValidCoordinates(source)) {
    params.push({
      key: 'saddr',
      value: `${source.latitude},${source.longitude}`
    })
  }

  const url = `http://maps.google.com/maps?${getParameterString(params)}`
  return Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      return Promise.reject(new Error(`Could not open the url: ${url}`))
    } else {
      return Linking.openURL(url)
    }
  })
}

export default getDirections
