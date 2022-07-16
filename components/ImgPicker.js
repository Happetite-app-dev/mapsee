import React,{useState} from 'react';
import {View, Button, Text, StyleSheet, Image, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { TouchableOpacity } from 'react-native-gesture-handler';


const ImgPicker= props => {
    const [pickedImage, setPickedImage]=useState();

    const verifyPermissions = async () =>{
        const result = await Permissions.askAsync(Permissions.CAMERA);
        if (result.status !== 'granted'){
            Alert.alert('Insufficient permissions!',
            'You need to grant camera permissions to use this app.',
            [{text:'Okay'}]
            );
            return false;
        }
        return true;
    };

    const takeImageHandler= async() => {
        const hasPermission=await verifyPermissions();
        if(!hasPermission){
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            //aspect: [16,9],
            quality: 0.5
        });

        setPickedImage(image.uri);
        props.onImageTaken(image.uri)
    };
    
    return (
    <View style={styles.imagePicker}>
        <TouchableOpacity onPress={takeImageHandler} style={styles.imagePreview}>
            {!pickedImage ? (<Text style={{fontSize:35, color: 'grey'}}>+</Text>):
            (<Image style={styles.image} source={{uri: pickedImage}}/>)}
        </TouchableOpacity>
        
    </View>
    );
}

const styles=StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        marginBottom:15,
        flexDirection: 'row',
        paddingLeft: 10,

    },
    imagePreview: {
        width: 100,
        height:100,
        borderRadius: 10,
        //marginBottom:10,
        marginRight: 15,
        justifyContent:'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default ImgPicker;