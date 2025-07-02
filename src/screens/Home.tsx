import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import {AntDesign, FontAwesome5, FontAwesome, Feather, Entypo, Ionicons } from '@expo/vector-icons';
import "../../global.css"
import {styles} from '../assets/css/home'
import { getConstante, getUserDatas, saveContante, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { getAllPub, getUserOnline,  getLastTransaction } from '../services/OnlineDB';
import * as Network from 'expo-network';
import { addEventListener } from "@react-native-community/netinfo";
import { getAllUserTransaction, update_user } from '../services/localDB';
import { getPub } from '../services/apiService';

const Home = ({navigation}:any) => {

    const widthScreen = Dimensions.get('window').width
    const heightScreen = Dimensions.get('window').height
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [currentUser, setUser] = useState<any>([]);
    const [refresh, setRefreshing] = useState(false);
    const [pub, setPub] = useState<any>([]);
    const [transaction, setTransaction] = useState<any>([]);

    // Chargement des données utilisateur au montage
    const fetchUserData = async () => {
        // const userData = await getUserDatas();
        const userData = await getConstante("user");
        console.log("home", userData)
        await setUser(userData);
    };

    // Récupération des données de publicité
    const getAllPub = async () => {
        // console.log(await getPub)
        await getPub()
        .then((res) => {
            // console.log(res.data?.pubs)
            setPub(res.data?.pubs)
        })
        .catch((err) => {
            console.log('error pub', err.message)
            if (err.response) {
                console.log('Réponse erreur:', err.response.data);
                console.log('Code erreur:', err.response.status);
              } else {
                console.log('Erreur inconnue:', err);
              }
        })
        // setPub(await getAllPub())
    }

    const getTransaction = async () => {
        setTransaction(await getAllUserTransaction())
        // console.log(await getLastTransaction())
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();

            getAllPub()
            getTransaction()
        }, [])
    )

    // Vérification de la connexion à Internet
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        const handleConnectionChange = (state: any) => {
            console.log("Connection", state);
            setIsConnected(state.isConnected);
            console.log("Is connected?", state.isConnected);
        };
        // Subscribe
        // const unsubscribe = addEventListener(state => {
        //     // setIsConnected(state.isConnected);
        //     console.log("Connection", state);
        //     return state

        //     console.log("Is connected?", state.isConnected);
        // });
        const unsubscribe = addEventListener(handleConnectionChange);

        const checkConnection = async () => {
        try {

            const networkState = await Network.getNetworkStateAsync();
            // console.log(isConnected)
            // setIsConnected(networkState.isConnected ?? false);

            if (isConnected) {
                setRefreshing(true)
                await getTransaction()
                setRefreshing(false)
            }
        } catch (error) {
            console.error("Failed to get network status:", error);
            setIsConnected(false);
        }
        };

        const startChecking = () => {
            checkConnection(); // Appel initial
            // interval = setInterval(checkConnection, 1000); // Vérification périodique
        };

        startChecking();

        // return () => clearInterval(interval); // Nettoyage
    }, [currentUser]);



    
    const handleValide = async (action:string) => {
        // await storeData({action: action})
        await saveContante('data', JSON.stringify({action: action}))
        navigation.navigate('ChoixNumero')
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <AntDesign name="setting" size={28} color="white" />
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        {/* <TouchableOpacity>
                            <FontAwesome5 name="bell" size={28} color="white" />
                        </TouchableOpacity> */}

                        <TouchableOpacity>
                            <AntDesign name="customerservice" size={28} color="white" style={{marginLeft: 16}} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{marginTop: 20, alignItems: 'center', flexDirection: 'row', gap: 10, marginLeft: 10}}>
                    {/* <Image source={require('../assets/images/hello.png')} style={{width: 40, height: 40, borderRadius: 50}} /> */}
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}> 👋 Hey, {currentUser?.nomcomplet}</Text>
                </View>

                <View style={styles.BtnGroup}>

                    <TouchableOpacity style={styles.Btn} onPress={() => handleValide('Transfert')}>
                        <FontAwesome name="send-o" size={24} color="white" />
                        <Text style={styles.BtnText}>Transfert</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Btn} onPress={() => alert('Bientôt disponible...')}>
                        <Ionicons name="gift-outline" size={24} color="white" />
                        <Text style={styles.BtnText}>Cadeaux</Text>
                    </TouchableOpacity>

                </View>

                <View style={[styles.body, {height: heightScreen}]}>

                    {pub.length &&
                    
                        <View style={[styles.pub, {width: widthScreen}]}>
                            
                            <ScrollView style={{flexDirection: 'row', gap: 15}} horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                            {pub && pub.map((p:any) => {
                                return (
                                    <View key={p.id} style={{width: widthScreen - 28, flexDirection: 'row', alignItems: 'center', gap: 10, height: '100%', backgroundColor: '#f5f5f5', borderRadius: 20, padding: 10, marginLeft: 10}}>  
                                        {/* <TouchableOpacity style={{alignSelf: 'flex-end'}}>
                                            <Entypo name="cross" size={24} color="black" />
                                        </TouchableOpacity> */}
                                        {/* <View style={{flexDirection: 'row', alignItems: 'center', gap: 10,}}> */}
                                            <View>
                                                <Image source={{uri: p.image}} style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 100}} />
                                            </View>
                                            <View style={{width: '70%'}}>
                                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{p.titre}</Text>
                                                <Text style={{flexWrap: 'wrap', fontSize: 16}}>{p.description}</Text>
                                            </View>
                                        {/* </View> */}
                                    </View>
                                )
                            })}

                            </ScrollView>
                        </View>
                    }

                    <View style={styles.historique}>

                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Mes dernières transactions</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Historique')}>
                                <Text style={{color: '#01AEB6'}}>Voir tout</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 20}}>

                            {transaction && transaction.length > 0 ? (
                                <FlatList
                                    data={transaction.slice(0, 100)}
                                    keyExtractor={(item) => item.id}
                                    style={{height: '100%'}}
                                    renderItem={({item}) => {
                                        return (
                                            <TouchableOpacity onPress={() => navigation.navigate('DetailTransaction', {id: item.id})}>
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
                                    }}
                                    refreshControl={
                                        <RefreshControl refreshing={refresh} onRefresh={() => getTransaction()} />
                                    }
                                />
                            ) : (
                                <View style={{justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
                                    <Text>Aucune transaction</Text>
                                </View>
                            )}
                            
                            {/* Historique */}


                            {/* <TouchableOpacity>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
                                    <FontAwesome name="send-o" size={19} color="black" />
                                    <View style={{width: '65%'}}>
                                        <Text>au 01 00 55 78 99</Text>
                                        <Text>15/03/2025 15:30:00</Text>
                                    </View>
                                    <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                        <Text style={{fontWeight: "bold", color: '#06871D'}}>400 CFA</Text>
                                        <View style={{padding: 5, borderRadius: 100, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-end'}}>
                                            <Image style={{width: 18, height: 18, resizeMode: 'cover', borderRadius: 100}} source={require('../assets/images/wave.png')} />
                                            <AntDesign name="arrowright" size={24} color="black" />
                                            <Image style={{width: 18, height: 18, resizeMode: 'cover', borderRadius: 100}} source={require('../assets/images/orange.png')} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity> */}

                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Home