import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useFonts } from "expo-font";
import { pays } from '../utils/datas';
import { saveContante } from '../services/AsyncStorage';

const choixDestination = ({navigation}: any) => {

    const handlePays = async (pays:string) => {
        await saveContante('data', JSON.stringify({pays: pays}))
        navigation.navigate('ChoixNumeroInter')
    }

    const [fontsLoaded] = useFonts({
        Bold: require("../assets/fonts/Poppins-Bold.ttf"),
        Regular: require("../assets/fonts/Poppins-Regular.ttf"),
        SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        Medium: require("../assets/fonts/Poppins-Medium.ttf"),
      });
      if (!fontsLoaded) {
        return undefined;
      }

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='white'/>
        <ScrollView style={{flex: 1, paddingLeft: 10, paddingRight: 10, flexDirection:'column', gap: 10}}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <AntDesign name="arrowleft" size={32} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#01AEB6', fontSize: 25, fontFamily: 'Bold'}}>PAYS DE DESTINATION</Text>
                <Text style={{color: '#000', fontSize: 18, fontFamily: 'Regular'}}>Choisissez le pays vers lequel vous envoyer de l'argent</Text>
            </View>
            <View style={{marginTop: 20}}>
                <View style={{flexDirection: 'column', gap: 18}}>
                    {pays.map((row:any) => {
                        return (
                            <TouchableOpacity key={row.id} onPress={() => handlePays(row.nom)} style={{backgroundColor : '#F8F8F8', padding: 12, borderRadius: 20, flexDirection:'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Image source={row.drapeau} style={{width: 48, height: 48, backgroundColor: 'cover', borderRadius: 100}}/>
                                <View style={{width: '70%'}}><Text style={{fontFamily: 'SemiBold'}}>{row.nom}</Text></View>
                                <AntDesign name="right" size={17} color="#01AEB6" />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default choixDestination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 20,
    // gap: 40,
    marginBottom: 20
},
});
