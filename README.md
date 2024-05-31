# Around The World - Places Guide

## Features

- Users can share places with image and locatin with other users
- User profile (Authentication & Autherization)
- Multiple data models, image upload etc.
- Places management
- Google maps API
- Database management (places & users)

## Usage

### ES Modules in Node

We use ECMAScript Modules in the backend in this project. Be sure to have at least Node v14.6+ or you will need to add the "--experimental-modules" flag.

Also, when importing a file (not a package), be sure to add .js at the end or you will get a "module not found" error

You can also install and setup Babel if you would like

### Install Dependencies (frontend & backend)

```
cd server
npm install
cd client
npm install
```
### Create enviroment variables (.env) files
```
cd server
create a .env file in the server directory
add your mongodb connection string and jwt password ex>
MONGODB_URL = "mongodb+srv://<username>:<password>@cluster0.h9ufhbt.mongodb.net/"
JWT_KEY = "jwt"

cd client
create a .env file
add
VITE_REACT_APP_BACKEND_URL=http://localhost:5000/api
VITE_REACT_APP_ASSET_URL=http://localhost:5000

```

### Run

```
# Run server (localhost:5000)
npm start

# Run client (localhost:5173)
npm run dev

```


## Build & Deploy

```
# Create frontend prod build
cd client
npm run build
```
