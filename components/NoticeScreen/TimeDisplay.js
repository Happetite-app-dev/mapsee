import { Text, StyleSheet } from "react-native";
const TimeDisplay = ({ time }) => {
  const timeNow = new Date();
  const timePast = new Date(time);
  const timeDiff = timeNow.getTime() - timePast.getTime();
  if (
    timeNow.getFullYear() == timePast.getFullYear() &&
    timeNow.getMonth() == timePast.getMonth() &&
    timeNow.getDate() == timePast.getDate()
  ) {
    if (timeNow.getHours() == timePast.getHours()) {
      if (timeNow.getMinutes() == timePast.getMinutes()) {
        return (
          <Text style={styles.text}>{Math.floor(timeDiff / 1000)}sec</Text>
        );
      } else {
        return (
          <Text style={styles.text}>
            {Math.ceil(timeDiff / (1000 * 60))}min
          </Text>
        );
      }
    }
    return (
      <Text style={styles.text}>
        {Math.ceil(timeDiff / (1000 * 60 * 60))}hr
      </Text>
    );
  } else {
    return (
      <Text style={styles.text}>
        {Math.ceil(timeDiff / (1000 * 60 * 60 * 24))}days
      </Text>
    );
  }
};

export default TimeDisplay;

const styles = StyleSheet.create({
  text: {
    fontFamily: "NotoSansKR-Regular",
    color: "#ADB1C5",
  },
});
