import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container:{
        flex: 1,

        backgroundColor: '#FFFFFF'
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 50,
        gap: 10,
        marginBottom: 20
    },
    box:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 25
    },
    inputGroup:{
        marginBottom: 16,
        marginTop: 25
    },
    lib:{
        fontSize: 16,
        lineHeight: 20,
        color: '#4b5563',
        marginBottom: 8,
        fontWeight: 'bold'
    },
    input:{
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#d1d5db',
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 14,
        lineHeight: 20,
        color: '#1f2937',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    line:{
        width: 150,
        height: 2,
        backgroundColor:'grey',
        borderRadius: 2,
        marginVertical: 15,
        alignSelf: 'center'
      }
});