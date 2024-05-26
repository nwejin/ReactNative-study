import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = 'e751e6e4dab2e4874be371c082455fd1';

export default function App() {
  const [ok, setOk] = useState(true);

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const [days, setDays] = useState([]);
  const [weather, setWeather] = useState();

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    // console.log(granted); // 허가 받았는지 granted
    if (!granted) {
      setOk(false);
    }

    // 위치 정보 불러오기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    // console.log(location);
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    // console.log(location)
    setCity(location[0].city);
    setDistrict(location[0].district);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const json = await response.json();
    // console.log(json);
    setWeather(json.weather[0].main);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {city === '' ? (
        <View style={styles.city}>
          <ActivityIndicator color="black" size="large" />
        </View>
      ) : (
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
          <Text style={styles.district}>{district}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        pagingEnabled
        // showsHorizontalScrollIndicator={false}
        indicatorStyle="white"
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.desc}>{weather}</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.desc}>sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  city: {
    flex: 1.2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: 'black',
    fontSize: 68,
    fontWeight: '500',
  },
  district: {
    fontSize: 28,
    marginTop: 15,
    color: 'gray',
    fontWeight: '500',
  },
  // weather: {
  //   backgroundColor: 'lightblue',
  // },
  day: {
    width: SCREEN_WIDTH,
    // flex: 1,
    // backgroundColor: 'teal',
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 168,
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    marginTop: -40,
    fontSize: 60,
    color: 'white',
  },
});
