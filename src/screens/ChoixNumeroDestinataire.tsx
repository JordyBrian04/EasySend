import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Dimensions, FlatList, RefreshControl, Modal, TouchableWithoutFeedback, Image, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { getConstante, getData, getUserDatas, saveContante, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetRefProps } from '../components/BottomSheet'
const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const {width: SCREEN_WIDTH} = Dimensions.get('window')
import * as Contacts from 'expo-contacts'

const ChoixNumeroDestinataire = ({navigation}:any) => {
    
    const [user, setUser] = React.useState<any>([]);
    const [datas, setDatas] = React.useState<any>([]);
    const [currentNumero, setCurrentNumero] = React.useState('');
    const [numero, setNumero] = React.useState<any>([])
    const [contacts, setContacts] = React.useState<any>([])
    const [oldContacts, setOldContacts] = React.useState<any>([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<BottomSheetRefProps>(null)
    const [reseau, setReseau] = useState('')

    const getDatas = async () => {
        // const res:any = await getData();
        const res:any = await getConstante('data')
        console.log(res)
        setDatas(res[0])    
    }

    const getUser = async () => {
        // const res:any = await getUserDatas();
        const res:any = await getConstante('user');
        setUser(res)
    }

    const refreshContact = async () => {
        setRefreshing(true);
        (async () => {
          const { status } = await Contacts.requestPermissionsAsync();
          //console.log(status)
          if (status === "granted") {
            const { data } = await Contacts.getContactsAsync({
              fields: [ Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers]
            });
            // console.log(data)
    
            if (data.length > 0) {
              setRefreshing(false);
              setContacts(data);
              setOldContacts(data)
            } else {
              setRefreshing(false);
              console.log("No contacts found");
            }
          } else {
            setRefreshing(false);
            console.log("Permission to access contacts denied.");
          }
        })();
      }

    useFocusEffect(
        useCallback(() => {
            getDatas()
            getUser()
            refreshContact()
        }, [])
    )

    const showModal = useCallback(async () => {
        ref.current?.scrollTo(-700)
      }, [])

      const handleContact = async (id:any) => {
        // alert(id)
        const selectedcontact = oldContacts.find((a:any) => a.id === id)
        if(selectedcontact.phoneNumbers && selectedcontact.phoneNumbers[0])
        {
          if(selectedcontact.phoneNumbers.length > 1)
            {
              //
              const uniqueNumbers = new Set(
                selectedcontact.phoneNumbers.map((phone:any) => phone.number.replace(/\s+/g, '').replace(/^(\+?225)/, ''))
              );
              selectedcontact.uniquePhoneNumbers = Array.from(uniqueNumbers)
              console.log([selectedcontact])
              await setNumero([selectedcontact])
              setModalVisible(true)
            }
            else{
              const num = selectedcontact.phoneNumbers[0].number.replace(/^(\+?225)/, '')
              const regex = /^(07|05|01)[0-9]{8}$/
              if(regex.test(num)){
                // storeContact(selectedcontact)
                // navigation.navigate("Transaction")
                console.log({name: selectedcontact.name, "phoneNumbers": [{number: num}]})
                valideContact({name: selectedcontact.name, "phoneNumbers": [{number: num}]})
              }else{
                alert('Numéro incorrect')
              }
            }
        }
        else
        {
          alert('Contact sans numéro')
        }
    
      }

      const valideContact = async (num:any) => {

        // console.log('currentNumero', currentNumero)
        // const data = [
        //   {expediteur: num, action: datas?.action, reseau: reseau}
        // ]
        const data = [
          {destinataire: num, action: datas?.action, reseau: datas?.reseau, expediteur: datas?.expediteur, reseauDestinataire: reseau}
        ]
        console.log(data)
        setCurrentNumero(num.phoneNumbers[0].number)
        setModalVisible(false)
        setOpen(false)
        ref.current?.scrollTo(0)
        // await storeData(data)
        await saveContante("data", JSON.stringify(data))
        // navigation.navigate("ChoixNumeroDestinataire")
      }

      const rechercherContact = (value:any) => {
        const filteredContacts = oldContacts.filter((contact:any) => contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].number.includes(value) || 
        contact.name && contact.name.includes(value))
        if(filteredContacts.length > 0)
        {
          setContacts(filteredContacts)
        }else{
          setNumero(value)
        }
      }

      const choixContact = (num:any) => {
        setModalVisible(false);
        num.replace(/^(\+?225)/, '')
        const regex = /^(07|05|01)[0-9]{8}$/
        if(regex.test(num)){
          console.log(numero)
          if (Array.isArray(numero)) {
            const filteredContacts = numero.filter((a:any) =>
              a.phoneNumbers?.some((phone:any) => phone.number === num)
            );
            // console.log('filtre !',numero[0].phoneNumbers);
            valideContact({name: numero[0].name, "phoneNumbers": [{number: num}]})
          } else {
            console.error("numero n'est pas un tableau : ", numero);
          }
        }else{
          alert('Numéro incorrect')
        }
    
      }

      function contactModal() {
        if (!numero || !numero[0]) {
          return null; // Si `numero` ou `numero[0]` est indéfini, n'affichez rien
        }
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalBox}>
                            {/* Header */}
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, gap:20}}>
                                    <View style={{width: 32, height: 32, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', borderRadius: 100}}>
                                      <AntDesign name="user" size={24} color="white" />
                                    </View>
                                    <View style={{width: '90%'}}>
                                      <Text style={{fontSize: 14, lineHeight: 20, fontWeight: 'bold'}}>
                                        {numero && numero[0] && numero[0]?.name}
                                      </Text>
                                    </View>
                            </View>
    
                            <View style={{overflow: 'scroll', marginBottom: 16, marginTop: 24, width:'100%'}}>
                            <FlatList
                              data={numero && numero[0].uniquePhoneNumbers}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => (
                                <TouchableOpacity style={{padding: 12, borderBottomWidth: 1, borderColor: '#4b5563', width:'100%'}} onPress={() => choixContact(item)}>
                                  <Text>{item}</Text>
                                </TouchableOpacity>
                              )}
                            />
                            </View>
    
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
      }

      const handleNext = () => {
        if(reseau == '')
          {
            alert('Veuillez sélectionner un réseau')
            return
          }

        if(currentNumero){
          switch (reseau)
          {
            case "ORANGE":
              const regex = /^(07)[0-9]{8}$/
              if(!regex.test(currentNumero))
              {
                alert("Le numéro n'est pas un numéro orange")
                return
              }
              break
              case "MOOV":
                const regex1 = /^(01)[0-9]{8}$/
                if(!regex1.test(currentNumero))
                {
                  alert("Le numéro n'est pas un numéro moov")
                  return
                }
                break
              case "MTN":
                const regex2 = /^(05)[0-9]{8}$/
                if(!regex2.test(currentNumero))
                {
                  alert("Le numéro n'est pas un numéro MTN")
                  return
                }
                break
          }

          navigation.navigate('Transaction')
        }else{
          alert('Veuillez entrer un numéro svp')
        }
      }

      const handleMoiMeme = async () => {
        if(reseau == '')
        {
          alert('Veuillez sélectionner un réseau svp')
          return
        }

        // const res = await getUserDatas()
        
        switch (reseau)
        {
          case "ORANGE":
            const regex = /^(07)[0-9]{8}$/
            if(!regex.test(user.numero))
            {
              alert("Le numéro n'est pas un numéro orange")
              return
            }
            break
            case "MOOV":
              const regex1 = /^(01)[0-9]{8}$/
              if(!regex1.test(user.numero))
              {
                alert("Le numéro n'est pas un numéro moov")
                return
              }
              break
            case "MTN":
              const regex2 = /^(05)[0-9]{8}$/
              if(!regex2.test(user.numero))
              {
                alert("Le numéro n'est pas un numéro MTN")
                return
              }
              break
        }

        // const data = [
        //     {
        //         expediteur: {name: user.nomcomplet, "phoneNumbers": [{number: user.numero}]},
        //         action: datas.action,
        //         reseau: reseau
        //     }
        // ]
        const data = [
          {
              destinataire: {name: user.nomcomplet, "phoneNumbers": [{number: user.numero}]},
              action: datas.action,
              reseau: datas.reseau,
              expediteur: datas.expediteur,
              reseauDestinataire: reseau
          }
      ]
        // await storeData(data)
        await saveContante("data", JSON.stringify(data))
        // console.log(data)
        navigation.navigate("Transaction")
    }

    return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle='dark-content' />
          <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} showsHorizontalScrollIndicator={false}>

            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 0} style={{paddingLeft: 12, paddingRight: 12}}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
                        <AntDesign name="arrowleft" size={32} color="black" />
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 22, lineHeight: 20, color:'#fff', backgroundColor:'#01AEB6', padding: 12, borderRadius: 13, width:202, height: 42, textAlign: 'center'}}>{datas?.action}</Text>
                    </View>
                </View>

                <Text style={{fontWeight: 'bold', fontSize: 20, lineHeight: 28, marginLeft: 12}} >Sélectionnez le réseau du destinataire </Text>

                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, padding: 20, marginBottom: 30}}>
                    
                    {/* WAVE */}
                    <TouchableOpacity style={{flexDirection: 'column',justifyContent:'center', alignItems: 'center', gap: 7}} onPress={() => setReseau("WAVE")}>
                      <View style={{borderWidth: 2, width: 60, height: 60,justifyContent:'center', alignItems: 'center', borderRadius: 10, borderColor: reseau == 'WAVE' ? '#1DC8FE' : 'rgba(241 245 249 / 1)'}}>
                          <Image source={require('../assets/images/wave.png')} style={{ width: 48, height: 48, backgroundColor: 'cover', borderRadius: 10 }} />
                      </View>
                        <Text style={{fontWeight: 400, fontSize: 20}}>Wave</Text>
                    </TouchableOpacity>
                    
                    {/* ORANGE */}
                    <TouchableOpacity style={{flexDirection: 'column',justifyContent:'center', alignItems: 'center', gap: 7}} onPress={() => setReseau("ORANGE")}>
                      <View style={{borderWidth: 2, width: 60, height: 60,justifyContent:'center', alignItems: 'center', borderRadius: 10, borderColor: reseau == 'ORANGE' ? '#FFB31B' : 'rgba(241 245 249 / 1)'}}>
                          <Image source={require('../assets/images/orange.png')} style={{ width: 48, height: 48, backgroundColor: 'cover', borderRadius: 10 }} />
                      </View>
                        <Text style={{fontWeight: 400, fontSize: 20}}>Orange</Text>
                    </TouchableOpacity>
                    
                    {/* WAVE */}
                    <TouchableOpacity style={{flexDirection: 'column',justifyContent:'center', alignItems: 'center', gap: 7}} onPress={() => setReseau("MTN")}>
                      <View style={{borderWidth: 2, width: 60, height: 60,justifyContent:'center', alignItems: 'center', borderRadius: 10, borderColor: reseau == 'MTN' ? '#FFCC06' : 'rgba(241 245 249 / 1)'}}>
                          <Image source={require('../assets/images/mtn.jpg')} style={{ width: 48, height: 48, backgroundColor: 'cover', borderRadius: 10 }} />
                      </View>
                        <Text style={{fontWeight: 400, fontSize: 20}}>Mtn</Text>
                    </TouchableOpacity>
                    
                    {/* WAVE */}
                    <TouchableOpacity style={{flexDirection: 'column',justifyContent:'center', alignItems: 'center', gap: 7}} onPress={() => setReseau("MOOV")}>
                      <View style={{borderWidth: 2, width: 60, height: 60,justifyContent:'center', alignItems: 'center', borderRadius: 10, borderColor: reseau == 'MOOV' ? '#005CA9' : 'rgba(241 245 249 / 1)'}}>
                          <Image source={require('../assets/images/moov.png')} style={{ width: 48, height: 48, backgroundColor: 'cover', borderRadius: 10 }} />
                      </View>
                        <Text style={{fontWeight: 400, fontSize: 20}}>Moov</Text>
                    </TouchableOpacity>


                </View>

                <Text style={{fontWeight: 'bold', fontSize: 20, lineHeight: 28, marginLeft: 12}} >Selectionnez son numéro</Text>

                <TouchableOpacity style={styles.box} onPress={handleMoiMeme}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, width:'90%'}}>
                    <Text style={{fontSize: 16, lineHeight: 24}}>Mon numéro :</Text>
                    <Text style={{fontSize: 16, lineHeight: 24, fontWeight: 'bold'}}>{user?.numero}</Text>
                  </View>
                  <AntDesign name="right" size={17} color="#01AEB6" />
                </TouchableOpacity>

                <Text style={{fontSize: 16, lineHeight: 24, marginTop: 30, marginLeft: 12}}>Entrez un autre numéro</Text>

                <View style={styles.inputBox}>

                    <TextInput
                        style={styles.input}
                        placeholder="00 00 00 00 00"
                        placeholderTextColor="#6b7280"
                        value={currentNumero}
                        onChangeText={setCurrentNumero}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />

                    <TouchableOpacity onPress={() => showModal()}>
                        <MaterialCommunityIcons name="contacts" size={30} color="black" />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
            <View style={{height: SCREEN_HEIGHT, width: SCREEN_WIDTH, display: open ? 'flex' : 'none', position: 'absolute', backgroundColor:"#0000002a"}}></View>
            <BottomSheet ref={ref}>
                <View style={{padding: 12}}>

                <TextInput
                    style={{borderWidth: 1, borderColor: '#01AEB6', height: 48, fontSize: 14, lineHeight: 20, color: '#1f2937', borderRadius: 13, padding: 10}}
                    placeholder='Entrez le numéro'
                    autoCapitalize='sentences'
                    autoCorrect={false}
                    keyboardType='default'
                    maxLength={10}
                    onChangeText={(e) => rechercherContact(e)}
                />

                <Text style={{fontSize: 16, lineHeight: 24, marginBottom: 12, marginTop: 12}}>Selectionnez un contact ({contacts.length})</Text>
                    <FlatList
                        data={contacts}
                        keyExtractor={(item) => item.id}
                        style={{paddingBottom:20, marginBottom:20, marginTop:6}}
                        renderItem={({ item }) => (
                        <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#4b5563'}}
                            onPress={() => handleContact(item.id)}
                        >
                            <View style={{width: 32, height: 32, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', borderRadius: 100}}>
                            <AntDesign name="user" size={24} color="white" />
                            </View>
                            <View style={{width: '75%'}}>
                            <Text style={{fontSize: 14, lineHeight: 20, fontWeight: 'bold'}}>
                                {item.name}
                            </Text>
                            <Text style={{fontSize: 14, lineHeight: 20, fontWeight: 'bold'}}>
                                {item.phoneNumbers && item.phoneNumbers[0] && item.phoneNumbers[0].number}
                            </Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={30} color="black" />
                        </TouchableOpacity>
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={refreshContact}
                            />
                        }
                    />
                </View>
            </BottomSheet>

            <View style={{position: 'absolute', bottom: -30, left: 0, right: 0, paddingBottom: 40, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity style={{borderWidth:1, borderColor: '#01AEB6', padding: 12, borderRadius: 13, width:'100%', alignItems: 'center', justifyContent: 'center'}} onPress={handleNext}>
                <Text style={{color: '#01AEB6', fontSize: 16, lineHeight: 24, fontWeight: 'bold'}}>Suivant</Text>
              </TouchableOpacity>
            </View>
            {contactModal()}
          </ScrollView>
        </SafeAreaView>
    );
};

export default ChoixNumeroDestinataire;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF'
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        gap: 10,
        marginBottom: 20
    },
    box:{
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        backgroundColor: '#F5F5F5',
        marginTop: 15,
        borderRadius: 13,
        alignItems: 'center',
        height: 58
    },
    inputBox:{
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        backgroundColor: '#F5F5F5',
        marginTop: 10,
        borderRadius: 13,
        alignItems: 'center'
    },
    input:{
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#F5F5F5',
        borderRadius: 13,
        paddingHorizontal: 12,
        color: '#6b7280'
    },
    modalContainer:{
        flex:1,
        backgroundColor: '#0000001a',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    modalBox:{
        width: '100%',
        backgroundColor: '#fff',
        zIndex: 40,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        paddingBottom: 30
        // justifyContent: 'space-between',
        // flexDirection: 'column',
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0
    },
});
