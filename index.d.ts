export namespace directions {
  type LatLng = {
    latitude: number;
    longitude: number;
  };

  type travelMode = "driving" | "bicycling" | "transit" | "walking";
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
    destination?: LatLng;
    source?: LatLng;
    params?: paramsProps[];
    waypoints?: LatLng[];
  }
}

export default function getDirections(props?: directions.getDirectionsProps): Promise<any>;
