import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Button } from 'react-native';

const StorageScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Storage Screen</Text>
      <Button
        title="Click Here"
        onPress={() => alert('Button Clicked')}
      />
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
