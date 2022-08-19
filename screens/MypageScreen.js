import { StatusBar } from 'expo-status-bar';
import { useState, useSyncExternalStore, useTransition } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const MypageScreen = ({navigation}) => {
  Geocoder.init("AIzaSyA2FBudItIm0cVgwNOsuc8D9BKk0HUeUTs", {language : "en"}); 
  const[lat, setLat] = useState(37.5860485);
  const[lng, setLng] = useState(127.0008828);
  const[lctn, setLctn] = useState("혜화 골목냉면");

  const geocodeaddress = () => {
    Geocoder.from(lat, lng)
		.then(json => {
        		var addressComponent = json.results[0];
		})
		.catch(error => console.warn(error));
  }

  const geocodelctn = () => {
    Geocoder.from(lctn)
        .then(json => {
             var location = json.results[0].geometry.location;
            setLat(location.lat);
            setLng(location.lng);
        })
        .catch(error => console.warn(error));
  }
  const GooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          setLctn(data.description);
        }}
        query={{
          key: 'AIzaSyA2FBudItIm0cVgwNOsuc8D9BKk0HUeUTs',
          language: 'en',
        }}
        styles={{
          
        }}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <GooglePlacesInput/>
      <Text>Mypage Screen</Text>
      <Button
        title="Click Here"
        onPress={() => geocodeaddress()}
      />
      <Button
        title="Click Here2"
        onPress={()=> geocodelctn()}
      />
      
    </SafeAreaView>
  );
}

export default MypageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
