import { and, eq, or, desc, max, asc } from "drizzle-orm"
import { db } from "../databases"
import { utilisateur, pub, transaction, temp } from "../databases/schema"
import { getAllUsers, insertUser } from "./localDB";
import { getUserDatas, storeUserDatas } from "./AsyncStorage";

const generateCodeVerification = async (numero: string) => {
    const date = new Date();
    const code = Math.floor(10000 + Math.random() * 90000);
    date.setMinutes(date.getMinutes() + 2); // Ajoute 2 minutes
    const formattedDate = date;

    const insert_temp:any = await db.insert(temp).values({
        compte: numero,
        code_verification: code,
        date_expiration: formattedDate
    });

    if(insert_temp)
    {
        return true
    }
    else
    {
        return false
    }
}


export const login = async (req:any) => {
    try {

        const user = await db.select().from(utilisateur).where(and(eq(utilisateur.numero, req.phoneNumber)));
    
        if (user.length > 0) 
        {
            const res = await generateCodeVerification(req.phoneNumber)
            if(res === true)
            {
                return user[0]
            }
            else
            {
                return null
            }
        }
        else
        {
            return null
        }

    } catch (error) {
        console.error(error)
        return error
    }
}

export const getUserOnline = async () => {
    try {
        const numero:any = await getAllUsers();
        const data = await db.select().from(utilisateur).where(eq(utilisateur.numero, numero?.numero))
        // console.log(data)
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createUser = async (req: any) => {
    try {
        const verif = await db.select().from(utilisateur).where(
            or(
                eq(utilisateur.numero, req.phoneNumber), 
                eq(utilisateur.nomcomplet, req.nomcomplet)
            ))

        if (verif.length > 0) {
            return "Nom d'utilisateur ou numéro déjà utilisé"
        }

        const randomNum = Math.floor(100 + Math.random() * 900); // 3 chiffres
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 lettres aléatoires
        const cleanUsername = req.nomcomplet.replace(/\s+/g, '').toUpperCase().slice(0, 5); // Prénom nettoyé (max 5 caractères)
      
        const user_code = `${cleanUsername}${randomNum}-${randomStr}`;

        const newUser:any = await db.insert(utilisateur).values({
            numero: req.phoneNumber,
            nomcomplet: req.nomcomplet,
            mdp: req.password,
            date_naissance: req.date_naissance,
            user_code_promo: user_code,
            signup_code_promo: req.code_promo
        }).returning({id: utilisateur.id})

        console.log(newUser[0].id)

        let data = [
            {id: newUser[0].id, numero: req.phoneNumber, nomcomplet: req.nomcomplet}
        ]

        if(newUser)
        {
            const res = await insertUser(data[0])

            if(res === true)
            {
                await generateCodeVerification(req.phoneNumber)
                await storeUserDatas(newUser[0])
                return newUser[0]
            }
            else
            {
                return "Erreur lors de l'insertion dans la base de données locale"
            }
        }
    } catch (error) {
        console.error(error)
        return "Erreur du serveur, verifiez votre connexion"
    }
}

export const getAllPub = async () => {
    try {
        const datas = await db.select().from(pub).orderBy(desc(pub.updatedAt));
        return datas
    } catch (error) {
        
    }
}

export const insertTransaction = async (req: any) => {
    try {

        //Générer un numero de transaction
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
        const randomPart = Math.random().toString(16).substr(2, 8).toUpperCase();
        const numero_transaction = `TXN-${date}-${randomPart}`
        // console.log(numero_transaction)

        //Avoir les informations de l'utilisateur
        const user:any = await getUserDatas();

        const res = await db.insert(transaction).values({
            numero_transaction: numero_transaction,
            utilisateur_id: user.id,
            type_transaction: req.action,
            numero_compte_source: req.expediteur?.phoneNumbers[0].number,
            numero_compte_destination: req.destinataire?.phoneNumbers[0].number,
            montant: req.montant,
            frais: req.frais,
            reseau_depart: req.reseau,
            reseau_arrive: req.reseauDestinataire,
            etat: Math.floor(Math.random() * 2)
        }).returning({id: transaction.id})


        return res
    } catch (error) {
        console.error(error)
        return "Erreur du serveur, verifiez votre connexion"
    }
}

export const getLastTransaction = async () => {
    try {
        const user:any = await getUserDatas();
        const data = await db.select().from(transaction)
        .where(eq(transaction.utilisateur_id, user.id))
        .orderBy(desc(transaction.cree_le))
        .limit(100)
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAllTransaction = async () => {
    try {
        const user:any = await getUserDatas();
        const data = await db.select().from(transaction)
        .where(eq(transaction.utilisateur_id, user.id))
        .orderBy(desc(transaction.cree_le))
        .limit(100)
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}


export const getTransaction = async (id: any) => {
    try {
        const data = await db.select().from(transaction).where(eq(transaction.id, id))
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}

export const verifyCode = async (req: any) => {
    try {
        const user:any = await getUserDatas();
        const data = await db.select().from(temp).where(and(eq(temp.compte, user.numero), eq(temp.code_verification, req.code))).orderBy(asc(temp.id))
        if(data.length > 0)
        {
            return data
        }
        else
        {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export const resendCode = async () => {
    try {
        const user:any = await getUserDatas();
        const res = await generateCodeVerification(user.numero)
        if(res === true)
        {
            return true
        }
        else
        {
            return false
        }
    } catch (error) {
        console.error(error)
        return null
    }
}