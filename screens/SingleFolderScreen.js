import { SafeAreaView, Text, View, TouchableOpacity, Image } from "react-native"
import RecordFlatList from "../components/RecordFlatList";

const goBackImage = require('../assets/image/goBack.png')
const folder2Image = require('../assets/image/folder2.png')
const editImage = require('../assets/image/edit.png')
const trashcanImage = require('../assets/image/trashcan.png')

const SingleFolderScreen = ({navigation, route}) => {
    const {recordDataSource, folderID, folderName, folderColor} = route.params
    const gotoStorageScreen = () => {
        navigation.pop()//navigation.navigate('Storage')
    }
    const gotoMakeFolderBottomSheetScreen = () => {
        navigation.navigate('MakeFolderBottomSheetScreen', {folderID: folderID, folderName: folderName, folderColor: folderColor, recordDataSource: recordDataSource})
    }
    return(
        <SafeAreaView style={{height:'100%', width:'100%'}}>
            <View style={{flexDirection:'row', height: 40, marginBottom:20, alignItems:'center'}}>
                <TouchableOpacity style={{position: 'absolute', left: 29, width:20, height:30, justifyContent:'center'}} onPress={gotoStorageScreen}>
                    <Image source={goBackImage}/>
                </TouchableOpacity>
                <View style={{position: 'absolute',left: 65}}>
                    <Image source={folder2Image} style={{tintColor: folderColor}}/>
                </View>
                <Text style={{position: 'absolute', fontWeight: 'bold', fontSize: 16, left: 95}}>{folderName}</Text>
                <TouchableOpacity 
                    style={{position:'absolute', right: 64}}
                    onPress={gotoMakeFolderBottomSheetScreen}
                >
                    <Image
                        source={editImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{position:'absolute', right: 26}}>
                <Image
                    source={trashcanImage}
                />
                </TouchableOpacity>
            </View>
            <RecordFlatList recordDataSource={recordDataSource} stackNavigation={navigation}/>
        </SafeAreaView>
    )
}

export default SingleFolderScreen;