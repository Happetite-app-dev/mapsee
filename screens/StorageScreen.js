import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Button } from 'react-native';
import PlaceInfoBottomSheet from '../components/PlaceInfoBottomSheet';

const StorageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Storage Screen</Text>
      <PlaceInfoBottomSheet/>
    </SafeAreaView>
  );
}

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8fcbbc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
