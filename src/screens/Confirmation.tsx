import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { OtpInput } from "react-native-otp-entry";
// import { resendCode, verifyCode } from '../services/OnlineDB';
import { getUserDatas, saveContante, getConstante } from '../services/AsyncStorage';
import { getUser, resendCode, verifyCode } from '../services/apiService';
import { insertUser } from '../services/localDB';

const Confirmation = ({navigation}:any) => {

    const [numero, setNumero] = React.useState('')

    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false)
    const [minutes, setMinutes] = React.useState(2)
    const [seconds, setSeconds] = React.useState(0);
    const [stopTimer, setStopTimer] = React.useState(false);

    const handleCode = (text:any) => {
        setCode(text);
    }

    const getNumero = async () => {
        const res = await getConstante("numero")
        console.log(res)
        setNumero(res)
    }

    React.useEffect(() => {
        if (stopTimer) return;
    
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else if (minutes > 0) {
                    setMinutes((prevMinutes) => prevMinutes - 1);
                    return 59;
                } else {
                    clearInterval(interval);
                    setStopTimer(true);
                    return 0;
                }
            });
        }, 1000);
    
        return () => clearInterval(interval);
    }, [minutes, stopTimer]);

    React.useEffect(() => {
        getNumero()
        // console.log(code.length)
        if(code.length == 5)
        {
            handleConfirm()
        }
    }, [code])

    const handleConfirm = async () => {
        setLoading(true)
        // console.log("numero")
        // const numero = await getConstante("numero")
        // console.log(numero)
        await verifyCode({code: code, numero: numero})
        .then(async (res) => {
            setLoading(false)
            console.log(res)
            const token = res.data.token
            const refreshToken = res.data.refreshToken
            // saveContante("token", JSON.stringify(res.data.token))

            //On recupère les informations de l'utilisateur
            await getUser({numero: numero})
            .then(async (res) => {
                const datas = [
                    {id: res.data?.user?.id, nomcomplet: res.data?.user?.nomcomplet, numero: res.data?.user?.numero, code_parrainage: res.data?.user?.user_code_promo, date_naissance: res.data?.user?.date_naissance}
                ]

                const result = await insertUser(datas[0])
                if(result)
                {
                    saveContante("token", JSON.stringify(token))
                    saveContante("refreshToken", JSON.stringify(refreshToken))
                    saveContante("user", JSON.stringify(datas[0]))
                    console.log(JSON.stringify(datas[0]))
                    navigation.navigate('Tabs')
                }
                else
                {
                    console.log('result', result)
                }
            })
            .catch((err) => {
                console.log('error get_user', err)
            })
        })
        .catch((err) => {
            setLoading(false)
            console.log('error', err)
            if (err.response?.status === 401) {
                alert(`${err.response?.data?.error}`);
              } else {
                alert("Une erreur est survenue, vérifie ta connexion");
              }
        })
        // const res:any = await verifyCode({code: code})
        // console.log('res', res)
        // if(res && res.length > 0)
        //     {
        //         if(res[0].date_expiration < new Date())
        //         {
        //             setLoading(false)
        //             alert('Le code de vérification à expiré veuillez demander un autre code.')
        //         }
        //         else
        //         {
        //             setLoading(false)
        //             navigation.navigate('Home')
        //         }
        //     }
        //     else
        //     {
        //         setLoading(false)
        //         alert('Le code de vérification est incorrect, veuillez réessayer.')
        //     }
    }

    const handleResendCode = async () => {
        // setLoading(true)
        // const numero = await getConstante("numero")
        console.log(numero)
        await resendCode({numero: numero})
        .then((res) => {
            // setLoading(false)
            console.log(res)
            setMinutes(2)
            setSeconds(0)
            setStopTimer(false)
            alert(`${res.data?.message}`);
        })
        .catch((err) => {
            // setLoading(false)
            alert(`${err.response?.data?.error}`);
        })
        // console.log('res', res)
        // if(res === true)
        // {
        //     setLoading(false)
        //     alert('Un code a été envoyé à votre téléphone.')
        // }
        // else
        // {       
        //     setLoading(false)
        //     alert('Une erreur est survenue, veuillez réessayer.')
        // }
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={{padding: 20, alignItems: 'flex-start'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={35} color="black" />
            </TouchableOpacity>
        </View>
        <ScrollView style={styles.box} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 40 }}>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 100 : 0}>
                <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center',justifyContent: 'center', padding: 20, marginTop: -50}}>
                    <Text style={{fontSize: 25, fontWeight: 'bold', color: '#188E94'}}>CONFIRMATION</Text>
                    <Text style={{fontWeight: 400, fontSize: 20, color: '#000', marginTop: 40}}>Un code à 5 chiffres a été envoyé </Text>
                    <Text style={{fontSize: 20, color: '#000', marginTop: 20, textAlign: 'center', fontWeight: 400}}>Vérifiez votre téléphone et entrez le code ici.</Text>

                    <View style={{marginTop: 20, padding: 20}}>
                        
                            <OtpInput 
                                numberOfDigits={5} 
                                autoFocus={false}
                                onTextChange={(text:any) => handleCode(text)} 
                                focusStickBlinkingDuration={400}
                                theme={{
                                    pinCodeContainerStyle: {
                                        width: 58,
                                        height: 58,
                                        borderWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 12,
                                        margin: 5
                                    }
                                }}
                            />

                            <TouchableOpacity style={{backgroundColor: '#188E94', padding: 10, borderRadius: 10, marginTop: 40, width: 153, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, opacity: loading ? 0.5 : 1}} onPress={handleConfirm}>
                                {loading && <ActivityIndicator color={"#FFF"}/>} 
                                <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Confirmer</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{padding: 10, borderRadius: 10, marginTop: 10, width: 300, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, opacity: stopTimer ? 0.5 : 1}} disabled={!stopTimer} onPress={handleResendCode}>
                                {!stopTimer ? <Text style={{color: '#c4c4c4', fontSize: 15, textAlign: 'center', textDecorationLine: 'underline'}}>Renvoyer le code dans 0{minutes} : {seconds < 10 ? '0' + seconds : seconds} </Text> : <Text style={{color: '#000', fontSize: 15, textAlign: 'center', textDecorationLine: 'underline', fontWeight: 'bold'}}>Renvoyer le code</Text>}
                                
                            </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    </SafeAreaView>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 40,
    paddingBottom: 40
},
});


