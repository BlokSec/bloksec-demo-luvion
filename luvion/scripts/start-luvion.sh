#!/bin/bash
VERSION=1.0.0

docker stop luvion
docker image rm bloksec/luvion:$VERSION
docker run -d -p 3000:8080 \
  --rm \
  --name luvion \
  --env NODE_ENV=production \
  --env BASE_URL=https://luvion.bloksec.io \
  --env BLOKSEC_HOST=https://sandbox.bloksec.io \
  --env APP_DID=5e0e60e900ab443b6a18149f \
  --env APP_SECRET=RTtB8Aj5itRfF8AbsrgTGpSdw4n6nRdFifcJHpdU \
  bloksec/luvion:$VERSION

docker logs -f luvion
