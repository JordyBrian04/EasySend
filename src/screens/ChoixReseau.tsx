import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback } from 'react'
import {AntDesign} from '@expo/vector-icons';
import { getData, getUserDatas, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import {styles} from '../assets/css/choixReseau'

const ChoixReseau = ({navigation, route}:any) => {

    // let action = route.params.action
    const [modalVisible, setModalVisible] = React.useState(false);
    const [reseau, setReseau] = React.useState("");
    const [datas, setDatas] = React.useState<any>([]);

    const getDatas = async () => {
        const res:any = await getData();
        console.log(res)
        setDatas(res)
        // setUser(res);
    }

    useFocusEffect(
        useCallback(() => {
            getDatas()
        }, [])
    )

    function renderModal(){
        return(
            <Modal visible={modalVisible} transparent animationType='fade'>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center', height: '100%' }]}>
                        <View style={[styles.modalBox, { width: '90%', zIndex: 20, padding: 24, borderRadius: 16, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>

                            <TouchableOpacity style={[styles.choix, { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, width: '45%' }]} onPress={handleMoiMeme}>
                                <Image source={require('../assets/images/orange.png')} style={{ width: 40, height: 40, resizeMode: 'cover' }} />
                                <View style={{ backgroundColor: '#f3f4f6', width: 40, height: 40, marginTop: 8, marginBottom: 8 }} />
                                <Text style={{ fontSize: 14, lineHeight: 20, color: '#4b5563' }}>Moi-même</Text>
                                <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: 'bold' }}>Orange Money</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.choix, { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, width: '45%' }]} onPress={handleAutre}>
                                <Image source={require('../assets/images/orange.png')} style={{ width: 40, height: 40, resizeMode: 'cover' }} />
                                <View style={{ backgroundColor: '#f3f4f6', width: 40, height: 40, marginTop: 8, marginBottom: 8 }} />
                                <Text style={{ fontSize: 14, lineHeight: 20, color: '#4b5563' }}>Autre personne</Text>
                                <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: 'bold' }}>Orange Money</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    const handleMoiMeme = async () => {
        const res = await getUserDatas()
        const data = [
            {
                destinataire: {name: res.nomcomplet, "phoneNumbers": [{number: res.numero}]},
                action: datas.action,
                reseau: reseau
            }
        ]
        await storeData(data)
        console.log(data)
        setModalVisible(false)
        navigation.navigate("Transaction")

        // if(datas?.action == 'internet')
        // {
        //     setModalVisible(false)
        //     navigation.navigate({name: 'ChoixPass', params: {action: datas?.action}})
        // }

        // if(datas?.action == 'unite')
        // {
        //     setModalVisible(false)
        //     navigation.navigate('Transaction')
        // }

        // if(datas?.action == 'minute')
        // {
        //     navigation.navigate('Transaction')
        // }
        // console.log(data)
    }

    const handleAutre = async () => {
        const currentData = [
            {
                action: datas.action,
                reseau: reseau
            }
        ]
        console.log(currentData)
        await storeData(currentData)
        setModalVisible(false)
        navigation.navigate("ChoixContact")
    }

    const handleReseau = async (reseau: string) => {
        const currentData = [
            {
                action: datas.action,
                reseau: reseau
            }
        ]
        await storeData(currentData)
        navigation.navigate("ChoixNumero")
    }

    // navigation.navigate({name: 'Transactions', params: {action: action, reseau: "ORANGE"}})

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <AntDesign name="arrowleft" size={32} color="black" />
                </TouchableOpacity>
                <View style={{justifyContent:'center', alignItems: 'center', width: '90%'}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, lineHeight: 20, color: '#fff', backgroundColor: '#01AEB6', padding: 12, borderRadius: 13, alignSelf: 'center'}}>{datas?.action}</Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 20, width: '100%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, lineHeight: 28 }}>Depuis quel réseau envoyer les {datas?.action == 'Transfert' ? 'fonds' : `unités`} ?</Text>

                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity style={[styles.btn, { borderRadius: 12, padding: 20, alignItems: 'center', backgroundColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }]} onPress={() => handleReseau("ORANGE")}>
                        <Image source={require('../assets/images/orange.png')} style={[styles.img, { width: 48, height: 48, backgroundColor: 'cover', borderRadius: 100 }]} />
                        <View style={{ width: '70%' }}>
                            <Text style={{ fontSize: 16, lineHeight: 24 }}>Orange Money</Text>
                        </View>
                        <View style={{ padding: 4, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                            <AntDesign name="right" size={17} color="#01AEB6" />
                        </View>
                    </TouchableOpacity>

                    {/* MTN */}
                    <TouchableOpacity style={[styles.btn, { borderRadius: 12, padding: 20, alignItems: 'center', backgroundColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }]} onPress={() => handleReseau("MTN")}>
                        <Image source={require('../assets/images/mtn.jpg')} style={[styles.img, { width: 48, height: 48, backgroundColor: 'cover', borderRadius: 100 }]} />
                        <View style={{ width: '70%' }}>
                            <Text style={{ fontSize: 16, lineHeight: 24 }}>MTN MoMo</Text>
                        </View>
                        <View style={{ padding: 4, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                            <AntDesign name="right" size={17} color="#01AEB6" />
                        </View>
                    </TouchableOpacity>

                    {/* MOOV */}
                    <TouchableOpacity style={[styles.btn, { borderRadius: 12, padding: 20, alignItems: 'center', backgroundColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }]} onPress={() => handleReseau("MOOV")}>
                        <Image source={require('../assets/images/moov.png')} style={[styles.img, { width: 48, height: 48, backgroundColor: 'cover', borderRadius: 100 }]} />
                        <View style={{ width: '70%' }}>
                            <Text style={{ fontSize: 16, lineHeight: 24 }}>Moov Money</Text>
                        </View>
                        <View style={{ padding: 4, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                            <AntDesign name="right" size={17} color="#01AEB6" />
                        </View>
                    </TouchableOpacity>

                    {/* WAVE */}
                    <TouchableOpacity style={[styles.btn, { borderRadius: 12, padding: 20, alignItems: 'center', backgroundColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }]} onPress={() => handleReseau("WAVE")}>
                        <Image source={require('../assets/images/wave.png')} style={[styles.img, { width: 48, height: 48, backgroundColor: 'cover', borderRadius: 100 }]} />
                        <View style={{ width: '70%' }}>
                            <Text style={{ fontSize: 16, lineHeight: 24 }}>Wave</Text>
                        </View>
                        <View style={{ padding: 4, alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                            <AntDesign name="right" size={17} color="#01AEB6" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {renderModal()}
        </SafeAreaView>
    )
}

export default ChoixReseau