import React, {
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
    useEffect,
    useCallback
  } from 'react'
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Dimensions, ScrollView, StatusBar, KeyboardAvoidingView, Image, Switch, Platform } from 'react-native';
import { styles } from '../assets/css/transaction';
import {AntDesign, FontAwesome, Octicons } from '@expo/vector-icons';
import { getData, getUserDatas, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const {width: SCREEN_WIDTH} = Dimensions.get('window')
import BottomSheet, { BottomSheetRefProps } from '../components/BottomSheet'


const Transaction = ({navigation}:any) => {

    const [datas, setDatas] = React.useState<any>([]);
    const [open, setOpen] = useState(false)
    const ref = useRef<BottomSheetRefProps>(null)
    const [isEnabled, setIsEnabled] = useState(false);
    const [montant, setMontant] = useState('');
    const [frais, setFrais] = useState('');
    const [montantAPrelever, setMontantAPrelever] = useState('');
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    setInterval(() => {
        const isActive:any = ref.current?.isActive()
        setOpen(isActive)
        // console.log(isActive)
    }, 1000)
    

    const getDatas = async () => {
        const res:any = await getData();
        console.log(res[0])
        setDatas(res[0])
    }

    useFocusEffect(
        React.useCallback(() => {
            getDatas()
        }, [])
    )

    const handleMontant = (text:any) => {
        if(text > 0){
            // console.log(text)
            if(isEnabled){
                const frais = parseInt(text) * 0.03
                setMontant(text)
                setFrais(frais.toString())
                setMontantAPrelever((parseInt(text) + parseInt(frais.toString())).toString())
            }else{
                setMontant(text)
                setFrais('')
                const montant = parseInt(text) - (parseInt(text) * 0.03)
                setMontantAPrelever(montant.toLocaleString())
            }

        }else{
            setMontant('')
            setFrais('')
            setMontantAPrelever('')
        }
    }

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
        console.log(!isEnabled)
        if(!isEnabled){
            const frais = parseInt(montant) * 0.03
            console.log(frais)
            setFrais(frais.toString())
            setMontantAPrelever((parseInt(montant) + parseInt(frais.toString())).toString())
        }else{
            setFrais('')
            const new_montant = parseInt(montant) - (parseInt(montant) * 0.03)
            setMontantAPrelever(new_montant.toLocaleString())
        }
    }

    const handleEnvoyer = async () => {
        // console.log(montantAPrelever)
        if(parseInt(montantAPrelever) > 0){
            if(parseInt(montantAPrelever) > 300){
                const data = [
                    {
                        destinataire: datas.destinataire,
                        action: datas.action,
                        reseau: datas.reseau,
                        expediteur: datas.expediteur,
                        reseauDestinataire: datas.reseauDestinataire,
                        montant: parseInt(montantAPrelever),
                        frais: parseInt(frais)
                    }
                ]
                // console.log(data)
                await storeData(data)
                navigation.navigate('Traitement')
            }
            else
            {
                alert('Le montant doit être supérieur à 300 FCFA')
            }
        }else{
            alert('Le montant doit être supérieur à 0 FCFA')
        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <AntDesign name="arrowleft" size={32} color="black" />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 22, lineHeight: 20, color:'#fff', backgroundColor:'#01AEB6', padding: 12, borderRadius: 13, width:202, height: 42, textAlign: 'center'}}>{datas?.action}</Text>
                    </View>
                </View>

            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0} style={styles.box}>
            
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 30}}>
                    <Text>Depuis</Text>
                    <Image source={ datas?.reseau == 'ORANGE' ? require('../assets/images/orange.png')  : 
                        datas?.reseau == 'MTN' ? require('../assets/images/mtn.jpg') : 
                        datas?.reseau == 'MOOV' ? require('../assets/images/moov.png') : 
                        require('../assets/images/wave.png')} style={{width: 50, height: 50, borderRadius: 100}}/>
                    <Text>{datas?.expediteur?.phoneNumbers[0].number}</Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}}>
                    <AntDesign name="down" size={24} color="black" />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 30, marginTop: 10}}>
                    <Text style={{marginRight: 18}}>Vers</Text>
                    <Image source={ datas?.reseauDestinataire == 'ORANGE' ? require('../assets/images/orange.png')  : 
                        datas?.reseauDestinataire == 'MTN' ? require('../assets/images/mtn.jpg') : 
                        datas?.reseauDestinataire == 'MOOV' ? require('../assets/images/moov.png') : 
                        require('../assets/images/wave.png')} style={{width: 50, height: 50, borderRadius: 100}}/>
                    <Text>{datas?.destinataire?.phoneNumbers[0].number}</Text>
                </View>

                <Text style={{fontSize: 16, lineHeight: 24, marginTop: 35, marginBottom: 10}}>Montant à envoyer en F CFA</Text>
                <TextInput 
                    style={{borderWidth: 1, borderColor: '#01AEB6', height: 48, fontSize: 14, lineHeight: 20, color: '#1f2937', borderRadius: 13, padding: 10}} 
                    placeholder='Min = 200 | Max =  400 000' 
                    keyboardType='numeric'
                    onChangeText={(text) => {
                        handleMontant(text)
                    }}
                    value={montant}
                />

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                    <Text>Je paye les frais</Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#01AEB6'}}
                        thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>



                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 40, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center'}}>

                    {isEnabled == true ? (
                        <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', marginBottom: 10, width: '100%' }}>
                            <Text>Montant à envoyer</Text>
                            <Text>{montant ? montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA' : '0 FCFA'}</Text>
                        </View>
                        {parseInt(montant) > 0 && (
                            <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', marginBottom: 10, width: '100%' }}>
                                <Text>Frais</Text>
                                <Text>{frais ? frais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA' : '0 FCFA'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', marginBottom: 10, width: '100%' }}>
                                <Text>Montant à prélever</Text>
                                <Text>{montantAPrelever ? montantAPrelever.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA' : '0 FCFA'}</Text>
                            </View>
                            </>
                        )}
                        </>
                    ) : (
                    
                    <View>
                        {parseInt(montant) > 0 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'flex-start', marginBottom: 10, width: '100%' }}>
                            <Text>Votre correspondant recevra</Text>
                            <Text>{montantAPrelever ? montantAPrelever.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA' : '0 FCFA'}</Text>
                        </View>
                        )}

                    </View>)} 


                        
                    <TouchableOpacity style={{borderWidth:1, borderColor: '#01AEB6', backgroundColor: '#188E94', padding: 12, borderRadius: 13, width:'100%', alignItems: 'center', justifyContent: 'center'}} onPress={handleEnvoyer}>
                        <Text style={{color: '#fff', fontSize: 16, lineHeight: 24, fontWeight: 'bold'}}>Envoyer</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

        </ScrollView>
  );
};

export default Transaction;

