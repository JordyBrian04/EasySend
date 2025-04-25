import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    box: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    text1:{
        fontSize: 20,
        lineHeight: 40,
        textAlign: 'center',
        // color: '#f97316',
    },
    text2:{
        fontSize: 34,
        lineHeight: 40,
        color: '#22c55e',
    },
    box2:{
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
});