# EquiSaddleStore

Full-stack e-commerce app for equestrian saddles and accessories

## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Railway)

---

## Déploiement Railway

### 1. Prérequis

- Compte Railway (<https://railway.app/>)
- Repo GitHub connecté
- Créer un projet Railway et ajouter PostgreSQL (Railway plugin)

### 2. Variables d'environnement

Copier `.env.example` en `.env` et remplir :

- `DATABASE_URL` (fourni par Railway PostgreSQL)
- `STRIPE_SECRET_KEY` (clé Stripe)
- `SESSION_SECRET` (secret session Express)
- `ADMIN_TOKEN` (optionnel, protection admin)

### 3. Build & Start scripts Railway

Railway détecte automatiquement :

- `build`: `vite build`
- `start`: `node dist/index.js`

### 4. Migration Drizzle

Pour appliquer les migrations sur Railway (optionnel, en local ou via console Railway) :

```sh
npx drizzle-kit push:pg
```

### 5. Déploiement

- Push sur GitHub
- Connecter Railway à ce repo
- Ajouter les variables d'env dans Railway > Variables
- Railway build & déploie automatiquement

---

## Fonctionnement du backend

- Si `DATABASE_URL` est présent, utilise PostgreSQL via Drizzle ORM
- Sinon, fallback sur un stockage mémoire (dev/demo)
- Toutes les routes REST sont compatibles avec l'ancien et le nouveau backend

---

## Sécurité admin

- Pour protéger `/admin`, définir `ADMIN_TOKEN` dans `.env`
- Un middleware vérifie le token sur les routes `/admin`

---

## Scripts utiles

- `npm run build` — build frontend & backend
- `npm start` — démarre le serveur Express

---

## Structure principale

```sh
client/           # Frontend React
server/           # Backend Express
shared/schema.ts  # Drizzle ORM schema
migrations/       # Drizzle migrations
```

---

## Développement local

```sh
git clone ...
cd EquiSaddleStore
cp .env.example .env
npm install
npm run build
npm start
```

---

## Licence

MIT
