import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { getAllUsers } from '../services/localDB'
import { styles } from '../assets/css/splashScreen'
import { StatusBar } from 'expo-status-bar'
import AntDesign from '@expo/vector-icons/AntDesign';

const {height: SCREEN_HEIGHT} = Dimensions.get('window')    

const SplashScreen = ({navigation}:any) => {

    // useEffect(() => {
    //     setTimeout(() => {
            const init = async () => {
                navigation.navigate('Connexion')
            }

    //         init()
    //     }, 5000)
    // })

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.box}>
                <Image source={require('../assets/images/back.png')} style={{width: '100%'}} />
            </View>
            <View style={[styles.box2, {height: SCREEN_HEIGHT-210}]}>
                <Text style={styles.text1}>Hii, prêt à envoyer sans limites ?</Text>
                <View>
                    <View style={{padding: Platform.OS == 'ios' ? 30 : 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <View style={{backgroundColor: '#C4F2D26B', padding: 12, borderRadius: 100, width: 100, height: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={require('../assets/images/wave.png')} style={{width: 73, height: 73, borderRadius:100}} />
                            </View>
                            <View style={{backgroundColor: '#C4F2D26B', padding: 12, borderRadius: 100, width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginTop: 50}}>
                                <Image source={require('../assets/images/mtn.jpg')} style={{width: 73, height: 73, borderRadius:100}} />
                            </View>
                        </View>
                        <View>
                            <View style={{backgroundColor: '#C4F2D26B', padding: 12, borderRadius: 100, width: 100, height: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={require('../assets/images/orange.png')} style={{width: 73, height: 73, borderRadius:100}} />
                            </View>
                            <View style={{backgroundColor: '#C4F2D26B', padding: 12, borderRadius: 100, width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginTop: 50}}>
                                <Image source={require('../assets/images/moov.png')} style={{width: 73, height: 73, borderRadius:100}} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{position: 'absolute', bottom: 100, left: 0, right: 0, height: 100}}>
                    <Text style={{fontSize: 16, textAlign: 'center', lineHeight: 20}}>Une seule app pour tous vos transferts</Text>
                    <Text style={{fontSize: 16, textAlign: 'center', lineHeight: 20}}>Envoyez et recevez, peu importe l'opérateur.</Text>
                    <Text style={{fontSize: 18, textAlign: 'center', fontWeight: 'bold', marginTop: 10}}>FIABLE - SECURISE</Text>

                    <TouchableOpacity style={{backgroundColor: '#188E94', padding: 10, borderRadius: 10, marginTop: 20, width: 153, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15}} onPress={init}>
                        <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Suivant</Text>
                        <AntDesign name="right" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SplashScreen