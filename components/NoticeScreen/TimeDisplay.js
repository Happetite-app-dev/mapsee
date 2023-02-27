import { Text } from "react-native";
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
                return <Text>{Math.floor(timeDiff / 1000)}sec</Text>;
            } else {
                return <Text>{Math.ceil(timeDiff / (1000 * 60))}min</Text>;
            }
        }
        return <Text>{Math.ceil(timeDiff / (1000 * 60 * 60))}hr</Text>;
    } else {
        return <Text>{Math.ceil(timeDiff / (1000 * 60 * 60 * 24))}days</Text>;
    }
};

export default TimeDisplay