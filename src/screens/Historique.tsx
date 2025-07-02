import React, {
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
    useEffect,
    useCallback
  } from 'react'
import { Text, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Image } from 'react-native';
import {Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { getAllTransaction } from '../services/OnlineDB';
import { getAllUserTransaction } from '../services/localDB';

const Historique = ({navigation}:any) => {

    const [transactions, setTransaction] = useState<any>([])
    const [oldTransactions, setOldTransaction] = useState<any>([])
    const [currentMois, setMois] = React.useState('')
    const scrollMoisViewRef: any = useRef(null)

    const optionsMois: any = {
        month: 'long'
    }

    React.useEffect(() => {
        const currentMonthIndex = new Date().getMonth()
        // console.log(new Date().toLocaleString('fr-FR', optionsMois))
        setMois(new Date().toLocaleString('fr-FR', optionsMois))
        // setAnnee(value.getFullYear())
        const x = currentMonthIndex * 56 // ITEM_WIDTH est la largeur d'un élément dans votre ScrollView
        if (scrollMoisViewRef.current) {
          scrollMoisViewRef.current.scrollTo({ x, animated: true })
        }
    }, [])


    const getTransactions = async () => {
        const res:any = await getAllUserTransaction()
        setOldTransaction(res)
        // console.log(currentMois)
        setTransaction(res.filter((row:any) => new Date(row.cree_le).toLocaleString('fr-FR', optionsMois) == currentMois).map((datas:any) => ({
            id: datas.id,
            numero_compte_destination: datas.numero_compte_destination,
            etat: datas.etat,
            montant: datas.montant,
            cree_le: datas.cree_le,
            reseau_depart: datas.reseau_depart,
            reseau_arrive: datas.reseau_arrive
        })))
    }

    useEffect(() => {
        getTransactions()
    }, [currentMois])

    const mois = [
        { key: 'Jan', value: 'janvier' },
        { key: 'Fev', value: 'février' },
        { key: 'Mar', value: 'mars' },
        { key: 'Avr', value: 'avril' },
        { key: 'Mai', value: 'mai' },
        { key: 'Jui', value: 'juin' },
        { key: 'Jul', value: 'juillet' },
        { key: 'Aou', value: 'août' },
        { key: 'Sep', value: 'septembre' },
        { key: 'Oct', value: 'octobre' },
        { key: 'Nov', value: 'novembre' },
        { key: 'Dec', value: 'décembre' }
    ]

    const rechercherContact = (value:any) => {
        // console.log(value)
        const filteredContacts = transactions.filter((contact:any) => contact.numero_compte_destination.includes(value))
        setTransaction(filteredContacts)
        if(value != '')
        {
            setTransaction(filteredContacts)
        }
        else
        {
            setTransaction(oldTransactions.filter((row:any) => new Date(row.cree_le).toLocaleString('fr-FR', optionsMois) == currentMois).map((datas:any) => ({
                id: datas.id,
                numero_compte_destination: datas.numero_compte_destination,
                etat: datas.etat,
                montant: datas.montant,
                cree_le: datas.cree_le,
                reseau_depart: datas.reseau_depart,
                reseau_arrive: datas.reseau_arrive
            })))
        }
        console.log(filteredContacts)
        
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        // Récupération des composants de la date
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois commencent à 0
        const annee = date.getFullYear();
        const heures = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const secondes = date.getSeconds().toString().padStart(2, '0');
    
        // Construction de la chaîne formatée
        return `${jour}/${mois}/${annee} à ${heures}:${minutes}:${secondes}`;
    }

    const handleOnDateChange = (val: any) => {
        // console.log(val,oldTransactions.map((data:any) => ({mois: new Date(data.cree_le).toLocaleString('fr-FR', optionsMois)})))
        setTransaction(oldTransactions.filter((row:any) => new Date(row.cree_le).toLocaleString('fr-FR', optionsMois) == val).map((datas:any) => ({
            id: datas.id,
            numero_compte_destination: datas.numero_compte_destination,
            etat: datas.etat,
            montant: datas.montant,
            cree_le: datas.cree_le,
            reseau_depart: datas.reseau_depart,
            reseau_arrive: datas.reseau_arrive
        })))
    }


  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle='dark-content' />
        <ScrollView style={{flex:1, padding: 15}}>
            <View style={styles.header}>
                {/* <TouchableOpacity onPress={() => navigation.navigate("Tabs")}>
                    <AntDesign name="arrowleft" size={32} color="black" />
                </TouchableOpacity> */}
                <View style={{justifyContent:'center', alignItems: 'center', width: '90%'}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, lineHeight: 20, color: '#fff', backgroundColor: '#01AEB6', padding: 12, borderRadius: 13, alignSelf: 'center'}}>Mes transactions</Text>
                </View>
            </View>

            <TextInput
                style={{borderWidth: 1, borderColor: '#00000033', height: 48, fontSize: 14, lineHeight: 20, color: '#000', borderRadius: 10, padding:10}}
                placeholder='Rechercher par numéro'
                autoCorrect={false}
                keyboardType='phone-pad'
                maxLength={10}
                onChangeText={(e) => rechercherContact(e)}
            />

            <ScrollView horizontal ref={scrollMoisViewRef} style={{marginTop: 22}} showsHorizontalScrollIndicator={false}>
            {mois.map((month, index) => {
                      const isActive = currentMois === month.value
                      return (
                        <View
                          key={index}
                          style={{ paddingHorizontal: 8 }}
                        >
                          <TouchableWithoutFeedback
                            onPress={() => [
                              setMois(month.value),
                                handleOnDateChange(month.value)
                            ]}
                          >
                            <View
                              style={{ backgroundColor: isActive ? '#188E94':'#DCE7E8', padding: 12, borderRadius: 10, width: 100, justifyContent: 'center', alignItems: 'center' }}
                            >
                              <Text
                                style={{ color: isActive ? '#fff':'#188E94', fontSize: 16, fontWeight: '400'}}
                              >
                                {month.value}
                              </Text>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      )
                    })}
            </ScrollView>

            <View>
                {transactions.map((item:any, index:any) => {
                    return(
                        <TouchableOpacity key={item.id} onPress={() => navigation.navigate('DetailTransaction', {id: item.id})}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 25, width: '100%'}}>
                                <FontAwesome name="send-o" size={16} color="black" style={{opacity: 1}} />
                                {/* <View style={{width: '65%'}}>
                                    <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 5}}>au {item.numero_compte_destination}</Text>
                                    <Text style={{fontSize: 11, fontWeight: '400'}}>{formatDate(item.cree_le)}</Text>
                                </View> */}
                                <View style={{width: '90%'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 15, fontWeight: '400'}}>au {item.numero_compte_destination}</Text>
                                        <Text style={{fontWeight: "400", alignSelf: 'flex-end', fontSize: 15, color: item.etat == 0 ? '#FF0505' : '#06871D', textDecorationLine: item.etat == 0 ? 'line-through' : 'none'}}>{item.montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} F CFA</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -4}}>
                                        <Text style={{fontSize: 11, fontWeight: '400'}}>{formatDate(item.cree_le)}</Text>
                                        <View style={{padding: 5, borderRadius: 100, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-end'}}>
                                            <Image style={{width: 23, height: 23, resizeMode: 'cover', borderRadius: 100}} source={
                                                item?.reseau_depart == 'ORANGE' ? require('../assets/images/orange.png')  : 
                                                item?.reseau_depart == 'MTN' ? require('../assets/images/mtn.jpg') : 
                                                item?.reseau_depart == 'MOOV' ? require('../assets/images/moov.png') : 
                                                require('../assets/images/wave.png')
                                            } />
                                            <AntDesign name="arrowright" size={17} color="black" />
                                            <Image style={{width: 23, height: 23, resizeMode: 'cover', borderRadius: 100}} source={
                                                item?.reseau_arrive == 'ORANGE' ? require('../assets/images/orange.png')  : 
                                                item?.reseau_arrive == 'MTN' ? require('../assets/images/mtn.jpg') : 
                                                item?.reseau_arrive == 'MOOV' ? require('../assets/images/moov.png') : 
                                                require('../assets/images/wave.png')
                                            } />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default Historique;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white'
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // paddingLeft: 12,
    // paddingRight: 12,
    // paddingTop: 50,
    // gap: 10,
    marginBottom: 20
},
});
