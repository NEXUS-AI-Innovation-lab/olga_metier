
# Audit global - OLGA METIER (frontend)

Date: 2026-02-20

## Perimetre

- Application frontend Vite + React + TypeScript.
- Analyse statique du code source et de la structure du projet.
- Pas d'execution locale ni de tests end-to-end.

## Synthese

- L'application est fonctionnelle sur les parcours de base, mais plusieurs points bloquants ou risqués ont ete detectes.
- Plusieurs elements du moteur de formulaires sont incomplets (types non rendus, comportement partiel).
- La dette technique principale concerne la fiabilite (erreurs silencieuses), la maintenabilite (duplications).

## Analyse de la structure

- Structure confuse par domaines: pages, components, features, moteur de formulaires.
- Moteur de formulaires centralise dans src/components/formInterpreter.
- Dicom viewer isole et relativement independant.
- Absence de couche service/API centralisee: appels fetch disperses dans les pages.

## Revue technique (qualite, lisibilite, duplication,  complexite)

- Duplication d'appels API et de logique de formulaire dans plusieurs pages.
- Faible gestion d'erreurs: la plupart des catch sont silencieux.
- Utilisation de localStorage comme source d'auth sans protection.
- Logging debug present dans plusieurs composants.

## Verification des fonctionnalites principales (par lecture)

- Connexion utilisateur par email et redirection vers /dash.
- Recuperation d'inventaires, taches en cours, taches demarrees.
- Execution de formulaire dynamique via schema Zod.
- Dicom viewer avec outils d'annotation et export d'image.

## Problemes identifies et priorises

### P0 - Critiques

- Redirection intempestive vers /login meme si un email existe (race condition et logique de redirection). Impact: experience utilisateur et acces aux pages proteges. Voir AuthProvider dans src/features/auth/context.
- Incoherence de protection des routes: /login est aussi protege, ce qui rend la logique de redirection fragile. Voir src/router.tsx.

### P1 - Eleves

- Absence de rendu pour certains types de champs du formulaire (ex: select en mode view, file). Impact: formulaires incomplets ou incoherents. Voir src/components/formInterpreter/index.tsx.
- Gestion d'erreurs silencieuse sur les appels API: impossible de diagnostiquer les pannes et UX degradee. Voir pages home, dash, acteurs.
- Donnees d'authentification lues via localStorage dans les composants au lieu du contexte, ce qui peut desynchroniser l'UI (ex: Navbar). Voir src/components/Navbar.tsx.
- Slider DICOM sans gestion d'evenement: l'index d'image ne change pas. Impact: fonctionnalite inoperative. Voir src/components/formInterpreter/formElements/DicomViewer/index.tsx.

### P2 - Moyens

- Duplication de la logique rendez-vous entre pages home et acteurs. Impact: maintenance couteuse. Voir src/pages/home.tsx et src/pages/acteurs.tsx.
- Dependances de type installees en dependencies au lieu de devDependencies (ex: @types/lodash). Impact: bundle inutile. Voir package.json.
- Hooks avec nommage ambigu (useCollectionData) mais sans hooks React, peut brouiller la maintenance. Voir src/components/formInterpreter/collections/hooks.ts.
- Nettoyage absent des ressources DICOM (rendering engine, tool group). Impact: fuite memoire possible en navigation. Voir src/components/formInterpreter/formElements/DicomViewer/DicomViewer.tsx.

## Incoherences architecturales / code

- Pas de couche API centralisee, logique reseau dupliquee dans les pages.
- Auth uniquement basee sur localStorage, pas de mecanisme de session ni de token.
- Dossiers pages en minuscules, mais README mentionne Login.tsx / Dashboard.tsx. Risque de confusion.

## Performance (risques potentiels)

- Multiples requetes sans cache a la navigation (sauf react-query). Pas de strategie de retry / backoff.
- Dicom viewer charge toutes les images en memoire; pas de lazy loading ou de pagination.
- Rendu conditionnel lourd dans FormInterpreter sans memoisation sur la liste d'elements.

## Dependances inutiles ou obsoletes (a verifier)

- @types/lodash dans dependencies: devDependency recommande.
- @heroui/scroll-shadow semble non utilise (aucun import direct). A valider.

## Risques techniques

- Redirections auth pouvant bloquer des pages legitimes.
- Formulaires dynamiques partiellement rendus, risque de blocage des workflows.
- Erreurs silencieuses masquant des defaillances backend.
- Potentielles fuites memoire dans le viewer DICOM.

## Axes d'amelioration proposes

- Refactor auth: ajouter un etat loading, centraliser la lecture de localStorage, proteger uniquement les routes privees.
- Centraliser les appels API dans un module service avec gestion d'erreur uniforme.
- Completer le rendu des elements de formulaire (select view, file, section, notice) et tester les events.
- Ajouter des feedbacks UX sur erreurs (toast, message inline) et sur loading.
- Nettoyer les ressources DICOM lors du unmount.
- Normaliser la convention de nommage des pages et mettre a jour le README.

## Plan d'action (priorise)

1) Corriger la logique d'auth et la protection des routes.
2) Completer le moteur de formulaires pour couvrir 100% des types attendus.
3) Mettre en place une couche API et une gestion d'erreurs standardisee.
4) Nettoyage technique: dependances, logs, duplication.
5) Ameliorations performance (DICOM, rendu formulaire) si necessaire.

