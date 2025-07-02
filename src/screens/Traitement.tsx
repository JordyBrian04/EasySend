import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { getConstante, getData, getUserDatas, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { insertTransaction } from '../services/OnlineDB';
import { InsertTransaction } from '../services/apiService';

const Traitement = ({navigation}:any) => {
  const [datas, setDatas] = React.useState<any>([]);

  const getDatas = async () => {
      // const res:any = await getData();
      const res:any = await getConstante("data");
      console.log(res[0])
      setDatas(res[0])
  }

  useFocusEffect(
    React.useCallback(() => {
        getDatas()
    }, [])
  )

  const handleFinaliser = async () => {
    try {
      const user:any = await getConstante('user')

      await InsertTransaction(        {
        destinataire: datas.destinataire,
        action: datas.action,
        reseau: datas.reseau,
        expediteur: datas.expediteur,
        reseauDestinataire: datas.reseauDestinataire,
        montant: datas.montant,
        frais: datas.frais,
        userId: user.id
      })
      .then((res) => {
        console.log(res.data)
        navigation.navigate({name: 'ResultatTransaction', params: {status: res.data.etat}})
      })
      .catch((err) => {
        // setLoading(false)
        console.log('error', err)
        if (err.response?.status === 401) {
            alert(`${err.response?.data?.error}`);
          } else {
            alert("Une erreur est survenue, vérifie ta connexion");
          }
      })
    } catch (error) {
      console.error(error)
      alert("Erreur serveur")
    }

    // const res:any = await insertTransaction(datas);
    // if(res[0].id){
    //   navigation.navigate('Home')
    // }
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12}}>
        <Text style={{fontSize: 20, lineHeight: 28, fontWeight: 'bold', marginBottom: 18}}>Traitement de la transaction</Text>
        <Image source={ datas?.reseau == 'ORANGE' ? require('../assets/images/orange.png')  : 
                        datas?.reseau == 'MTN' ? require('../assets/images/mtn.jpg') : 
                        datas?.reseau == 'MOOV' ? require('../assets/images/moov.png') : 
                        require('../assets/images/wave.png')} style={{width: 80, height: 80, borderRadius: 20}}/>
        <Text style={{fontSize: 16, lineHeight: 24, color: '#6b7280', marginTop: 18, textAlign: 'center'}}>
        {datas?.reseau == 'WAVE' ? 'Cliquez sur le bouton ci-dessous pour finaliser la transaction' : '  Vous allez recevoir une notification de confirmation. Veuillez saisir le code ussd ci-dessous  pour confirmer votre transaction'}
        </Text>
        <TouchableOpacity style={{backgroundColor: '#C4F2D2', padding: 12, borderRadius: 10, marginTop: 18, width: '80%', alignItems: 'center', justifyContent: 'center'}} onPress={handleFinaliser}>
          <Text style={{fontSize: 16, lineHeight: 24, color: '#000', fontWeight: 'bold'}}>
            {datas?.reseau == 'WAVE' ? 'Cliquer ici' : datas?.reseau == 'ORANGE' ? '#144#' : datas?.reseau == 'MTN' ? '*133⋕' : '*155⋕'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Traitement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12
  }
});
