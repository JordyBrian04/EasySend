import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { getData, getUserDatas, storeData } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { insertTransaction } from '../services/OnlineDB';

const Traitement = ({navigation}:any) => {
  const [datas, setDatas] = React.useState<any>([]);

  const getDatas = async () => {
      const res:any = await getData();
      console.log(res[0])
      setDatas(res[0])
  }

  useFocusEffect(
    React.useCallback(() => {
        getDatas()
    }, [])
  )

  const handleFinaliser = async () => {
    const res:any = await insertTransaction(datas);
    if(res[0].id){
      navigation.navigate('Home')
    }
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
          Cliquez sur le bouton ci-dessous pour finaliser la transaction
        </Text>
        <TouchableOpacity style={{backgroundColor: '#C4F2D2', padding: 12, borderRadius: 10, marginTop: 18, width: '80%', alignItems: 'center', justifyContent: 'center'}} onPress={handleFinaliser}>
          <Text style={{fontSize: 16, lineHeight: 24, color: '#000', fontWeight: 'bold'}}>
            {datas?.reseau == 'WAVE' ? 'Cliquer ici' : '#144#'}
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
