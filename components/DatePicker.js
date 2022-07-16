import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
const getday = (day) => {
    if(day==1){return '월'} 
    else if(day==2){return '화'}
    else if(day==3){return '수'}
    else if(day==4){return '목'}
    else if(day==5){return '금'}
    else if(day==6){return '토'}
    else if(day==7){return '일'}
}

const DatePicker = ({date1, setDate1, show, setShow}) => {
    const [date, setDate] = useState(date1);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showDatepicker = () => {
        if(show){
            setDate1(date);
            setShow(false);
        }
        else{
            setShow(true);
        }
    };

    return(
        <View style={{position: 'absolute',left:-55 , bottom: 21, width:330}}>
            <View>
                <Button color={'black'} onPress={showDatepicker} title={`${date.getFullYear().toString()}년 ${(date.getMonth()+1).toString()}월 ${date.getDate().toString()}일 (${getday(date.getDay())})`} />
            </View>
            {show && (
                <DateTimePicker
                style={{left: 65}}
                display='spinner'
                testID="dateTimePicker"
                value={date}
                mode='date'
                onChange={onChange}
                />
            )}
        </View>
    )
}

export default DatePicker;