import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { API_KEY } from "@env";
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TouchableOpacity } from 'react-native';
import PlaceInfoBottomSheet from '../components/PlaceInfoBottomSheet';
const findCurrentLocationImage = require('../assets/image/findCurrentLocation.png');
const currentLocationImage = require('../assets/image/currentLocation.png');
const targetLocationImage = require('../assets/image/targetLocation.png')

//address: 지번 주소, lctn: lat과 lng으로 이루어진 좌표 주소

const MapScreen=({changeShowTabBar}) => {
  Geocoder.init("AIzaSyA2FBudItIm0cVgwNOsuc8D9BKk0HUeUTs", {language : "kor"}); 
  const mapRef = React.createRef();
  const [origin, setOrigin] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.0016, longitudeDelta: 0.0012});   //현재 스크린에 나타나는 map의 중앙 좌표값
  const [current, setCurrent] = useState({latitude: 0, longitude: 0});                  //내 위치 좌표
  const [target, setTarget] = useState({address: '', lctn:{latitude: 0, longitude:0}}); //검색 target의 좌표
  const [targetShown, setTargetShown] = useState(false);
  const [isShowBottomSheet, setIsShowBottomSheet] = useState(false);

  useEffect(()=>{
    getLocationPermission();
  },[])

  const targetingFromAddress = (address) => {
    Geocoder.from(address)
        .then(json => {
            var location = json.results[0].geometry.location;
            const lat = location.lat;
            const lng = location.lng;
            setOrigin({latitude: lat, longitude: lng, latitudeDelta: 0.0016, longitudeDelta: 0.0012});
            setTarget({address: address, lctn:{latitude: lat, longitude:lng}});
            setTargetShown(true);
        })
        .catch(error => console.warn(error));
  }

  const targetingFromLocation = (lctn) => {
    Geocoder.from(lctn)
        .then(json => {
            var addressComponent  = json.results[0].address_components[0];
            setOrigin({latitude: lctn.latitude, longitude: lctn.longitude, latitudeDelta: 0.0016, longitudeDelta: 0.0012});
            setTarget({address: addressComponent, lctn:{latitude: lctn.latitude, longitude:lctn.longitude}});
            setTargetShown(true);
        })
        .catch(error => console.warn(error));
  }

  const GooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => {
          //changeShowTabBar();      --> firebase와 연결하며 고민할 부분
          targetingFromAddress(data.description);
        }}
        query={{
          key: 'AIzaSyA2FBudItIm0cVgwNOsuc8D9BKk0HUeUTs',
          language: 'kor',
          components: 'country:kor'
        }}
      />
    );
  };


  async function getLocationPermission() {
  
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      alert('Permission denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setCurrent({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    setOrigin((prev)=>({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0016,
        longitudeDelta: 0.0012
    }));
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        provider='google'
        ref = {mapRef}
        style={styles.map}
        region={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: origin.latitudeDelta,
          longitudeDelta: origin.longitudeDelta
        }}
        onRegionChangeComplete={(region) => {
            if(region != undefined)
            { 
              setOrigin({latitude: region.latitude, longitude: region.longitude, latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta});
            }
        }}
        onPoiClick={({nativeEvent})=>{
          targetingFromLocation(nativeEvent.coordinate);
        }}
        onPress={()=>{
          setTargetShown(false);
        }}
      >
        <GooglePlacesInput />
        <Marker coordinate={current}>
          <Image
            source={currentLocationImage}
            style={{
              width:25,
              height:25,
              resizeMode: 'contain',
            }}
          />
        </Marker>
        <Marker coordinate={target.lctn} opacity={targetShown ? 100 : 0}>
            <Image
                source={targetLocationImage}
                style={{
                    width: 37,
                    height: 37,
                    resizeMode: 'contain',
                    tintColor: 'blue'
                }}
            />
        </Marker>
        <View
            style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: 20,
                right: 25,
                bottom: 120,
                backgroundColor: 'white',
            }}
        >
            <TouchableOpacity
            style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: 20,
                left: 325,
                top: 603,
            }}
            activeOpacity={1}
            onPress={() => {
                mapRef.current.animateToRegion({
                latitude: current.latitude,
                longitude: current.longitude,
                latitudeDelta: 0.0016,
                longitudeDelta: 0.0012,
                });
            }}
            />
            <Image
            source={findCurrentLocationImage}
            resizeMode='contain'
            
            style={{
                position: 'absolute',
                width: 30,
                height: 30,
                borderRadius: 15,
                left: 330,
                top: 608,
                tintColor: 'grey',
            }}
            />

        </View>
      </MapView>
      <PlaceInfoBottomSheet isShow={targetShown} targetInfo={target.address}/>
    </SafeAreaView>
  );
}

export default MapScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
});




