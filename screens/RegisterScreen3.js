import React,{useEffect, useState} from 'react'
import {StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Dimensions} from 'react-native'
import { auth } from '../firebase'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { getDatabase, ref, onValue, set, push, remove, off } from 'firebase/database';
import { useContext } from 'react';
import AppContext from '../components/AppContext';

const { height } = Dimensions.get('window');

const saveUser = async (uid, email, id, firstName, lastName) => {
    const db = getDatabase();
        const reference1 = ref(db, '/users/'+uid);                   
        set(reference1, {                          
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
        });
}


const RegisterScreen3=({ navigation, route })=>{

    const {uid, email} = route.params;

    const [id,setId]=useState('')
    const [firstName, setFirstName]=useState('')
    const [lastName,setLastName]=useState('')
    const [valid, setValid]=useState(false)

    const myContext = useContext(AppContext);
    const startTutorial = false;

    const gotoApp = () => {
        myContext.initMyID(id)
        myContext.initMyUID(uid)
        myContext.initMyFirstName(firstName)
        myContext.initMyLastName(lastName)
        myContext.initMyEmail(email)
        if(!startTutorial){
            navigation.navigate('Tabs')
        }
        //startTutorial 이 true라면 afterScreen.js로 이동필요
    }

    const handleSignUp=()=>{
        saveUser(uid, email, id, firstName, lastName);
        gotoApp();
    }

    const ContinueButton=()=>{
        useEffect(()=>{
            setValid(false)
            if(id.length!==0){
                if(firstName.length!==0){
                    if(lastName.length!==0){
                        setValid(true)
                    }
                }
            }
        },[id, firstName, lastName])        
        if(valid){
            return(
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleSignUp}
                        style={styles.button}
                    >
                        <View style={{justifyContent:'center', alignItems:'center',}}>
                            <Text style={styles.buttonText}>계속하기</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
        else{return(
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.invalidButton}
                >
                    <View style={{justifyContent:'center', alignItems:'center',}}>
                        <Text style={styles.invalidButtonText}>계속하기</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )}
    }

    return(
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={{fontSize:13,marginLeft:14, marginTop:20}}>아이디를 입력해주세요</Text>
                <View style={{borderBottomColor:'#ADB1C5', borderBottomWidth:1,marginTop:5,paddingVertical:10,marginHorizontal:10}}>
                    <TextInput
                        placeholder="mapsee"
                        value={id}
                        onChangeText={text => setId(text)}
                        style={styles.input}
                    />
                </View>
                <Text style={{fontSize:13,marginLeft:14, marginTop:20}}>이름을 입력해주세요</Text>
                <View style={{borderBottomColor:'#ADB1C5', borderBottomWidth:1,marginTop:5,paddingVertical:10,marginHorizontal:10}}>
                    <TextInput
                        placeholder="이름"
                        value={firstName}
                        onChangeText={text => setFirstName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="성"
                        value={lastName}
                        onChangeText={text => setLastName(text)}
                        style={styles.input}
                    />
                </View>
            </View>
            <ContinueButton/>
        </View>
    )

}

export default RegisterScreen3

const styles = StyleSheet.create({
    container: {
        height:height*1.1,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'white',
    },

    textContainer:{
        fontWeight:'600',
        fontSize:20,
        marginBottom:20,
        alignItems:'flex-start',
        marginLeft:30,
    },

    inputContainer:{
        flex: 0.7,
        width:'90%',
    },

    input:{
        backgroundColor:'white',
        borderRadius: 10,        
    },

    buttonContainer:{
        width:'80%',
        justifyContent:'flex-end',
        alignItems:'center',
        marginTop:100,
    },

    button:{
        backgroundColor: '#00CCBD',
        width: '100%',
        padding:15,
        borderRadius:10,
    },

    invalidButton:{
        backgroundColor: 'white',
        width: '100%',
        padding:15,
        borderRadius:10,
        borderColor:'black',
        borderWidth:1,
    },

    buttonOutline:{
        backgroundColor:'white',
        marginTop:5,
        borderColor:'#0782F9',
        borderWidth:2,
    },

    buttonText:{
        color:'white',
        fontWeight:'700',
        fontSize:16,
    },
    
    invalidButtonText:{
        color:'black',
        fontWeight:'700',
        fontSize:16,
    },

    buttonOutlineText:{
        color:'#0782F9',
        fontWeight:'700',
        fontSize:16,
    },


})