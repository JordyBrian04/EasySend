import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
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
    box:{
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 20,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    img:{
        width: 48,
        height: 48,
        resizeMode: 'cover',
        borderRadius: 100
    },

    btn:{
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    modalContainer:{
        flex:1,
        backgroundColor: '#0000001a',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    modalBox:{
        width: '90%',
        zIndex: 40,
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    choix:{
        borderWidth:1,
        borderColor:'#e5e7eb',
        padding: 12,
        borderRadius: 8,
        width: '45%'
    },
    Modalimg:{
        width: 48,
        height: 48,
        resizeMode: 'cover'
    },
})