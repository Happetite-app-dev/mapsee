import React,{useState} from 'react';
import {View, Button, Text, StyleSheet, Image, Alert, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { TouchableOpacity } from 'react-native-gesture-handler';


const ImgPicker= ({onImageTaken, defaultPhotos, IsEditable}) => {
    const [pickedImages, setPickedImages]=useState(defaultPhotos);

    const verifyPermissionsCam = async () =>{
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
    
    const verifyPermissionsLib = async () =>{
        const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (result.status !== 'granted'){
            Alert.alert('Insufficient permissions!',
            'You need to grant camera permissions to use this app.',
            [{text:'Okay'}]
            );
            return false;
        }
        return true;
    };

    const takeImageHandlerCam= async() => {
        const hasPermission=await verifyPermissionsCam();
        if(!hasPermission){
            return;
        }

       
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            //aspect: [16,9],
            quality: 0.5,
        });
        
        setPickedImages((images)=>[...images, image.uri]);
        onImageTaken(image.uri)
    };
    const takeImageHandlerLib= async() => {
        const hasPermission=await verifyPermissionsLib();
        if(!hasPermission){
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            //aspect: [16,9],
            quality: 0.5
        });
        if(!image.cancelled){                  
            setPickedImages(images=>[...images, image.uri]);
            onImageTaken(image.uri)
        }
    };
    
    return (
    <View style={styles.imagePicker}>
        {IsEditable?
            <View>
                {/* <TouchableOpacity onPress={takeImageHandlerCam} style={styles.imagePreview}>
                    {(pickedImages===[]) ? 
                        (<Text style={{fontSize:35, color: 'grey'}}>+</Text>)
                        :
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                            {pickedImages.map(image => 
                                {
                                    return(
                                        <Image style={styles.image} source={{uri: image}}/>
                                    )
                                }
                            )}
                        </ScrollView>
                    }
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={takeImageHandlerLib} style={styles.imagePreview}>
                    {(pickedImages===[]) ? 
                        (<Text style={{fontSize:35, color: 'grey'}}>+</Text>)
                        :
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{width: 100, height: 100}}>
                            {pickedImages.map(image => 
                                {
                                    return(
                                        <Image style={styles.image} source={{uri: image}}/>
                                    )
                                }  
                            )}
                        </ScrollView>
                    }
                </TouchableOpacity> */}

                <View style={{height: 110, width: 360}}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{height: 110}} >
                        <TouchableOpacity onPress={takeImageHandlerLib} style={styles.imagePreview}>
                            <Text style={{fontSize:35, color: 'grey'}}>+</Text>
                        </TouchableOpacity>
                        {pickedImages.map(image => 
                            {
                                return(
                                    <Image style={styles.image} source={{uri: image}}/>
                                )
                            }
                        )}
                    </ScrollView>
                </View>
            </View>
        :
            <View style={{height: 110, width: 360}}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{height: 110}} >
                    {(pickedImages.length==0) ? 
                        (<Text style={{fontSize:35, color: 'grey'}}>저장된 사진이 없습니다</Text>)
                        :
                        (pickedImages.map(image => 
                            {
                                return(
                                    <Image style={styles.image} source={{uri: image}}/>
                                )
                            }
                        ))
                    }
                </ScrollView>
            </View>
        }
        
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
        width: 100,
        height:100,
        borderRadius: 10,
        //marginBottom:10,
        marginRight: 15,
        justifyContent:'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
    }
})

export default ImgPicker;