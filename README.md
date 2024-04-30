# Mentat
> Name from the story of Dune: https://en.wikipedia.org/wiki/Organizations_of_the_Dune_universe#Mentats

#### Deployment Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/e263382c-0b77-4565-ab77-59171da598f9/deploy-status)](https://app.netlify.com/sites/peaceful-haupia-3d45cd/deploys)

#### Local run
```shell
docker run --rm -p 5173:5173 -v `pwd`:/app -w /app -it node:21-bookworm-slim /bin/bash
# in container
npm install
npm run dev
```
#### Run prettier 

Check current directory
```
npx prettier . --check
```
Formatt current directory 
```
npx prettier . --write
```
