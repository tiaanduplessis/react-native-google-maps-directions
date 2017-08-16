<h1 align="center">🚚 react-native-google-maps-directions 🚲</h1>
<div align="center">
  <strong>🚕 Get direction using Google Maps in React Native 🚗</strong>
</div>
<br>
<div align="center">
    <a href="https://npmjs.org/package/react-native-google-maps-directions">
      <img src="https://img.shields.io/npm/v/react-native-google-maps-directions.svg?style=flat-square" alt="NPM version" />
    </a>
    <a href="https://npmjs.org/package/react-native-google-maps-directions">
    <img src="https://img.shields.io/npm/dm/react-native-google-maps-directions.svg?style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/feross/standard">
      <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
    </a>
    <a href="https://travis-ci.org/tiaanduplessis/react-native-google-maps-directions">
      <img src="https://img.shields.io/travis/tiaanduplessis/react-native-google-maps-directions/master.svg?style=flat-square" alt="Travis Build" />
    </a>
    <a href="https://github.com/RichardLitt/standard-readme)">
      <img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square" alt="Standard Readme" />
    </a>
    <a href="https://badge.fury.io/gh/tiaanduplessis%2Freact-native-google-maps-directions">
      <img src="https://badge.fury.io/gh/tiaanduplessis%2Freact-native-google-maps-directions.svg?style=flat-square" alt="GitHub version" />
   </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="tiaanduplessis.co.za">Tiaan</a> and <a href="https://github.com/tiaanduplessis/react-native-google-maps-directions/graphs/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#about">About</a></li>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#api">API</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>


## About

A tiny module that uses the [React Native Linking API](https://facebook.github.io/react-native/docs/linking.html) to get directions using [Google Maps](https://www.google.com/maps) by opening it in the default browser or app if installed.

<div align="center">
  <img src="./media/maps.jpg" alt="Maps for the win" />
</div>

## Install

```sh
$ npm install --save react-native-google-maps-directions
```

```sh
$ yarn add react-native-google-maps-directions
```

## Usage

```js
import getDirections from 'react-native-google-maps-directions'

export default class gmapsDirections extends Component {

  handleGetDirections = () => {
    const data = {
       source: {
        latitude: -33.8356372,
        longitude: 18.6947617
      },
      destination: {
        latitude: -33.8600024,
        longitude: 18.697459
      },
      params: [
        {
          key: "dirflg",
          value: "w"
        }
      ]
    }

    getDirections(data)
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.handleGetDirections} title="Get Directions" />
      </View>
    );
  }
}
```

<div align="center">
  <img src="./media/demo.gif" alt="Demo usage" />
</div>

## API

The module exports a single `getDirections` function that takes a object as its argument. The object may have `destination` (Where your coming from) and `source` (Where you going to) both of which have `latitude` and `longitude` number properties. If `source` is undefined, it defaults to the user's current location. If `destination` is undefined, it leaves it blank in Google Maps and the user will be able to enter a destination.

Additionaly parameters can be added as key-value pairs to the params array (optional). The supported parameters are listed [here](http://alvarestech.com/temp/routeconverter/RouteConverter/navigation-formats/src/main/doc/googlemaps/Google_Map_Parameters.htm). For example, in the code above, the key-value pair `dirflg` and `w` tells google maps to provide the directions with travel mode set to walking.

## Contribute

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Licensed under the MIT License.
