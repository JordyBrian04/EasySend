import * as SQLite from 'expo-sqlite';
import { getConstante, storeUserDatas } from './AsyncStorage';
import * as Network from 'expo-network';
import { getUserTransaction, updateTransaction } from './apiService';

const isOnline = async () => {
  const state = await Network.getNetworkStateAsync();
  return state.isConnected && state.isInternetReachable;
};

const database = SQLite.openDatabaseAsync('local_easy_send.db');

export const insertUser =  async (data:any) => {
    try {
        console.log(data)
        // check if user already exists
        const existingUser = await (await database).getAllAsync("SELECT * FROM easy_send_user WHERE id = ?", [data.id])
        if (existingUser.length > 0) {
            return 'User already exists';
        }

        if(data?.id === undefined) {
            console.log("Erreur id")
            return 'Erreur id';
        }

        // const result = await (await database).runAsync('INSERT INTO user (id, nom_complet, numero) VALUES (?, ?, ?)', data.id, data.nomcomplet, data.numero);
        const insert = await (await database).prepareAsync("INSERT INTO easy_send_user (id, nomcomplet, numero,code_parrainage, date_naissance) VALUES (?, ?, ?, ?, ?)");
        await (await insert).executeAsync([data.id, data.nomcomplet, data.numero, data.code_parrainage, data.date_naissance])
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

// export const saveTokens = async (accessToken:any, refreshToken:any) => {
//     try {
//         await (await database).prepareAsync("I")
//     } catch (error) {
        
//     }
// }

export const getAllUsers = async () => {
    try {
        const result = await (await database).getAllAsync("SELECT * FROM easy_send_user")
        console.log('result ', result)
        if(result.length > 0) {
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        console.error(error)
    }
}

export const update_user = async (datas:any) => {
    try {
        //
        const update = (await database).runAsync('UPDATE easy_send_user SET nom_complet = ?, numero = ?, mdp = ?, solde = ? WHERE num_compte = ?', [datas.nomcomplet, datas.numero, datas.mdp, datas.solde, datas.num_compte]);
        await storeUserDatas(await getAllUsers())
        // console.log('update');
        return true
        //storeUserDatas(update)
    } catch (error) {
        return false
    }
}

export const synchroTransaction = async () => {
    const online = await isOnline();
    if (!online) return;

    await getUserTransaction()
    .then(async (res) => {
        // console.log(res.data)
        res.data?.data.map(async (row:any) => {
            // console.log(row.numero_transaction)
            try {
                const insert = await (await database).prepareAsync("INSERT OR REPLACE INTO easy_send_transaction(id,numero_transaction,utilisateur_id, type_transaction, numero_compte_source, numero_compte_destination, montant, frais, reseau_depart, reseau_arrive, etat, cree_le) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
                await (await insert).executeAsync([row.id, row.numero_transaction, row.utilisateur_id, row.type_transaction, row.numero_compte_source, row.numero_compte_destination, row.montant, row.frais, row.reseau_depart, row.reseau_arrive, row.etat, row.cree_le])
                console.log('ajouté')
                await updateTransaction({transactionId: row.id})
                .then((res) => {
                    console.log(res.data.message)
                })
                .catch((err) => {
                    console.log('Erreur update ', err)
                })
            } catch (error) {
                console.error(error)
            }

        })
    })
    .catch((res) => {
        console.error(res)
    })
}

export const getAllUserTransaction = async () => {
    try {
        await synchroTransaction()

        return await (await database).getAllAsync("SELECT * FROM easy_send_transaction ORDER BY cree_le DESC")
    } catch (error) {
        console.error(error)
    }
}