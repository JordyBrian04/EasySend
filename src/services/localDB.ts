import * as SQLite from 'expo-sqlite';
import { storeUserDatas } from './AsyncStorage';

const database = SQLite.openDatabaseAsync('local.db');

export const insertUser =  async (data:any) => {
    try {
        console.log(data)
        // check if user already exists
        const existingUser = await (await database).getAllAsync("SELECT * FROM user WHERE id = ?", [data.id])
        if (existingUser.length > 0) {
            return 'User already exists';
        }

        if(data?.id === undefined) {
            console.log("Erreur id")
            return 'Erreur id';
        }

        // const result = await (await database).runAsync('INSERT INTO user (id, nom_complet, numero) VALUES (?, ?, ?)', data.id, data.nomcomplet, data.numero);
        const insert = await (await database).prepareAsync("INSERT INTO user (id, nom_complet, numero) VALUES (?, ?, ?)");
        await (await insert).executeAsync([data.id, data.nomcomplet, data.numero])
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const getAllUsers = async () => {
    try {
        const result = await (await database).getAllAsync("SELECT * FROM user")
        if(result.length > 0) {
            return true
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
        const update = (await database).runAsync('UPDATE user_local SET nom_complet = ?, numero = ?, mdp = ?, solde = ? WHERE num_compte = ?', [datas.nomcomplet, datas.numero, datas.mdp, datas.solde, datas.num_compte]);
        await storeUserDatas(await getAllUsers())
        // console.log('update');
        return true
        //storeUserDatas(update)
    } catch (error) {
        return false
    }
}