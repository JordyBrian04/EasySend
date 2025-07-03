import { View, Text, ActivityIndicator, Platform, Alert, StatusBar, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import * as SQLite from 'expo-sqlite';
import "../../global.css"
import { useFonts } from "expo-font";
import {AntDesign, Entypo, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import SplashScreen from '../screens/SplashScreen';
import Connexion from '../screens/Connexion';
import Inscription from '../screens/Inscription';
import Home from '../screens/Home';
import ChoixReseau from '../screens/ChoixReseau';
import ChoixContact from '../screens/choixContact';
import Transaction from '../screens/Transaction';
import ChoixNumero from '../screens/ChoixNumero';
import ChoixReseauDestinateur from '../screens/ChoixReseauDestinateur';
import ChoixNumeroDestinataire from '../screens/ChoixNumeroDestinataire';
import Traitement from '../screens/Traitement';
import DetailTransaction from '../screens/DetailTransaction';
import Confirmation from '../screens/Confirmation';
import Profil from '../screens/Profil';
import Parrainage from '../screens/Parrainage';
import Historique from '../screens/Historique';
import FAQ from '../screens/ServiceClient';
import ResultatTransaction from '../screens/ResultatTransaction';
import choixDestination from '../screens/choixDestination';
import ChoixNumeroInter from '../screens/ChoixNumeroInter';
import ChoixNumeroDestinataireInter from '../screens/ChoixNumeroDestinataireInter';
import TransactionInter from '../screens/TransactionInter';


// import { getUserDatas, storeNumCompte, storeUserDatas } from '../services/AsyncStorage';
import { saveContante, getConstante, storeData, deleteConstante } from '../services/AsyncStorage';
import { synchroTransaction } from '../services/localDB';


const Stack = createNativeStackNavigator();
const db = SQLite.openDatabaseAsync('local_easy_send.db');
const Drawer = createDrawerNavigator()
const TabStack = createBottomTabNavigator()


const AppNavigation = () => {

    const [initialRoute, setInitialRoute] = useState<string | null>(null);
    const [initial, setInitiales] = useState('')
    const [user, setUser] = useState<any>([])

    // const [fontsLoaded] = useFonts({
    //   Bold : require("../assets/fonts/Poppins-Bold.ttf"),
    //   Regular : require("../assets/fonts/Poppins-Regular.ttf"),
    //   SemiBold : require("../assets/fonts/Poppins-SemiBold.ttf")
    // })

    // if(!fontsLoaded){
    //   return undefined
    // }
    
    const initDatabase = async () => {
        try {
            (await db).execAsync(`
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS easy_send_user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nomcomplet TEXT NOT NULL,
                    numero TEXT NOT NULL,
                    code_parrainage TEXT NOT NULL,
                    date_naissance DATE NULL
                );

                CREATE TABLE IF NOT EXISTS easy_send_transaction (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    numero_transaction TEXT NOT NULL,
                    utilisateur_id INTEGER NOT NULL,
                    type_transaction TEXT NOT NULL,
                    numero_compte_source TEXT NOT NULL,
                    numero_compte_destination TEXT NOT NULL,
                    montant DOUBLE NOT NULL,
                    frais DOUBLE NOT NULL,
                    reseau_depart TEXT NOT NULL,
                    reseau_arrive TEXT NOT NULL,
                    etat INTEGER NOT NULL,
                    cree_le TIMESTAMP NOT NULL
                );
            `);

            // refresh_token TEXT
            // access_token TEXT,
            // ALTER TABLE easy_send_user ADD access_token TEXT;
            // ALTER TABLE easy_send_user ADD refresh_token TEXT;

            console.log('Database initialized successfully');
            try {
                //await (await db).runAsync('DELETE FROM easy_send_user')
                // await (await db).runAsync("UPDATE user_local SET mdp='1234'")
                const get_user:any = await (await db).getFirstAsync('SELECT * FROM easy_send_user');
                console.log('userdata ',get_user)
                if(get_user)
                {
                  await saveContante("numero", JSON.stringify(get_user?.numero))
                  await saveContante("user", JSON.stringify(get_user))
                  await synchroTransaction()
                  // await storeNumCompte(get_user?.numero)
                  // await storeUserDatas(get_user)
                  // return 'Home'
                  return 'Tabs'
                }
                else
                {
                  await deleteConstante("token")
                  await deleteConstante("numero")
                  await deleteConstante("user")
                  return 'SplashScreen'
                }
                // console.log('userdata ',get_user)
                // setInitialRoute(get_user ? 'LockScreen' : 'Connexion');
              } catch (error) {
                console.log('Error : ', error);
                return 'Connexion'
              }
            // await (await db).runAsync("UPDATE user SET nom_complet='Jordy Brian', numero='0797799890'")
            // await (await db).runAsync('DELETE FROM user')
            // const get_user:any = await (await db).getFirstAsync('SELECT * FROM user');
            // console.log('userdata ',get_user)
        } catch (error) {
            Alert.alert("Erreur de la création de la Base de données")
            console.log('Database not created : ', error);
        }
    }

    const fetchUserData = async () => {
      // const userData = await getUserDatas();
      const userData = await getConstante("user");
      console.log('userData', userData)
      setUser(userData)
      const nom = userData != null ? userData.nom_complet || userData.nomcomplet : ''
      const words = nom.split(' ')
      const initials = words.slice(0, 2).map((word: any) => word.charAt(0))
      const initialsString = initials.join('')
      setInitiales(initialsString)
      // console.log('draw ',initialsString)
  };

    //  useEffect(() => {
    //     setTimeout( async () => {
    //       if(user)
    //       {
    //         await synchroTransaction()
    //       }
    //     }, 10000)
    // })

    useEffect(() => {
        const initialize = async () => {
          const route:any = await initDatabase();
          // console.log('route : ', route)
          setInitialRoute(route);
        };
        initialize();
        fetchUserData()
      }, [])

      const LoadingScreen = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Chargement...</Text>
        </View>
      );

      const HomeWithDrawer = () => {
        return (
          <Drawer.Navigator 
            initialRouteName='Home' 
            screenOptions={{
              headerShown: false,
              drawerStyle: {
                backgroundColor: '#188E94',
                width: 300,
                // height: 700,
                padding: 0
              }
            }}
            drawerContent={props => (
              <DrawerContentScrollView {...props}>
                <View>
                  <StatusBar barStyle='light-content' />
                  <View style={{backgroundColor: '#188E94', padding: 20, width: '100%'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 5}}>
                      <View style={{width: 80, height: 80, backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 30, color: '#01AEB6', fontWeight: 'bold'}}>{initial}</Text>
                      </View>
                      <View style={{flexDirection: 'column', gap: 10}}>
                        <Text style={{fontSize: 25, color: 'white'}}>{user && user.nomcomplet || ''}</Text>
                        <Text style={{fontSize: 20, color: 'white'}}>{user && user.numero || ''}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{padding: 20, flex: 1, backgroundColor: '#F8F8F8', width: 400, marginLeft: -50, height: 630}}>
                    <View style={{gap: 30, marginLeft: 50, marginTop: 20}}>

                      <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '75%'}} onPress={() => props.navigation.navigate('Profil')}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                          <FontAwesome name="user-o" size={24} color="black" />
                          <Text style={{fontSize: 20}}>Mon profil</Text>
                        </View>
                        <AntDesign name="right" size={17} color="#01AEB6" />
                      </TouchableOpacity>

                      <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '75%'}} onPress={() => props.navigation.navigate('Parrainage')}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                          <AntDesign name="sharealt" size={24} color="black" />
                          <Text style={{fontSize: 20}}>Partager l'app</Text>
                        </View>
                        <AntDesign name="right" size={17} color="#01AEB6" />
                      </TouchableOpacity>

                      <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '75%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                          <AntDesign name="wechat" size={24} color="black" />
                          <Text style={{fontSize: 20}}>FAQ</Text>
                        </View>
                        <AntDesign name="right" size={17} color="#01AEB6" />
                      </TouchableOpacity>

                      <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '75%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                          <MaterialCommunityIcons name="script-text-outline" size={24} color="black" />
                          <Text style={{fontSize: 20}}>CGU</Text>
                        </View>
                        <AntDesign name="right" size={17} color="#01AEB6" />
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 190}}
                        onPress={() => {
                          Alert.alert(
                            'Déconnexion', 
                            'Êtes-vous sûr de vouloir vous déconnecter ?',
                            [
                              {
                                text: 'Annuler',
                                style: 'cancel',
                              },
                              {
                                text: 'Oui',
                                onPress: async () => {
                                  try {
                                    await (await db).runAsync('DELETE FROM user');
                                    props.navigation.reset({
                                      index: 0,
                                      routes: [{ name: 'Connexion' }],
                                    });
                                  } catch (error) {
                                    console.error('Erreur lors de la déconnexion:', error);
                                  }
                                },
                              },
                            ],
                          );
                        }}
                      >
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
                          <Feather name="log-out" size={24} color="black" />
                          <Text style={{fontSize: 22}}>Déconnexion</Text>
                        </View>
                        <AntDesign name="right" size={17} color="#01AEB6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </DrawerContentScrollView>
            )}>
            <Drawer.Screen name='Home' component={Home}/>
          </Drawer.Navigator>
        )
      }

      const screenOptions:any = ({route, focus}:any) => ({
        tabBarIcon : ({focused}:any) => {
            const [image, setImage] = useState("")
            let icon: any = null;
            const size = 24
            const color = focused ? "#188E94" : "#838383";
            const font = focused ? <View></View> : <View></View>
      
            // db.transaction(tx => {
            //   tx.executeSql(
            //     "SELECT image from data LIMIT 1", 
            //     [],
            //     (_, result) => {
            //       //console.log(result.rows._array[0].image);
            //       setImage(result.rows._array[0].image)
            //     },
            //     (_, err) => {
            //       console.log(err);
            //       return false;
            //     }
            //   )
            // })
          
            switch (route.name) {
              case "Accueil":
                icon =
                      <View>
                          {/* <Text>Accueil</Text> */}
                          <AntDesign name="home" size={24} color={color} />
                      </View>
                break;
              case "Historique":
                  icon =                       
                    <View>
                        {/* <Text>{route.name}</Text> */}
                        <MaterialCommunityIcons name="history" size={24} color={color} />
                    </View>
                break;
              case "FAQ":
                  icon =
                      <View>
                        {/* <Text>{route.name}</Text> */}
                        <AntDesign name="customerservice" size={24} color={color} />
                      </View>
                break;
              case "Profil":
                  icon = 
                    <View>
                      {/* <Text>{route.name}</Text> */}
                      <AntDesign name="user" size={24} color={color} />
                    </View>
                break;
            }
          
            return icon
          }, 
        
          tabBarActiveTintColor: '#188E94',
          tabBarInactiveTintColor: '#5C5E5F',
          tabBarLabelStyle: {
            fontSize: 13,
            display: 'flex'
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            width: 'full',
            height: 80,
          },
        })

        const TabStackScreens = () => {
          return (
            <TabStack.Navigator initialRouteName='Accueil' screenOptions={screenOptions}>
              <TabStack.Screen name="Accueil" component={HomeWithDrawer} options={{headerShown: false}} />
              <TabStack.Screen options={{ headerShown: false }} name="Historique" component={Historique} />
              <TabStack.Screen options={{ headerShown: false }} name="FAQ" component={FAQ} />
              <TabStack.Screen options={{ headerShown: false }} name="Profil" component={Profil} />
            </TabStack.Navigator>
          )
        }

      if (!initialRoute) {
        // Afficher l'écran de chargement tant que l'initialisation n'est pas terminée
        return <LoadingScreen />;
      }

      const linking = {
        prefixes: ['http://127.0.0.1/parrainage'],
        config: {
          screens: {
            RegisterScreen: 'Inscription/:inviteCode',
          },
        },
      }

    return (
        <NavigationContainer linking={linking}>
          {/* <Stack.Navigator initialRouteName={initialRoute}> */}
            <Stack.Navigator initialRouteName='Tabs'>
                <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false, gestureEnabled: false}}/>
                <Stack.Screen name="Connexion" component={Connexion} options={{headerShown: false, gestureEnabled: false}}/>
                <Stack.Screen name="Inscription" component={Inscription} options={{headerShown: false}}/>
                <Stack.Screen options={{headerShown: false}} name="Tabs" component={TabStackScreens}/>
                {/* <Stack.Screen name="Home" component={HomeWithDrawer} options={{headerShown: false, gestureEnabled: false}}/> */}
                <Stack.Screen name="ChoixReseau" component={ChoixReseau} options={{headerShown: false}}/>
                <Stack.Screen name="ChoixContact" component={ChoixContact} options={{headerShown: false}}/>
                <Stack.Screen name="Transaction" component={Transaction} options={{headerShown: false}}/>
                <Stack.Screen name="ChoixNumero" component={ChoixNumero} options={{headerShown: false}}/>
                <Stack.Screen name="ChoixReseauDestinateur" component={ChoixReseauDestinateur} options={{headerShown: false}}/>
                <Stack.Screen name="ChoixNumeroDestinataire" component={ChoixNumeroDestinataire} options={{headerShown: false}}/>
                <Stack.Screen name="Traitement" component={Traitement} options={{headerShown: false}}/>
                <Stack.Screen name="DetailTransaction" component={DetailTransaction} options={{headerShown: false}}/>
                <Stack.Screen name="Confirmation" component={Confirmation} options={{headerShown: false}}/>
                <Stack.Screen name="Profil" component={Profil} options={{headerShown: false}}/>
                <Stack.Screen name="Parrainage" component={Parrainage} options={{headerShown: false}}/>
                <Stack.Screen name="ResultatTransaction" component={ResultatTransaction} options={{headerShown: false}}/>
                <Stack.Screen name="choixDestination" component={choixDestination} options={{headerShown: false}}/>
                <Stack.Screen name="ChoixNumeroInter" component={ChoixNumeroInter} options={{headerShown: false}}/>
                <Stack.Screen name="ChoixNumeroDestinataireInter" component={ChoixNumeroDestinataireInter} options={{headerShown: false}}/>
                <Stack.Screen name="TransactionInter" component={TransactionInter} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation