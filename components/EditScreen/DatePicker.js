import DateTimePicker from "@react-native-community/datetimepicker";
//import DateTimePicker from "react-native-date-picker";
import { useState } from "react";
import { Text, View, Button } from "react-native";
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
    <View
      style={{
        position: "absolute",
        width: show ? 330 : 150,
      }}
    >
      <View
        onTouchEndCapture={() =>
          showDatepicker({ show, setDate1, setShow, date, IsEditable })
        }
      >
        <Text
          style={{
            fontSize: 14,
            height: 24,
            lineHeight: 24,
            left: 37,
            fontFamily: "NotoSansKR-Regular",
          }}
        >{`${date.getFullYear().toString()}년 ${(
          date.getMonth() + 1
        ).toString()}월 ${date.getDate().toString()}일 (${getday(
          date.getDay()
        )})`}</Text>
      </View>
      {show && (
        <DateTimePicker
          display="spinner"
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={onChange}
          locale="ko"
        />
      )}
    </View>
  );
};

export default DatePicker;
