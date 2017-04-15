'use strict'

import { Linking } from 'react-native'

const isValidLatLong = (num, range) => typeof num === 'number' && num <= range && num >= (-1 * range)
const isValidCoordinates = (coords) => isValidLatLong(coords.latitude, 90) && isValidLatLong(coords.longitude, 180)

const isValidSourceDest = (args) => {
  const validSource = args.source && isValidCoordinates(args.source)
  const vaidDestination = args.destination && isValidCoordinates(args.destination)
  return vaidDestination && validSource
}

const getParameterString = (params) => {
  let paramsStr = ""

  if (!params || !params.map) return paramsStr;

  params.map(({ key, value}) => {
    paramsStr += `&${key}=${value}`
  });

  return paramsStr
}

function getDirections (args) {
  if (!isValidSourceDest(args)) {
    return Promise.reject(new Error('Invalid arguments provided'))
  }

  const {destination, source, params} = args
  const paramsStr = getParameterString(params);

  const url = `http://maps.google.com/maps?saddr=${source.latitude},${source.longitude}&daddr=${destination.latitude},${destination.longitude}${paramsStr}`

  console.log(url);

  return Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      return Promise.reject(new Error(`Could not open the url: ${url}`))
    } else {
      return Linking.openURL(url)
    }
  })
}

export default getDirections
