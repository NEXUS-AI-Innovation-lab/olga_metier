## ⚠️ Mise en garde importante

Pour un fonctionnement maximal de cette application, il est nécessaire de lancer le backend à l'aide de `docker-compose`. Vous pouvez retrouver les fichiers nécessaires au lancement du backend à l'adresse suivante :

👉 [https://github.com/NEXUS-AI-Innovation-lab/olga-designer-admin-backend](https://github.com/NEXUS-AI-Innovation-lab/olga-designer-admin-backend)

Assurez-vous que le backend est bien démarré avant d'utiliser cette application frontend.
# OLGA METIER

**Le moteur de workflow qui libère les équipes métier de l'infrastructure**

OLGA METIER est une **boîte d'exécution de workflows métier** qui permet aux équipes de se concentrer UNIQUEMENT sur leur logique applicative. Plus besoin de perdre du temps sur l'infrastructure, la persistence ou la gestion d'état.

## Ce que fait OLGA METIER

1. **Lance des instances de workflow** à la demande (`/startTask`)
2. **Interprète les étapes** définies par votre logique métier
3. **Sauvegarde automatiquement** les réponses et les états d'avancement
4. **Gère la persistence** de chaque instance et leur cycle de vie
5. **Maintient le contexte** entre les différentes étapes d'un workflow

## Architecture

OLGA METIER expose une API REST simple qui permet d'intégrer vos workflows dans n'importe quelle interface :

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Métier    │────▶│  Votre      │
│  (React)    │◀────│  (Backend)  │◀────│  Logique    │
└─────────────┘     └──────────────┘     └─────────────┘
```

Note : Le code backend (OLGA-METIER-2) n'est pas accessible - c'est une boîte noire qui exécute vos workflows. Vous interagissez avec lui uniquement via son API.

## Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/NEXUS-AI-Innovation-lab/olga-metier
cd OLGA-METIER-2

# Installer les dépendances
npm install

# Lancer le frontend
npm run dev
```

### Configuration

Créez un fichier `.env` à la racine :

```env
VITE_BACKEND_URL=http://localhost:9091
```

## API Endpoints

### Démarrer une nouvelle tâche

```
GET /startTask?inventory_id={id}&email={email}
```

Lance une nouvelle instance de workflow pour l'inventaire spécifié.

### Passer à l'étape suivante

```
POST /next?task_id={id}&email={email}
Body: { ... données du formulaire ... }
```

Soumet les données de l'étape courante et passe à la suivante.

### Voir l'état d'une tâche

```
GET /status?task_id={id}
```

Récupère l'état actuel et le formulaire d'une tâche en cours.

### Lister les tâches disponibles

```
GET /ongoingUser?email={email}
```

Récupère toutes les tâches en cours pour un utilisateur.

### Lister les inventaires disponibles

```
GET /getAllInventoriesForUser?email={email}
```

Récupère tous les inventaires accessibles à l'utilisateur.

## Interface utilisateur

Le frontend propose une interface intuitive organisée en 3 colonnes :

- **Lancer une demande** : les inventaires sur lesquels l'utilisateur peut initier un workflow
- **Demande à prendre** : les tâches disponibles en attente de traitement
- **Demandes démarrées** : les tâches déjà initiées par l'utilisateur

### Exemple d'utilisation (médical)

```jsx
// Démarrer une nouvelle tâche (prise de rendez-vous)
const handleStartTask = async () => {
  const res = await fetch(`${BACKEND_URL}/startTask?inventory_id=test&email=${email}`);
  const json = await res.json();
  
  // Le formulaire de saisie est automatiquement généré
  setForm(FormSchema.parse(json.form));
  setTaskId(json.task_id);
};
```

## Pour qui ?

- **Équipes produit** : elles livrent plus vite, sans dettes techniques
- **Équipes data** : elles orchestrent leurs pipelines sans s'embourber
- **Startups médicales** : gestion de rendez-vous, dossiers patients, etc.

## Avantages

- **Zéro gestion d'état** : la persistence est automatique
- **Formulaires dynamiques** : générés automatiquement depuis les schémas
- **Multi-utilisateurs** : gestion des rôles et des groupes
- **Workflows réutilisables** : une fois définis, utilisables partout

## Structure du projet

```
OLGA-METIER-2/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── formInterpreter/ # Moteur de rendu de formulaires
│   │   ├── InventoryCard    # Carte d'inventaire
│   │   └── TaskCard        # Carte de tâche
│   ├── features/            # Fonctionnalités
│   │   └── auth/           # Authentification
│   ├── pages/               # Pages de l'application
│   │   ├── Login.tsx       # Page de connexion
│   │   ├── Dashboard.tsx   # Vue principale
│   │   └── RendezVous.tsx  # Exemple métier
│   └── App.tsx              # Point d'entrée
```
## Vidéos de démonstration

Vous trouverez des vidéos expliquant le fonctionnement de l'application métier dans le dossier `application_web_metier` sur Google Drive :

👉 [https://drive.google.com/drive/folders/11PsjHdyLRaDCrUcrGKBh8lVyZsZUBdN3?usp=sharing](https://drive.google.com/drive/folders/11PsjHdyLRaDCrGKBh8lVyZsZUBdN3?usp=sharing)

## Contribution

OLGA METIER est open source. Toutes les contributions sont les bienvenues !

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/ma-feature`)
3. Committez vos changements (`git commit -m 'Ajout de ma feature'`)
4. Pushez (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request
