# QuickSnap Inventory – Architecture & Fonctionnalités v1.0

**Nom de l'application** : QuickSnap Inventory  
**Objectif** : Gestion d'inventaire offline avec photos miniatures + QR codes uniques scannables  
**Public cible** : Utilisateurs qui rangent des objets/cartons et veulent les retrouver rapidement sans ouvrir les boîtes  
**Date de conception** : Février 2026  
**Environnement technique de base**  
- Expo SDK 54  
- React Native 0.81  
- React 19  
- TypeScript natif  
- Development build via `npx expo run:android` / iOS  
- Approche : Offline-first, performance prioritaire, préparation future sync + web

## Stack technique globale (confirmée)

| Catégorie                  | Librairie principale                          | Rôle principal                              | Choix stratégique                              |
|----------------------------|-----------------------------------------------|---------------------------------------------|------------------------------------------------|
| Navigation                 | @react-navigation/native + native-stack       | Navigation entre écrans                     | Simple, performant, compatible web futur       |
| Gestion d’état global      | Context API                                   | État partagé (items, catégories, settings)  | Zéro dépendance, suffisant pour v1             |
| Styles                     | NativeWind (Tailwind pour RN)                 | Styling rapide et cohérent                  | Productivité + maintenance facile              |
| Base de données locale     | op-sqlite                                     | Stockage items, catégories, settings        | Très haute performance (JSI), scalable sync    |
| Caméra & Scan QR           | react-native-vision-camera + vision-camera-code-scanner | Capture photo + détection QR temps réel | Meilleure perf et fiabilité scan               |
| Génération QR Code         | react-native-qrcode-svg                       | Affichage QR vectoriel                      | Léger, offline, compatible web                 |
| Manipulation images        | react-native-image-resizer                    | Création miniatures optimisées              | Contrôle taille / qualité                      |
| Gestion fichiers locaux    | expo-file-system                              | Sauvegarde URIs images                      | Standard Expo, fiable                          |
| UUID / Crypto              | expo-crypto                                   | Génération identifiants uniques             | Sécurisé et rapide                             |
| Persistance settings       | @react-native-async-storage/async-storage     | Theme, username, high_res_enabled           | Simple et asynchrone                           |
| Permissions                | expo-camera + expo-media-library              | Accès caméra et galerie                     | Compatibilité Expo                             |

## Écrans principaux & Fonctionnalités par écran

### 1. Splash / Loading Screen (optionnel mais recommandé)
- Affichage logo + chargement initial
- Chargement asynchrone : DB + settings + items récents
- Librairies : aucune spécifique (React Native core + Context)

### 2. Home Screen (Écran principal – Liste des items)
Fonctionnalités :
- Affichage liste des items (FlatList)
- Recherche texte rapide (filtre local)
- Affichage miniature photo + nom + catégorie (badge coloré)
- Bouton scan QR rapide (accès direct caméra)
- Bouton “+ Ajouter item”
- Tri (par nom, date, catégorie)
- Indicateur “dernier scan” ou “non scanné récemment”

Librairies principales :
- FlatList (React Native)
- NativeWind (styles)
- Context API (récupération items)
- Image (React Native) pour miniatures

### 3. Add / Edit Item Screen
Fonctionnalités :
- Saisie nom de l’objet
- Sélection catégorie (dropdown / picker)
- Prise de photo (caméra) ou choix depuis galerie
- Génération automatique QR unique (UUID)
- Affichage aperçu QR (SVG)
- Option haute résolution (toggle settings)
- Validation (nom obligatoire)
- Sauvegarde → DB + mise à jour Context

Librairies principales :
- react-native-vision-camera (prise photo)
- expo-media-library (accès galerie)
- react-native-image-resizer (miniature)
- expo-file-system (stockage fichier local)
- expo-crypto (UUID)
- react-native-qrcode-svg (affichage QR)
- TextInput, Picker, Switch (RN core)

### 4. Scan QR Screen
Fonctionnalités :
- Ouverture caméra en temps réel
- Détection automatique QR
- Overlay avec nom + photo de l’item trouvé
- Si QR inconnu → proposition “Ajouter cet objet ?”
- Vibration / son de confirmation
- Retour automatique vers détail ou home après scan réussi

Librairies principales :
- react-native-vision-camera
- vision-camera-code-scanner (frame processor QR)
- Haptics (React Native) pour feedback

### 5. Item Detail Screen
Fonctionnalités :
- Affichage grande photo (zoomable si possible)
- Nom, catégorie, date création, QR data
- QR code agrandi (facile à scanner depuis un autre téléphone)
- Bouton “Modifier”
- Bouton “Supprimer” (confirmation)
- Historique mini (date dernier scan – futur)

Librairies principales :
- Image (RN) + Gesture Handler (zoom optionnel)
- react-native-qrcode-svg

### 6. Categories Management Screen
Fonctionnalités :
- Liste des catégories existantes (avec couleur)
- Ajout nouvelle catégorie (nom + couleur)
- Suppression catégorie (si aucun item attaché ou cascade)
- Édition couleur / nom

Librairies principales :
- FlatList
- Color picker simple (input hex ou mini lib optionnelle)
- Context API + op-sqlite

### 7. Settings Screen
Fonctionnalités :
- Thème : Light / Dark / System
- Username (affichage simple)
- Qualité photo : Haute résolution (toggle)
- Effacer toutes les données (reset DB – confirmation)
- Informations app (version, crédits)

Librairies principales :
- Switch, TextInput (RN)
- @react-native-async-storage/async-storage
- useColorScheme (React Native)

## Approches choisies – Récapitulatif stratégique

| Choix                              | Raison principale                                      | Avantage pour v1.0                          | Préparation futur                           |
|------------------------------------|----------------------------------------------------------------|---------------------------------------------|---------------------------------------------|
| op-sqlite au lieu de expo-sqlite   | Performance 2–10× supérieure sur gros volume           | Scans et listes fluides                     | Sync future (PowerSync)  |
| Vision Camera au lieu de expo-camera | Meilleure qualité scan QR et frame processing          | Fiabilité détection                         | Fonctions avancées (OCR, objets futurs)     |
| Context API seul                   | Simplicité, zéro boilerplate                           | Apprentissage rapide                        | Migration facile vers Zustand / Jotai       |
| NativeWind                         | Productivité styling + cohérence                       | UI moderne rapidement                       | Compatible web + design system futur        |
| Images locales + resizer           | Tout offline, maîtrise stockage                        | Pas de cloud forcé                          | Upload optionnel plus tard                  |
| QR via SVG                         | Léger, vectoriel, pas de pixelisation                 | Affichage net sur tous écrans               | Export PDF/impression facile                |
| AsyncStorage pour settings         | Persistance légère et rapide                           | Suffisant pour 3-4 clés                     | Migration SQLite si + complexe              |

## Fonctionnalités futures envisagées (post v1.0)

- Synchronisation cloud (Supabase, Firebase, PowerSync)
- Export / Import JSON ou CSV
- Version web (Expo web + fallback caméra)
- Tags / recherche avancée
- Statistiques (nb items par catégorie)
- Sauvegarde automatique périodique
