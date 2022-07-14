import React from 'react';
import { Button, View, StyleSheet, Dimensions } from "react-native";
import {getDirections} from "react-native-google-maps-directions";

export default function Deliver() {
  const address= [
      {
        id: 25,
        latitude: -25.638381,
        longitude: -49.302809
      },
      {
        id: 26,
        latitude: -25.6445996,
        longitude: -49.3092348
      },
      {
        id: 27,
        latitude: -25.6459156,
        longitude: -49.3082961
      },
      {
        id: 28,
        latitude: -25.6461193,
        longitude: -49.30544520000001
      },
      {
        id: 29,
        latitude: -25.6425603,
        longitude: -49.3036187
      },
      {
        id: 30,
        latitude: -25.6384998,
        longitude: -49.3029697
      }
    ]

  async function handleGetDirections() {
    try {
      
      getDirections(
        {
        destination:
        {
          latitude:address[0].latitude, 
          longitude:address[0].longitude
        },
        source:{
          latitude:address[0].latitude, 
          longitude:address[0].longitude
        }, 
        waypoints:
        address.map(item=>({latitude: item.latitude, longitude: item.longitude})),
        params:[
          {
            key: "travelmode",
            value: "driving"        // may be "walking", "bicycling" or "transit" as well
          },
          {
            key: "dir_action",
            value: "navigate"       // this instantly initializes navigation using the given travel mode
          }
        ]
        
      })
      } catch (error) {
        console.log(error)
      }
  }
  return (
    <>
      {
      <View style={styles.container}>
        <Button onPress={handleGetDirections} title="Get Directions" />
      </View>
      }

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});