import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback } from 'react'
import {AntDesign} from '@expo/vector-icons';
import { getData, getUserDatas, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import {styles} from '../assets/css/choixReseau'

const ChoixReseauDestinateur = ({navigation, route}:any) => {

    // let action = route.params.action
    const [modalVisible, setModalVisible] = React.useState(false);
    const [reseau, setReseau] = React.useState("");
    const [datas, setDatas] = React.useState<any>([]);

    const getDatas = async () => {
        const res:any = await getData();
        console.log(res[0])
        setDatas(res[0])
        // setUser(res);
    }

    useFocusEffect(
        useCallback(() => {
            getDatas()
        }, [])
    )


    const handleReseau = async (reseau: string) => {
        const currentData = [
            {
                action: datas.action,
                reseau: datas.reseau,
                expediteur: datas.expediteur,
                reseauDestinataire: reseau
            }
        ]
        console.log(currentData)
        await storeData(currentData)
        navigation.navigate("ChoixNumeroDestinataire")
    }

    // navigation.navigate({name: 'Transactions', params: {action: action, reseau: "ORANGE"}})

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'white' }]}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Tabs")}>
                    <AntDesign name="arrowleft" size={32} color="black" />
                </TouchableOpacity>
                <Text style={{ color: '#1AEB6', padding: 12, borderRadius: 13, fontSize: 20, fontWeight: 'bold', marginLeft: 20 }}>{datas?.action}</Text>
            </View>
            <ScrollView style={[styles.box, { paddingRight: 12, paddingLeft: 12, paddingTop: 20 }]}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, lineHeight: 28 }}>Quel réseau recevra les {datas?.action == 'Transfert' ? 'fonds' : `unités`} ?</Text>

                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0} style={{ marginTop: 20 }}>

                    {/* Orange Money */}
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
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChoixReseauDestinateur