-- Active: 1712684231801@@127.0.0.1@5432@ebc_db
ALTER TABLE "account" ALTER COLUMN "userId" SET DATA TYPE TEXT;
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE INTEGER;

-- Tout d'abord, créez une nouvelle séquence si nécessaire
CREATE SEQUENCE user_id_seq;

-- Ensuite, modifiez la table pour utiliser la séquence pour la colonne id
ALTER TABLE "user" ALTER COLUMN id SET DEFAULT nextval('user_id_seq');

-- Enfin, modifiez le type de données de la colonne id en integer
ALTER TABLE "user" ALTER COLUMN id SET DATA TYPE INTEGER;

-- Supprimez la séquence si elle n'est plus nécessaire
DROP SEQUENCE user_id_seq;
