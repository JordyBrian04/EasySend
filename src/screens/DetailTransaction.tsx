import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, Share } from 'react-native';
import { AntDesign, FontAwesome, Entypo, Feather  } from '@expo/vector-icons';
import { getTransaction } from '../services/OnlineDB';
import { useFocusEffect } from '@react-navigation/native';
import { getAllUserTransaction } from '../services/localDB';
import ViewShot from 'react-native-view-shot';
import {shareAsync} from 'expo-sharing'


const DetailTransaction = ({route, navigation}:any) => {
    const {id} = route.params;
    const [transaction, setTransaction] = React.useState<any>([]);
    const viewShotRef = React.useRef(null)
    console.log(id)

    const getCurrentTransaction = async () => {
        const res:any = await getAllUserTransaction();
        res.filter((row:any) => row.id == id).map((data:any) => ({
            cree_le: data.cree_le,
            etat: data.etat,
            montant: data.montant, 
            frais: data.frais,
            numero_compte_source: data.numero_compte_source,
            numero_compte_destination: data.numero_compte_destination,
            numero_transaction: data.numero_transaction,
            reseau_depart: data.reseau_depart,
            reseau_arrive: data.reseau_arrive
        }))

        setTransaction(res[0])

        // setTransaction(res.filter((row:any) => row.id == id).map((data:any) => ({
        //     cree_le: data.cree_le,
        //     etat: data.etat,
        //     montant: data.montant, 
        //     frais: data.frais,
        //     numero_compte_source: data.numero_compte_source,
        //     numero_compte_destination: data.numero_compte_destination,
        //     numero_transaction: data.numero_transaction,
        //     reseau_depart: data.reseau_depart,
        //     reseau_arrive: data.reseau_arrive
        // })))
        // setTransaction(res.filter((row:any) => row.id == id).map());
    }

    const handleShare = async () => {
        try {

          const uri = await viewShotRef.current?.capture();
            
          console.log("Captured URI:", uri);
          await shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: `Detail transaction ${transaction.numero_transaction}`,
            UTI: "public.png"
          })
        } catch (error) {
          console.error("Error sharing invite link:", error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getCurrentTransaction()
        }, [])
    )

    function facture() {
        return (
            <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}} style={{marginTop: 13}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 15}}>
                    <Image source={require('../assets/images/logo.png')} style={{width: 60, height: 60}} />
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>EasySend</Text>
                </View>
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Détail de ma transaction</Text>
                <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Date & heure</Text>
                        <Text>{formatDate(transaction.cree_le)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Statut</Text>
                        <Text>{transaction.etat == 0 ? (
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                <Image source={require('../assets/images/close.png')} style={{width: 13, height: 13}} />
                                <Text>Echec</Text>
                            </View>
                        ) : (
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                <Image source={require('../assets/images/double-check.png')} style={{width: 13, height: 13}} />
                                <Text>Réussi</Text>
                            </View>
                        )}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Montant envoyé</Text>
                        <Text>{transaction.montant - transaction.frais} FCFA</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Frais</Text>
                        <Text>{transaction.frais} FCFA</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Total débité</Text>
                        <Text>{transaction.montant} FCFA</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Débité depuis</Text>
                        <Text>{transaction.numero_compte_source}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>Envoyé vers</Text>
                        <Text>{transaction.numero_compte_destination}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <Text style={{opacity: 0.5}}>ID Transaction</Text>
                        <Text>{transaction.numero_transaction}</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                        <View style={{padding: 5, borderRadius: 100, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <Image style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 20}} source={
                                transaction?.reseau_depart == 'ORANGE' ? require('../assets/images/orange.png')  : 
                                transaction?.reseau_depart == 'MTN' ? require('../assets/images/mtn.jpg') : 
                                transaction?.reseau_depart == 'MOOV' ? require('../assets/images/moov.png') : 
                                require('../assets/images/wave.png')
                            } />
                            <AntDesign name="arrowright" size={30} color="black" />
                            <Image style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 20}} source={
                                transaction?.reseau_arrive == 'ORANGE' ? require('../assets/images/orange.png')  : 
                                transaction?.reseau_arrive == 'MTN' ? require('../assets/images/mtn.jpg') : 
                                transaction?.reseau_arrive == 'MOOV' ? require('../assets/images/moov.png') : 
                                require('../assets/images/wave.png')
                            } />
                        </View>
                    </View>
                </View>
            </ViewShot>
        )
    }

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
            const heures = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const secondes = date.getSeconds().toString().padStart(2, '0');
    
            // Construction de la chaîne formatée
            return `${jour}/${mois}/${annee} à ${heures}:${minutes}:${secondes}`;
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
                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Détail de ma transaction</Text>
            </View>

            <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}} style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Date & heure</Text>
                    <Text>{formatDate(transaction.cree_le)}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Statut</Text>
                    <Text>{transaction.etat == 0 ? (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <Image source={require('../assets/images/close.png')} style={{width: 13, height: 13}} />
                            <Text>Echec</Text>
                        </View>
                    ) : (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <Image source={require('../assets/images/double-check.png')} style={{width: 13, height: 13}} />
                            <Text>Réussi</Text>
                        </View>
                    )}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Montant envoyé</Text>
                    <Text>{transaction.montant - transaction.frais} FCFA</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Frais</Text>
                    <Text>{transaction.frais} FCFA</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Total débité</Text>
                    <Text>{transaction.montant} FCFA</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Débité depuis</Text>
                    <Text>{transaction.numero_compte_source}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>Envoyé vers</Text>
                    <Text>{transaction.numero_compte_destination}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                    <Text style={{opacity: 0.5}}>ID Transaction</Text>
                    <Text>{transaction.numero_transaction}</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
                    <View style={{padding: 5, borderRadius: 100, alignItems: 'center', flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <Image style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 20}} source={
                            transaction?.reseau_depart == 'ORANGE' ? require('../assets/images/orange.png')  : 
                            transaction?.reseau_depart == 'MTN' ? require('../assets/images/mtn.jpg') : 
                            transaction?.reseau_depart == 'MOOV' ? require('../assets/images/moov.png') : 
                            require('../assets/images/wave.png')
                        } />
                        <AntDesign name="arrowright" size={30} color="black" />
                        <Image style={{width: 50, height: 50, resizeMode: 'cover', borderRadius: 20}} source={
                            transaction?.reseau_arrive == 'ORANGE' ? require('../assets/images/orange.png')  : 
                            transaction?.reseau_arrive == 'MTN' ? require('../assets/images/mtn.jpg') : 
                            transaction?.reseau_arrive == 'MOOV' ? require('../assets/images/moov.png') : 
                            require('../assets/images/wave.png')
                        } />
                    </View>
                </View>
            </ViewShot>

            <TouchableOpacity style={{backgroundColor: '#01AEB6', padding: 16, borderRadius: 10, marginTop: 30, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center'}} onPress={handleShare}>
                <Entypo name="share" size={24} color="white" />
                <Text style={{color: '#fff', textAlign: 'center'}}>Partager ma transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, marginTop: 30, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center'}}>
                <Feather name="help-circle" size={24} color="#01AEB6" />
                <Text style={{color: '#000', textAlign: 'center'}}>Besoin d’aide ? Contactez-nous</Text>
                <AntDesign name="caretright" size={15} color="black" />
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
};

export default DetailTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0'
  }
});
