
import {pgTable, text, serial, timestamp, real, integer, date} from 'drizzle-orm/pg-core'

export const utilisateur = pgTable('utilisateur', {
    id: serial('id').primaryKey(),
    nomcomplet: text('nomcomplet').notNull(),
    numero: text('numero').notNull(),
    mdp: text('mdp').notNull(),
    user_code_promo: text('user_code_promo').notNull(),
    signup_code_promo: text('signup_code_promo').default(""),
    parrainage_valide: integer('parrainage_valide').default(0),
    date_naissance: date('date_naissance').notNull(),
    cree_le: timestamp('cree_le').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})


export const transaction = pgTable('transaction', {
    id: serial('id').primaryKey(),
    numero_transaction: text('numero_transaction').notNull().unique(),
    utilisateur_id: integer('utilisateur_id').references(() => utilisateur.id).notNull(),
    type_transaction: text('type_transaction').notNull(),
    numero_compte_source: text('numero_compte_source').notNull(),
    numero_compte_destination: text('numero_compte_destination').notNull(),
    montant: real('montant').notNull(),
    frais: real('frais').notNull(),
    reseau_depart: text('reseau_depart').notNull(),
    reseau_arrive: text('reseau_arrive').notNull(),
    etat: integer('etat').default(0),
    cree_le: timestamp('cree_le').notNull().defaultNow(),
})

export const pub = pgTable('pub', {
    id: serial('id').primaryKey(),
    titre: text('titre').notNull(),
    description: text('description').notNull(),
    image: text('image').default(""),
    updatedAt: timestamp('updatedAt').defaultNow(),
})

export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    num_compte: text('num_compte').notNull(),
    titre: text('titre').notNull(),
    description: text('description').notNull(),
    sta: integer('sta').default(0),
    updatedAt: timestamp('updatedAt').defaultNow(),
})

export const temp = pgTable('temp', {
    id: serial('id').primaryKey(),
    compte: text('num_compte').notNull(),
    code_verification: integer('code_verification').default(0).notNull(),
    date_expiration: timestamp('date_expiration').notNull()
})

export const logs_erreurs = pgTable("logs_erreurs", {
    id: serial("id").primaryKey(),
    message: text("message").notNull(),
    stack: text("stack"),
    route: text("route"),
    created_at: timestamp("created_at").defaultNow(),
  });
//npx drizzle-kit push