import PlaceInfoBottomSheet from "../components/MapScreen/PlaceInfoBottomSheet";
import { View } from "react-native";
const PlaceInfoBottomSheetScreen = ({ navigation, route }) => {
  return (
    <View>
      <PlaceInfoBottomSheet navigation={navigation} route={route} />
    </View>
  );
};

export default PlaceInfoBottomSheetScreen;
