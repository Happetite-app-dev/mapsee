import { API_KEY } from "@env";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
//import Geolocation from 'react-native-geolocation-service';

// import Geolocation from 'react-native-geolocation-service';

/*  해당 페이지 할 일 - 완료
1. Search box 클릭 시 MapSearchScreen1으로 옮기기
2. MapSearchScreen1에 오자마자, 최근 검색어 띄우기
3. 검색어 입력하면, autocomplete으로 띄우기
4. 검색어 클릭 시 (autocomplete에서 OnClick) MapSearchScreen2로 이동
5. 검색 완료 Done 클릭 시 MapSearchScreen3로 이동
*/

//navigator.geolocation = require('react-native-geolocation-service');

const gotoSearch2Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen2", data);
};

const gotoSearch3Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen3", data);
};

const homePlace = {
  name: "Home",
  formatted_address: "formatted_address",
  description: "Home",
  structured_formatting: {
    main_text: "home",
  },
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};

const workPlace = {
  description: "Work",
  structured_formatting: {
    main_text: "work",
  },
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

const onKeyPress = (e) => {
  //console.log(e.nativeEvent)
};

const renderDescription = (data) => {
  return data.structured_formatting.main_text;
};

const MapSearchScreen1 = ({ navigation }) => {
  const [predefinedPlaces, setPredefinedPlaces] = useState([homePlace]);
  const [test, setTest] = useState(0);

  const onClick = (dataSource) => {
    console.log(3);
    gotoSearch3Screen({ navigation, data: [name, dataSource] });
  };

  const [name, setName] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Go Back"
        onPress={() => {
          navigation.goBack();
        }} // 이전페이지로 돌아가는 버튼
      />
      <GooglePlacesAutocomplete
        getSearchWord={(text) => {
          setName(text);
        }}
        getResultArray={(dataSource) => {
          onClick(dataSource), console.log(2);
        }}
        textInputProps={{
          autoFocus: true, // 커서 바로 이동
          blurOnSubmit: false,
          clearButtonMode: "always",
          returnKeyType: "search",
        }}
        listUnderlayColor="red"
        placeholder="검색어를 입력하세요"
        enablePoweredByContainer={false}
        GooglePlacesSearchQuery={{
          rankby: "distance",
        }}
        query={{
          key: "AIzaSyA2FBudItIm0cVgwNOsuc8D9BKk0HUeUTs",
          language: "kor",
          components: "country:kor",
        }}
        fetchDetails
        showPredefined
        predefinedPlaces={[homePlace]} // 최근 검색 기록 여기에 저장. BUT 여기서 자꾸 오류 생김!! 어떻게 해결하지??
        renderDescription={(data) => renderDescription(data)} // custom description render
        onPress={(data, details) => {
          console.log(details.geometry.location);

          const newPlace = {
            lctn: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            },
            name: details.name,
            address: details.formatted_address,
            id: details.place_id,
            structured_formatting: { main_text: details.name },
          };

          console.log("=====new Place=====");
          setPredefinedPlaces(predefinedPlaces.concat(newPlace));
          console.log(predefinedPlaces); // current setValue not updated here .. don't know why
          gotoSearch2Screen({ navigation, data: details });
        }}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
        styles={{
          textInputContainer: { backgroundColor: "grey" },
          textInput: { height: 38, color: "#5d5d5d", fontSize: 16 },
          predefinedPlacesDescription: { color: "#1faadb" },
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
});

export default MapSearchScreen1;
