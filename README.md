# 💰 Budget FCFA

Application mobile de gestion budgétaire personnelle, optimisée pour les montants en FCFA.

![Budget FCFA](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Fonctionnalités

- 🏠 **Tableau de bord** — solde en temps réel, barre de progression, alertes
- ➕ **Gestion des dépenses** — ajout rapide avec catégories (Logement, Nourriture, Transport, Santé, Loisirs, Éducation)
- 💾 **Épargne automatique** — transfert du solde restant vers une caisse d'épargne cumulative
- 📊 **Statistiques** — graphiques mensuels et répartition par catégorie
- 💰 **Suivi de l'épargne** — évolution sur 12 mois avec courbe cumulative
- 📱 **Mode hors ligne** — données stockées localement (localStorage)
- 🔔 **Alertes** — notification quand 80% du salaire est dépensé

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- npm (inclus avec Node.js)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE_USERNAME/budget-fcfa.git

# 2. Aller dans le dossier
cd budget-fcfa

# 3. Installer les dépendances
npm install

# 4. Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🏗️ Structure du projet

```
budget-fcfa/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx       # Navigation en bas
│   │   ├── HomeScreen.jsx      # Tableau de bord
│   │   ├── AddExpenseScreen.jsx # Ajout de dépenses
│   │   ├── StatsScreen.jsx     # Statistiques & graphiques
│   │   └── EpargneScreen.jsx   # Suivi épargne
│   ├── store/
│   │   └── useBudgetStore.js   # État global (Zustand)
│   ├── utils/
│   │   └── constants.js        # Constantes & utilitaires
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Technologies

| Technologie | Usage |
|-------------|-------|
| React 18 | Interface utilisateur |
| Vite 5 | Build tool rapide |
| Zustand | Gestion d'état + persistance |
| Recharts | Graphiques interactifs |
| Lucide React | Icônes |

## 📦 Build pour production

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`.

## 🌐 Déploiement GitHub Pages

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter dans package.json :
# "homepage": "https://VOTRE_USERNAME.github.io/budget-fcfa",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

npm run deploy
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT — libre d'utilisation et de modification.
