'use strict'

import { Linking } from 'react-native'

const isValidLatLong = (num, range) => typeof num === 'number' && num <= range && num >= (-1 * range)
const isValidCoordinates = (coords) => isValidLatLong(coords.latitude, 90) && isValidLatLong(coords.longitude, 180)

const isValidSourceDest = (args) => {
  const validSource = args.source && isValidCoordinates(args.source)
  const vaidDestination = args.destination && isValidCoordinates(args.destination)
  return vaidDestination && validSource
}

function getDirections (args) {
  if (!isValidSourceDest(args)) {
    return Promise.reject(new Error('Invalid arguments provided'))
  }

  const {destination, source} = args
  const url = `http://maps.google.com/maps?saddr=${source.latitude},${source.longitude}&daddr=${destination.latitude},${destination.longitude}`

  return Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      return Promise.reject(new Error('Could not open the url'))
    } else {
      return Linking.openURL(url)
    }
  })
}

export default getDirections
