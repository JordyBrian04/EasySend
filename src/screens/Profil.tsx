import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { AntDesign, FontAwesome, Entypo, Feather  } from '@expo/vector-icons';
import { getTransaction } from '../services/OnlineDB';
import { useFocusEffect } from '@react-navigation/native';
import { getUserDatas } from '../services/AsyncStorage';

const Profil = ({navigation}: any) => {

  const [initial, setInitiales] = React.useState('')
  const [user, setUser] = React.useState<any>([])
  const [nom, setNom] = React.useState<any>([])

  const fetchUserData = async () => {
    const userData = await getUserDatas();
    const nom = userData.nomcomplet
    setUser(userData)
    const words = nom.split(' ')
    setNom(words)
    const initials = words.slice(0, 2).map((word: any) => word.charAt(0))
    const initialsString = initials.join('')
    setInitiales(initialsString)
    console.log('draw ',userData)
  };

  React.useEffect(() => {
    fetchUserData()
  }, [])

  const formatDate = (dateString: string | undefined) => {
    // Vérification si dateString existe
    if (!dateString) return ""; // ou "Date non disponible" ou une autre valeur par défaut

    try {
        const date = new Date(dateString);
        
        // Vérification si la date est valide
        if (isNaN(date.getTime())) return "";

        // Récupération des composants de la date
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear();

        // Construction de la chaîne formatée
        return `${jour}/${mois}/${annee}`;
    } catch (error) {
        console.error("Erreur lors du formatage de la date:", error);
        return ""; // ou "Date invalide" ou une autre valeur par défaut
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
        <ScrollView style={{padding: 20, flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 39, marginBottom: 10}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Information  sur mon Profil</Text>
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 40}}>
                <View style={{width: 102, height: 102, backgroundColor: '#188E94', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}>{initial}</Text>
                </View>
                {/* <View style={{flexDirection: 'column', gap: 10}}>
                  <Text style={{fontSize: 25, color: 'white'}}>{user.nomcomplet}</Text>
                  <Text style={{fontSize: 20, color: 'white'}}>{user.numero}</Text>
                </View> */}
              </View>
            </View>
            <View style={{marginTop: 40, alignItems: 'flex-start', flexDirection: 'column', gap: 30}}>
              <View style={{backgroundColor: 'white', width: '100%', padding: 10, borderRadius: 15, height: 61, justifyContent: 'center'}}>
                <Text style={{fontSize: 22, marginLeft: 20}}>{nom[0]}</Text>
              </View>
              <View style={{backgroundColor: 'white', width: '100%', padding: 10, borderRadius: 15, height: 61, justifyContent: 'center'}}>
                <Text style={{fontSize: 22, marginLeft: 20}}>{nom[1]}</Text>
              </View>
              <View style={{backgroundColor: 'white', width: '100%', padding: 10, borderRadius: 15, height: 61, justifyContent: 'center'}}>
                <Text style={{fontSize: 22, marginLeft: 20}}>{user.numero}</Text>
              </View>
              <View style={{backgroundColor: 'white', width: '100%', padding: 10, borderRadius: 15, height: 61, justifyContent: 'center'}}>
                <Text style={{fontSize: 22, marginLeft: 20}}>{formatDate(user.date_naissance)}</Text>
              </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default Profil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  }
});
