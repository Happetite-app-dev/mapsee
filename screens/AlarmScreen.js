import { StatusBar } from 'expo-status-bar';
import { ImageComponent, StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useContext } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, off } from 'firebase/database';
import AppContext from '../components/AppContext';
const firebaseConfig = {
    apiKey: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
    authDomain: "mapseedemo1.firebaseapp.com",
    projectId: "mapseedemo1",
    storageBucket: "mapseedemo1.appspot.com",
    messagingSenderId: "839335870793",
    appId: "1:839335870793:web:75004c5d43270610411a98",
    measurementId: "G-8L1MD1CGN2"
};
const app= initializeApp(firebaseConfig);


const saveToken = async (token, myUID) => {
  const db = getDatabase();
      const reference1 = ref(db, '/users/'+myUID);                   
      set(reference1, {                          
          pushToken:token
      });
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

const AlarmScreen=({navigation, route})=>{
    const myContext = useContext(AppContext);
    const myUID = myContext.myUID;
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
  
    async function registerForPushNotificationsAsync() {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
  
      saveToken(token, myUID);
      
      return token;
    }
  
    async function sendPushNotification(expoPushToken) {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Happetite',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    }


    
  
    return(
        <View style={{alignItems:'center', justifyContent:'center',flex:0.5}}>
            <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                <Text>로그인 후 화면</Text>
            </View>
            <TouchableOpacity onPress={async ()=> {
              await sendPushNotification(expoPushToken);
              
            }}>
              <View>
                <Text>send notification</Text>
              </View>
            </TouchableOpacity>
        </View>
        
    );
  }

export default AlarmScreen;