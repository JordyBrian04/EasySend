import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#01AEB6'
    },
    box:{
        flex: 1,
        // paddingLeft: 16,
        // paddingRight: 16,
        // paddingTop: 40,
        // paddingBottom: 24,
        width: '100%',
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        bottom: 0
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
    },
    headerRight:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%',
        justifyContent: 'flex-end',

    },
    BtnGroup:{
        marginTop: 10,
        padding:20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        // paddingLeft: 16,
        // paddingRight: 16,
    },
    Btn:{
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        backgroundColor: '#048187',
        borderRadius: 16,
        padding: 12,
        gap: 3
    },
    BtnIcon:{
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    BtnText:{
        color: '#FFF',
        fontSize: 14
    },
    body:{
        marginTop: -6,
        padding:10,
        width: '100%',
        height: '150%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#fff',
        flex: 1,
        // position: 'absolute',
        // top: 90,
        // left: 0,
        // right: 0,
        // bottom: 0
    },
    pub:{
        marginTop: 6,
        marginLeft: -10,
        zIndex: 40,
        backgroundColor: 'white',
        padding: 12,
        height: 120
    },
    historique:{
        padding: 10,
        marginTop: 10,
        height: '100%'
    }
})