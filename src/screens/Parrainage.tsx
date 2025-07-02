import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Modal, Share, ToastAndroid } from 'react-native';
import { Colors } from '../constants/Colors';
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import { getUserDatas } from '../services/AsyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { getUserCodeUsed, getUserOnline } from '../services/OnlineDB';
// import { useToast } from '@masumdev/rn-toast';
import * as Clipboard from 'expo-clipboard';

const Parrainage = ({navigation}:any) => {

    const [user, setUser] = React.useState<any>([]);
    const [userInvite, setUserInvite] = React.useState<any>([]);
    // const { showToast } = useToast();
    const [modalVisible, setModalVisible] = React.useState(false);

    const getUser = async () => {
        const res:any = await getUserOnline()
        const invite:any = await getUserCodeUsed(res[0].user_code_promo || res[0].code_parrainage)
        setUser(res[0])
        setUserInvite(invite)
    }

    useFocusEffect(
        React.useCallback(() => {
            getUser()
        }, [])
    )

    const CopierCode = async () => {
        // console.log('copie')
        await Clipboard.setStringAsync(user.user_code_promo || user.code_parrainage)

        setModalVisible(true)
        // showToast('Code copié avec succès!', 'success');
    }

    React.useEffect(() => {
        setTimeout(() => {
            setModalVisible(false)
        }, 1000)
    })

    function Toast() {
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                
            >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalBox}>  
                            <Text style={{color: '#000'}}>Code copié avec succès</Text>
                        </View>
                    </View>
            </Modal>
        )
    }

    const handleInvite = async () => {
        try {
            const code = user.user_code_promo || user.code_parrainage;
            const shareLink = `http://10.0.1.118:8081/_expo/loading/parrainage/Inscription/${code}`;
            // ToastAndroid.show(`You are eligible for $50 reward!`, ToastAndroid.LONG);
          await Share.share({
            message: `Télécharge l'application EasySend et utilise mon code promo ${code} pour t'inscrire!`,
          });
        } catch (error) {
          console.error("Error sharing invite link:", error);
        }
      }

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={{padding: 16, flex: 1}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Parrainez vos amis</Text>
            <Text style={{textAlign: 'center', fontSize: 17, lineHeight: 40}}>Gagnez 200F CFA par parrainage validé</Text>

            <View style={{width: '100%', padding: 15, backgroundColor: '#01AEB6', borderRadius: 20, marginTop: 20, gap: 16}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 17, color: '#fff', fontWeight: 'bold'}}>Code parrainage</Text>
                    <View style={{flexDirection: 'row', gap:5, alignItems: 'center'}}>
                        <TouchableOpacity style={{flexDirection: 'row', gap: 5, alignItems: 'center', padding: 8, backgroundColor: '#0000001A', borderRadius:5, justifyContent: 'center'}} onPress={CopierCode}>
                            <Ionicons name="copy-outline" size={15} color="white" />
                            <Text style={{fontSize: 10, color: '#fff', fontWeight: 'bold'}}>Copier</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', gap: 5, alignItems: 'center', padding: 8, backgroundColor: '#0000001A', borderRadius:5, justifyContent: 'center'}} onPress={handleInvite}>
                            <Feather name="share-2" size={15} color="white" />
                            <Text style={{fontSize: 10, color: '#fff', fontWeight: 'bold'}}>Partager</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{backgroundColor: 'white', padding: 15, width: '60%', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>{user.code_parrainage || user.user_code_promo}</Text>
                </View>
            </View>

            <Text style={{fontSize: 25, fontWeight: '400', lineHeight: 100}}>Vos Statistiques</Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{backgroundColor: '#F1EFEF', borderRadius: 15, padding: 13, alignItems: 'center', justifyContent: 'center', gap: 20, width: '45%'}}>
                    <Text style={{color: '#726E6E', fontSize: 20, fontWeight: '400'}}>Mes invités</Text>
                    <Text style={{color: '#726E6E', fontSize: 20, fontWeight: '400'}}>{userInvite}</Text>
                </View>

                <View style={{backgroundColor: '#F1EFEF', borderRadius: 15, padding: 13, alignItems: 'center', justifyContent: 'center', gap: 20}}>
                    <Text style={{color: '#726E6E', fontSize: 20, fontWeight: '400'}}>Parrainage validé</Text>
                    <Text style={{color: '#726E6E', fontSize: 20, fontWeight: '400'}}>{user.parrainage_valide}</Text>
                </View>
            </View>

            <View style={{backgroundColor: '#F1EFEF', borderRadius: 15, padding: 13, marginTop: 30, gap: 25}}>
                <Text style={{fontSize: 20, color: '#4F4F4F', fontWeight: '400'}}>Solde disponible : {user.parrainage_valide*200} FCFA</Text>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={{padding: 20, backgroundColor: user.parrainage_valide == 0 ? '#D9D9D9' : '#188E94', borderRadius: 10}} disabled={user.parrainage_valide == 0 ? true : false}>
                        <Text style={{fontSize: 20, fontWeight: '400', color: user.parrainage_valide == 0 ? '#B3B3B3' : 'white'}}>Retirer mes fonds</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={{fontSize: 20, marginTop: 20, fontWeight: 400}}>
                NB : Votre ami doit s'inscrire et effectuer une transaction pour que le parrainge soit validé.
            </Text>
        </ScrollView>
        {Toast()}
    </SafeAreaView>
  );
};

export default Parrainage;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "white"
  },
  modalContainer:{
    flex:1,
    backgroundColor: '#0000001a',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
},
modalBox:{
    width: '50%',
    // height: 10,
    backgroundColor: '#fff',
    zIndex: 40,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    justifyContent: 'center',
    // justifyContent: 'space-between',
    // flexDirection: 'column',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0
},
});
