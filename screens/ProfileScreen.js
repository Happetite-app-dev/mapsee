import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";

const goBackImage = require('../assets/image/goBack.png');
const myNickname = '고등어'
const myID = 'kho2011'
const myEmail = 'kho2011@snu.ac.kr'

const gotoMypageScreen = ({navigation}) => {
    navigation.pop()
}
const ProfileScreen = ({navigation}) => {

    return(
        <SafeAreaView style={styles.container}> 
            <View style={{position: 'absolute', width: '100%', height: 60, top: 45, flexDirection:'row', paddingTop: 20}}>
                <TouchableOpacity onPress={()=>gotoMypageScreen({navigation: navigation})} style={{left: 21, width: 20, alignItems:'center', height: 20, justifyContent: 'center'}}>
                    <Image source={goBackImage} style={{tintColor: 'black'}}/>
                </TouchableOpacity>
                <View style={{left: 50, width: 260, height: 24}}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>프로필</Text> 
                </View> 
            </View>
            
            <View style={{position: 'absolute', top: 105, width: '100%', height: 24, marginTop: 24, flexDirection: 'row'}}>
                <Text style={{marginLeft: 24, fontSize: 14, fontWeight: 'bold'}}>닉네임</Text>
                <Text style={{marginLeft: 24, fontWeight: '400'}}>{myNickname}</Text>
            </View>
            <View style={{position: 'absolute', top: 177, width: '100%', height: 24, flexDirection: 'row'}}>
                <Text style={{marginLeft: 24, fontSize: 14, fontWeight: 'bold'}}>아이디</Text>
                <Text style={{marginLeft: 24, fontWeight: '400'}}>{myID}</Text>
            </View>
            <View style={{position: 'absolute', top: 225, width: '100%', height: 24, flexDirection: 'row'}}>
                <Text style={{marginLeft: 24, fontSize: 14, fontWeight: 'bold'}}>이메일</Text>
                <Text style={{marginLeft: 24, fontWeight: '400'}}>{myEmail}</Text>
            </View>

            <TouchableOpacity style={{position: 'absolute', bottom: 50, width: 344, height: 48, borderRadius: 8, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>정보수정 요청</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });