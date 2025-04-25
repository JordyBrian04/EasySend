import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import {AntDesign, Entypo} from '@expo/vector-icons';
import { login } from '../services/OnlineDB';
import { storeUserDatas } from '../services/AsyncStorage';
import { styles } from '../assets/css/connexion'

const Connexion = ({navigation}:any) => {

    const [loading, SetLoading] = useState(false)
    const [security, setSecurity] = useState(true)

    const [userData, SetUserData] = useState({
        phoneNumber: '',
        password: ''
    })

    const handleLogin = async () => {
        SetLoading(true)

        if(userData.password === '' && userData.phoneNumber === '')
        {
            Alert.alert('Erreur de connexion', 'Veuillez renseigner votre numéro de téléphone et votre mot de passe')
            SetLoading(false)
            return
        }

        const regex = /^(07|05|01)[0-9]{8}$/
        if(!regex.test(userData.phoneNumber))
        {
            Alert.alert('Erreur de connexion', 'Veuillez entrer un numéro de téléphone valide')
            SetLoading(false)
            return
        }

        const res:any = await login(userData)

        if(res === null)
        {
            Alert.alert('Erreur de connexion', 'Utilisateur ou mot de passe incorrect')
        }
        else if(res?.id)
        {
            await storeUserDatas(res)
            navigation.navigate('Confirmation')
        }
        else
        {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion')
        }
        SetLoading(false)
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.box} contentContainerStyle={{ justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 60 }}>

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16}}>Heureux de vous revoir 😊</Text>
                        <Text style={{fontSize: 14, textAlign: 'center', marginBottom: 16}}>Entrez votre numéro pour continuer</Text>
                    </View>


                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderRadius: 10, borderColor: '#00000033', padding: 10, marginTop: 60}}>
                        <Text style={{fontSize: 18, marginLeft: 30, textAlign: 'center'}}>+225</Text>
                        <View style={{width: 1, height: '100%', backgroundColor: '#00000033', marginHorizontal: 10}}></View>
                        <TextInput
                            placeholder='00 00 00 00 00'
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='phone-pad'
                            value={userData.phoneNumber}
                            onChangeText={(e) => SetUserData({...userData, phoneNumber:e})}
                            style={{padding: 12, width: '90%', fontSize: 18}}
                        />
                    </View>
                    {/* EMAIL */}
                    {/* <View style={[styles.inputGroup, { marginBottom: 16 }]}>
                        <Text style={[styles.lib, { fontSize: 14, color: '#4b5563', marginBottom: 8 }]}>Mot de passe</Text>
                        <View style={[styles.passwordInput, { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16, height: 48, paddingHorizontal: 16 }]}>
                        <TextInput
                            placeholder='***********'
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType='next'
                            secureTextEntry={security}
                            value={userData.password}
                            onChangeText={(e) => SetUserData({...userData, password:e})}
                            style={{padding: 12, width: '90%'}}
                        />

                        <TouchableOpacity onPress={() => setSecurity(!security)}>
                            <Entypo name={security ? "eye" : "eye-with-line"} size={24} color="#3b82f6" />
                        </TouchableOpacity>
                    </View> */}

                    {/* <TouchableOpacity style={{alignSelf: 'flex-end'}}>
                        <Text style={{color: '#6b7280'}}>Mot de passe oublié ?</Text>
                    </TouchableOpacity> */}

                {/* FOOTER */}
                <View style={{marginTop: 100}}>
                    <TouchableOpacity style={{backgroundColor: '#188E94', padding: 10, borderRadius: 10, marginTop: 20, width: 153, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15}} disabled={loading} onPress={handleLogin}>
                        {loading && <ActivityIndicator size="small" color="#fff" />}
                        <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Suivant</Text>
                        <AntDesign name="right" size={20} color="white"/>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <Text style={{color: '#4b5563', textAlign: 'center', fontSize: 14, lineHeight: 20}}>Pas encore de compte?</Text>
                        <TouchableOpacity style={{marginLeft: 8, alignItems: 'center', justifyContent: 'center'}} onPress={() => navigation.navigate('Inscription')}>
                            <Text style={{color: '#3b82f6', fontSize: 14, lineHeight: 20, fontWeight: 'bold'}}>Inscrivez-vous</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Connexion