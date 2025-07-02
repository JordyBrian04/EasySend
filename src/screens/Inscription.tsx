import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native'
import React, { useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { createUser } from '../services/OnlineDB';
import { styles } from '../assets/css/inscription'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AntDesign } from '@expo/vector-icons';
import { inscription } from '../services/apiService';
import { saveContante } from '../services/AsyncStorage';

const Inscription = ({navigation}:any) => {

    const [loading, SetLoading] = useState(false)
    const [security, setSecurity] = useState(true)
    const [conf_security, setConfSecurity] = useState(true)
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const [userData, SetUserData] = useState({
        nomcomplet: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        date_naissance: '',
        code_promo: '',
    })

    const toggleDatePicker = () => {
        setOpen(!open)
    }

    const confirmIOSDate = () => {
        const currentDate = new Date(); // Crée une nouvelle instance de la date actuelle
        let newDate;
        let jours;
        //console.log('confirmIOSDate', date)

        SetUserData({
            ...userData,
            date_naissance: date.toISOString().substring(0, 10)
        })
    
        toggleDatePicker()
      }

      const onChange = ({ type }: any, selectedDate: any) => {
        if (type === 'set') {
          const currentDate = selectedDate
          setDate(currentDate)
    
          if (Platform.OS === 'android') {
            toggleDatePicker()
    
            //On attribu la date à la valeur date (currentDate.toLocaleDateString('fr-FR'))
            SetUserData({
              ...userData,
              date_naissance: currentDate.toISOString().substring(0, 10)
            })
            //console.log(currentDate.toISOString().substring(0, 10))
          }
        } else {
          toggleDatePicker()
        }
      }

    const handleInscription = async () => {
        // userData.password == "" && userData.confirmPassword == ""
        if(userData.nomcomplet == "" && userData.phoneNumber == "" && userData.date_naissance == "")
        {
            Alert.alert('Erreur', 'Veuillez renseigner tous les champs')
            return
        }

        // Vérification du numéro
        const regex = /^(07|05|01)[0-9]{8}$/
        if(!regex.test(userData.phoneNumber))
        {
            alert('Veuillez entrer un numéro de téléphone valide')
            return
        }

        // if(userData.password !== userData.confirmPassword)
        // {
        //     alert('Les mots de passe ne sont pas identiques')
        //     return
        // }

        SetLoading(true)
        try {
            await inscription({nomcomplet: userData.nomcomplet, 
                numero: userData.phoneNumber, 
                date_naiss: userData.date_naissance,
                code_parrainage: userData.code_promo
            })
            .then(async (res)=>{
                console.log(res)
                console.log("sauvegarde du numero")
                await saveContante("numero", JSON.stringify(userData.phoneNumber))
                console.log("sauvegarde ok")
                SetLoading(false)
                navigation.navigate('Confirmation')
            })
            .catch((err) => {
                SetLoading(false)
                console.log(err)
                if (err.response?.status === 401) {
                    alert(`${err.response?.data?.error}`);
                  } else {
                    alert("Une erreur est survenue, vérifie ta connexion");
                  }
            })
        } catch (error) {
            alert("Une erreur est survenue, vérifie ta connexion");
        }
        // const res:any = await createUser(userData)
        // console.log(res)
        // if(res?.id)
        // {
        //     navigation.navigate('Confirmation')
        // }
        // else
        // {
        //     Alert.alert('Erreur',res)
        // }
        // SetLoading(false)
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.box} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 40 }}>


                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0}>

                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                        <Text style={{fontSize: 27, fontWeight: 'bold', textAlign: 'center', marginBottom: 16}}>Faisons connaissance</Text>
                        <Image source={require('../assets/images/emoji.png')} style={{width: 30, height: 30, resizeMode: 'contain', marginBottom: 12}} />
                    </View>
                    <Text style={{fontSize: 13, textAlign: 'center', marginBottom: 28}}>Entrez vos informations pour continuer</Text>

                    {/* FORMULAIRE DE CONNEXION */}
                    <View style={[styles.formulaire, { marginBottom: 40 }]}>
                        {/* Nom */}
                        <View style={[styles.inputGroup, { marginBottom: 16 }]}>
                            <Text style={[styles.lib, { fontSize: 14, color: '#4b5563', marginBottom: 8 }]}>Nom et prénoms</Text>
                            <TextInput
                                placeholder='Votre nom complet'
                                autoCapitalize='words'
                                autoCorrect={false}
                                keyboardType='default'
                                maxLength={20}
                                returnKeyType='next'
                                value={userData.nomcomplet}
                                onChangeText={(e) => SetUserData({...userData, nomcomplet:e})}
                                style={styles.input}
                            />
                        </View>

                        {/* Numéro */}
                        <View>
                            <Text style={[styles.lib, { fontSize: 14, color: '#4b5563', marginBottom: 8 }]}>Numéro de téléphone</Text>
                            {/* <TextInput
                                placeholder='Votre numéro de téléphone'
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType='phone-pad'
                                maxLength={10}
                                returnKeyType='next'
                                value={userData.phoneNumber}
                                onChangeText={(e) => SetUserData({...userData, phoneNumber:e})}
                                style={styles.input}
                                className='border rounded-2xl border-gray-300 h-12 px-4 text-sm text-gray-800 focus:outline-none focus:border-blue-500'
                            /> */}
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderRadius: 10, borderColor: '#00000033', padding: 10}}>
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
                        </View>

                        {/* Date de naissance */}
                        <View style={[styles.inputGroup, { marginBottom: 16 }]}>
                            <Text style={[styles.lib, { fontSize: 14, color: '#4b5563', marginBottom: 8 }]}>Date de naissance</Text>

                            {open && (
                              <DateTimePicker
                                mode="date"
                                display="spinner"
                                value={date}
                                onChange={onChange}
                                style={{height: 120, marginTop: 20, width: '100%'}}
                                textColor='#000'
                              />
                            )}

                            {open && Platform.OS === 'ios' && (
                              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15}}>

                                <TouchableOpacity style={{padding: 10, backgroundColor: '#00000033', borderRadius: 100}}
                                  onPress={toggleDatePicker}
                                >
                                  <Text style={{color: 'red', fontWeight: 'bold'}}>Annuler</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{padding: 10, backgroundColor: '#00000033', borderRadius: 100}} 
                                  onPress={confirmIOSDate}
                                >
                                  <Text style={{color: 'green', fontWeight: 'bold'}}>Valider</Text>
                                </TouchableOpacity>
                              </View>
                            )}

                            {!open && (
                              <TouchableOpacity onPress={toggleDatePicker}>
                                <TextInput
                                    placeholder='JJ/MM/AAAA'
                                    autoCapitalize='words'
                                    autoCorrect={false}
                                    keyboardType='default'
                                    maxLength={20}
                                    returnKeyType='next'
                                    value={userData.date_naissance}
                                    onChangeText={(e) => SetUserData({...userData, date_naissance:e})}
                                    style={styles.input}
                                    onPressIn={toggleDatePicker}
                                />
                              </TouchableOpacity>
                            )}

                        </View>

                        {/* Code promo */}
                        <View style={[styles.inputGroup, { marginBottom: 16 }]}>
                            <Text style={[styles.lib, { fontSize: 14, color: '#4b5563', marginBottom: 8 }]}>Code parrainage</Text>
                            <TextInput
                                placeholder='Code parrainage'
                                autoCapitalize='characters'
                                autoCorrect={false}
                                keyboardType='default'
                                maxLength={12}
                                returnKeyType='next'
                                value={userData.code_promo}
                                onChangeText={(e) => SetUserData({...userData, code_promo:e})}
                                style={styles.input}
                            />
                        </View>

                        {/* Mot de passe */}
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
                                    style={{width: '90%', padding: 12}}
                                />

                                <TouchableOpacity onPress={() => setSecurity(!security)}>
                                    <Entypo name={security ? "eye" : "eye-with-line"} size={24} color="#3b82f6" />
                                </TouchableOpacity>
                            </View>
                        </View> */}

                        {/* Confirmer mot de passe */}
                        {/* <View style={[styles.inputGroup, { marginBottom: 16 }]}>
                            <Text style={[styles.lib, { fontSize: 14, color: '#4b5563', marginBottom: 8 }]}>Confirmer mot de passe</Text>
                            <View style={[styles.passwordInput, { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16, height: 48, paddingHorizontal: 16 }]}>
                                <TextInput
                                    placeholder='***********'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType='done'
                                    secureTextEntry={conf_security}
                                    value={userData.confirmPassword}
                                    onChangeText={(e) => SetUserData({...userData, confirmPassword:e})}
                                    style={{width: '90%', padding: 12}}
                                    className='p-3 w-[90%]'
                                />
                                <TouchableOpacity onPress={() => setConfSecurity(!conf_security)}>
                                    <Entypo name={conf_security ? "eye" : "eye-with-line"} size={24} color="#3b82f6" />
                                </TouchableOpacity>
                            </View>

                        </View> */}

                        {/* CONNEXION */}
                        <TouchableOpacity style={{backgroundColor: '#188E94', padding: 10, borderRadius: 10, marginTop: 70, width: 153, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, opacity: loading ? 0.5 : 1}} disabled={loading} onPress={handleInscription}>
                            {loading && <ActivityIndicator color={"#FFF"}/>} 
                            <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Suivant</Text>
                            <AntDesign name="right" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* FOOTER */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#4b5563', textAlign: 'center', fontSize: 14, lineHeight: 20 }}>Vous avez un compte?</Text>
                        <TouchableOpacity style={{ marginLeft: 8, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('Connexion')}>
                            <Text style={{ color: '#3b82f6', fontSize: 14, lineHeight: 20, fontWeight: 'bold' }}>Connectez-vous</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Inscription