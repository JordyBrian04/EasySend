import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    box: {
        flex: 1,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 40,
        paddingBottom: 40
    },
    logo:{
        alignItems: 'center',
        padding: 12,
        width: '100%'
    },
    textLogo1:{
        fontWeight: 'thin',
        fontSize: 30,
        lineHeight: 36,
        marginTop: 30,
        padding: 40,
        width: '100%',
        color: '#f97316',
    },
    textLogo2:{
        fontSize: 60,
        lineHeight: 1,
        fontWeight: 'bold',
        color: '#22c55e',
    },
    formulaire:{
        marginBottom: 30
    },
    inputGroup:{
        marginBottom: 16,
    },
    lib:{
        fontSize: 14,
        lineHeight: 20,
        color: '#4b5563',
        marginBottom: 8
    },
    input:{
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#d1d5db',
        height: 57,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 14,
        lineHeight: 20,
        color: '#1f2937'
    },
    passwordInput:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#d1d5db',
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 14,
        lineHeight: 20,
        color: '#1f2937'
    },
    btnConnexion:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        backgroundColor: '#3b82f6',
        borderRadius: 8
    },
    textBtn:{
        color: '#FFF',
        fontSize: 18,
        lineHeight: 28,
        fontWeight: 'bold',
        borderRadius: 16,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12
    }
});