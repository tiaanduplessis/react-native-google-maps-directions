declare module "react-native-google-maps-directions" {
  export namespace directions {type LatLng = {
    latitude: number;
    longitude: number;
  };
  type travelMode = "DRIVING" | "BICYCLING" | "TRANSIT" | "WALKING";
  type paramsKeys =
    | "travelmode"
    | "dir_action"
    | "origin"
    | "destination"
    | "waypoints";

  interface paramsProps {
    key: string | paramsKeys;
    value: string | travelMode;
  }

  interface getDirectionsProps {
    destination: LatLng;
    source: LatLng;
    params: Array<paramsProps>|[];
    waypoints: LatLng[]| [];
  }}

  export function getDirections(props:directions.getDirectionsProps):Promise<any>;
}