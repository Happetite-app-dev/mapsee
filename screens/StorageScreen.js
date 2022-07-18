import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Button } from 'react-native';
import PlaceInfoBottomSheet from '../components/PlaceInfoBottomSheet';
import EditScreen from './EditScreen';

const StorageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>안녕</Text>
    </SafeAreaView>
  );
}

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
