import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity } from 'react-native';

const ResultatTransaction = ({route, navigation}: any) => {
    const status = route.params?.status
    // console.log(status)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12}}>
                {status == 0 ? 
                (<View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 19}}>
                    <Image source={require("../assets/images/x-button.png")} style={{width: 100, height: 100}} />
                    <Text style={{fontSize: 24, fontWeight: 500}}>Transaction échouée</Text>
                    <Text style={{fontSize: 17, fontWeight: 400, textAlign: 'center'}}>Veuillez réessayer svp, si le problème persiste contactez le service client pour obtenir de l’aide.</Text>
                </View>) 
                : 
                (<View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 19}}>
                    <Image source={require("../assets/images/check.png")} style={{width: 100, height: 100}} />
                    <Text style={{fontSize: 24, fontWeight: 500}}>Transaction effectuée</Text>
                    <Text style={{fontSize: 17, fontWeight: 400}}>Votre transfert a été réalisé avec succès.</Text>
                </View>)}
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', padding: 12, gap: 12}}>
                {status == 0 && <Text style={{color: "#726E6E", fontSize: 13}}>Si vous avez été débité, contactez le service client. </Text>}
                <TouchableOpacity style={{backgroundColor: "#01AEB6", width: '100%', padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 12}} onPress={() => navigation.navigate('Tabs')}>
                    <Text style={{color: "#fff", fontSize: 24, fontWeight: 600}}>Retour au menu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ResultatTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
