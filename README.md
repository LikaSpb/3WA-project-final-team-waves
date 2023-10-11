# Lika-Project

Lika-Project est une application Web basée sur React (frontend) et Node.js (backend) avec MongoDB comme base de données.

## Getting Started

Ces instructions vous guideront à travers la configuration et le démarrage du projet sur votre machine locale à des fins de développement et de test.

### Pré-requis

- Node.js v16
- Yarn
- MongoDB et Robo3T
- Docker

### Installation des outils

## Node.js (v16)

- Rendez-vous sur le site officiel de Node.js pour télécharger la version v16. : https://nodejs.org/en/download
- Suivez les instructions d'installation pour votre système d'exploitation.
- Une fois installé, ouvrez votre terminal ou invite de commande et vérifiez la version avec :

```bash
node -v
```

Si tout est en ordre, vous devriez voir v16.x.

## MongoDB et Robo 3T

# MongoDB

- Visitez le site officiel de MongoDB pour télécharger la version communautaire : https://www.mongodb.com/try/download/community
- Suivez les étapes d'installation pour votre OS.
- Assurez-vous que le service MongoDB est démarré.

# Robo 3T (GUI pour MongoDB)

- Pour une meilleure visualisation et gestion de la base de données, je recommande d'utiliser Robo 3T.
- Téléchargez Robo 3T depuis le site officiel : https://robomongo.org/
- Installez et lancez Robo 3T. Connectez-vous à votre instance locale de MongoDB ou à toute autre instance que vous utilisez.

### Install yarn

```bash
npm i -g yarn
```

### Clonage du dépôt

```bash
git clone https://gitlab.msdevagency.net/schoollika/likaproject3wa.git
cd likaproject3wa
```

## Docker

- Visitez le site officiel de Docker pour télécharger Docker Desktop : https://www.docker.com/products/docker-desktop/
- Installez Docker selon les instructions de votre système d'exploitation
- Une fois l'installation terminée, démarrez Docker.
- Vérifiez que Docker fonctionne avec :

```bash
docker -v
```

## Configuration avec Docker

# Préparation des fichiers pour Docker

- Créez un dossier nommé mongodb dans votre répertoire principal du projet.

# Démarrage des services avec Docker

- Ouvrez un terminal et naviguez vers le répertoire où se trouve votre fichier docker-compose.yml.
- Exécutez la commande suivante pour démarrer vos services :

```bash
docker-compose up -d
```

Cela démarrera MongoDB . Vous pouvez les arrêter à tout moment avec docker-compose down.

## Configuration du projet

Copiez le fichier .env.example vers .env et remplissez les variables d'environnement nécessaires

```bash
cp .env.example .env
```

Voici un exemple de contenu pour le fichier .env avec des données fictives :

PORT=8000
SECRET_KEY=monSecretKeyFictif123!
ORIGINS=http://localhost:4000
MONGO_URI='mongodb://localhost:27017/monProjetDemo'

Adaptez-les selon vos besoins.

### Installation des dépendances

- Client

```bash
cd client
yarn install
```

Ouvrez un nouveau terminal : 

- Server

```bash
cd server
yarn install

```

### Exécution en mode développement

- Client

```bash
cd client
yarn dev

```

- Server

```bash
cd server
yarn dev

```

### License

Ce projet est sous licence MIT. Pour plus de détails, voir le fichier LICENSE.

### Auteurs

LikaSpb - lobodzinskaya.lika@gmail.com
