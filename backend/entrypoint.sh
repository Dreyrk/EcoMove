#!/bin/sh

echo "⏳ Attente de la base de données..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Generate Prisma db"
npx prisma db push

echo "🌱 Lancement du seed"
npm run seed

echo "🚀 Démarrage du serveur"
npm run dev
