# Guide d'initialisation de l'infrastructure

Ce guide liste les actions manuelles à effectuer pour initialiser l’infrastructure et les stacks Pulumi.

## Configuration locale

Copier le fichier d’exemple d’environnement :
```bash
cp .env.example .env
```

## Création du projet Scaleway

1. Dans la console Scaleway, aller dans **Projets** et créer un nouveau projet.
2. Remplir les informations du projet : nom et description.
3. Copier l’ID du projet et le coller dans la variable `SCW_DEFAULT_PROJECT_ID` du fichier `.env`.

## Création de l’API Key Scaleway

1. Dans la console Scaleway, aller dans **Security & Identity** > **IAM**
2. Aller dans l’onglet **API Keys** et générer une nouvelle API Key en remplissant la description et en **sélectionnant le projet créé précédemment**.
3. Copier l’Access Key et la Secret Key, et les coller dans les variables `SCW_ACCESS_KEY` et `SCW_SECRET_KEY` du fichier `.env`.

## Création des stacks Pulumi

1. Installer Pulumi si ce n’est pas déjà fait : https://www.pulumi.com/docs/get-started/install/
2. Aller dans le répertoire `infrastructure`
3. Installer les dépendances :
    ```bash
    npm install
    ```
4. Se connecter à Pulumi (un compte gratuit peut être créé si nécessaire) :
    ```bash
    pulumi login
    ```
5. Initialiser les stacks `dev` et `prod` :
   ```bash
   pulumi stack init dev
   ```
   ```bash
   pulumi stack init prod
   ```
