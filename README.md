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
npm install
cd client
npm install
```

### Run

```
# Run client (:3000) & server (:5000)
npm run dev

# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
cd client
npm run build
```
