import { Linking } from 'react-native'

export namespace directions{ export type LatLng= {
  latitude: number;
  longitude: number;
};
export enum travelMode {
  DRIVING = "DRIVING",
  BICYCLING = "BICYCLING",
  TRANSIT = "TRANSIT",
  WALKING = "WALKING"
}
export enum paramsKeys {
  TRAVELMODE = "travelmode",
}

export interface paramsProps {
  key: string | paramsKeys;
  value: string | travelMode;
}

export interface getDirectionsProps {
  destination: LatLng;
  source: LatLng;
  params: Array<paramsProps>;
  waypoints: LatLng[] | [];
}}

const isValidLatLng = (num: number, range: number) => typeof num === 'number' && num <= range && num >= -1 * range

const isValidCoordinates = (coords: directions.LatLng) =>
isValidLatLng(coords.latitude, 90) && isValidLatLng(coords.longitude, 180)

const getParams = (params: directions.paramsProps[]) => {
  return params
  .map(({ key, value }) => {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(value)
      return `${encodedKey}=${encodedValue}`
    })
    .join('&')
}

const getWaypoints = (waypoints: directions.LatLng[]) => {
  if (waypoints.length === 0) {
    return ''
  }
  
  const params = waypoints
  .map(value => `${value.latitude},${value.longitude}`)
  .join('|')
  
  return `&waypoints=${params}`
}

function getDirections(props: directions.getDirectionsProps) {
  if (!props.params) {
    props.params = new Array<directions.paramsProps>()
  }
  if (props.destination && isValidCoordinates(props.destination)) {
    props.params.push({
      key: 'destination',
      value: `${props.destination.latitude},${props.destination.longitude}`
    })
  }

  if (props.source && isValidCoordinates(props.source)) {
    props.params.push({
      key: 'origin',
      value: `${props.source.latitude},${props.source.longitude}`
    })
  }

  const url = `https://www.google.com/maps/dir/?api=1&${getParams(
    props.params
  )}${getWaypoints(props.waypoints)}`
  return Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      return Promise.reject(new Error(`Could not open the url: ${url}`))
    } else {
      return Linking.openURL(url)
    }
  })
}

export {getDirections}