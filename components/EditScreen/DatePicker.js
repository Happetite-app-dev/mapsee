import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, View, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
const getday = (day) => {
  if (day == 0) {
    return "일";
  }
  if (day == 1) {
    return "월";
  } else if (day == 2) {
    return "화";
  } else if (day == 3) {
    return "수";
  } else if (day == 4) {
    return "목";
  } else if (day == 5) {
    return "금";
  } else if (day == 6) {
    return "토";
  }
};
const showDatepicker = ({ show, setDate1, setShow, date, IsEditable }) => {
  if (show) {
    setDate1(date);
    setShow(false);
  } else {
    if (IsEditable) {
      setShow(true);
    }
  }
};
const DatePicker = ({ date1, setDate1, show, setShow, IsEditable }) => {
  const [date, setDate] = useState(date1);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <View style={{ position: "absolute", width: 330 }}>
      <TouchableOpacity
        onPress={() =>
          showDatepicker({ show, setDate1, setShow, date, IsEditable })
        }
      >
        <Text
          style={{
            fontSize: 16,
            height: 24,
            lineHeight: 24,
            left: 37,
          }}
        >{`${date.getFullYear().toString()}년 ${(
          date.getMonth() + 1
        ).toString()}월 ${date.getDate().toString()}일 (${getday(
          date.getDay()
        )})`}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          display="spinner"
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePicker;
