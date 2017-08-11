'use strict'

import { Linking } from 'react-native'

const isValidLatLong = (num, range) => typeof num === 'number' && num <= range && num >= (-1 * range)
const isValidCoordinates = (coords) => coords === undefined || (isValidLatLong(coords.latitude, 90) && isValidLatLong(coords.longitude, 180))

// If source and destination are present, they must be valid coordinates
const isValidSourceDest = (args) => {
  const validSource = isValidCoordinates(args.source)
  const vaidDestination = isValidCoordinates(args.destination)
  return vaidDestination && validSource
}

const getParameterString = (params) => {
  let paramsStr = ''

  if (!params || !params.map) return paramsStr

  params.map(({key, value}) => {
    paramsStr += `&${key}=${value}`
  })

  return paramsStr
}

function getDirections (args) {
  if (!isValidSourceDest(args)) {
    return Promise.reject(new Error('Invalid arguments provided'))
  }

  let {destination, source, params} = args

  // default to the empty array for consistency
  params = params || [];

  // Only send source and destination parameters if they exist
  if (destination) {
    console.log('setting destination')
    params.push({
      key: 'daddr',
      value: `${destination.latitude},${destination.longitude}`
    });
  }
  if (source) {
    console.log('setting source')
    params.push({
      key: 'saddr',
      value: `${source.latitude},${source.longitude}`
    });
  }

  // Remove the leading &
  const paramsStr = getParameterString(params).slice(1)
  const url = `http://maps.google.com/maps?${paramsStr}`
  console.log('getting', url);
  return Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      return Promise.reject(new Error(`Could not open the url: ${url}`))
    } else {
      return Linking.openURL(url)
    }
  })
}

export default getDirections
