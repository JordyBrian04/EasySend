import { View, Text, TouchableOpacity, TextInput, FlatList, RefreshControl, Modal, TouchableWithoutFeedback, SafeAreaView  } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts'
import { getData, storeContact, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import {styles} from '../assets/css/contact'

const ChoixContact = ({navigation, route}:any) => {

  const [numero, setNumero] = useState<any>([])
  const [contacts, setContacts] = useState<any>([])
  const [oldContacts, setOldContacts] = useState<any>([])
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [datas, setDatas] = React.useState<any>([]);
  
  const getDatas = async () => {
      const res = await getData();
      console.log('contact ',res[0])
      setDatas(res[0])
      // setUser(res);
  }
  // const id = route.params.id;
  // const action = route.params.action;
  // const reseau = route.params.reseau;

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
      refreshContact()
    }, [])
  )

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

  const valideContact = async (num:any) => {
    const data = [
      {destinataire: num, action: datas?.action, reseau: datas?.reseau}
    ]
    console.log(data)
    await storeData(data)
    navigation.navigate("Transaction")
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
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8}}>
                                <View style={{width: 32, height: 32, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', borderRadius: 100}}>
                                  <AntDesign name="user" size={24} color="white" />
                                </View>
                                <View style={{width: '75%'}} >
                                  <Text style={{fontSize: 14, lineHeight: 20, fontWeight: 'bold'}}>
                                    {numero && numero[0] && numero[0]?.name}
                                  </Text>
                                </View>
                        </View>

                        <View>
                        <FlatList
                          data={numero && numero[0].uniquePhoneNumbers}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => choixContact(item)}>
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


  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={32} color="white" />
      </TouchableOpacity>
      <Text style={{fontWeight: 'bold', fontSize: 30, lineHeight: 28, color:'#fff'}}>Achat {datas?.action}s</Text>
    </View>


      <View style={{backgroundColor: '#fff', height:'100%', padding: 12}}>
        {/* Header */}
        <Text style={{fontSize: 20, lineHeight: 28, fontWeight: 'bold'}}>Entrer le numéros à débiter</Text>
        <View style={{paddingTop: 12}}>
          <TextInput
            style={{borderBottomWidth: 1, borderColor: '#000', height: 48, fontSize: 14, lineHeight: 20, color: '#1f2937'}}
            placeholder='Entrez le numéro'
            autoCapitalize='sentences'
            autoCorrect={false}
            keyboardType='default'
            maxLength={10}
            onChangeText={(e) => rechercherContact(e)}
          />


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
      </View>
      {contactModal()}
    </SafeAreaView>
  )
}

export default ChoixContact