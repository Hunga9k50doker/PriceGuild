### ------------------------------------------------------------------
## RUN Using docker compose
# Server
# -d: run in background
docker-compose -f docker-compose.yml up -d 
# Local
docker-compose -f docker-compose-local.yml up -d

## STOP docker container
docker-compose down

### ------------------------------------------------------------------
## OR build image
# Server
docker build -t react-nginx --force-rm -f Dockerfile .
# Local
docker build -t react-nginx --force-rm -f Dockerfile-LOCAL .

## run image
docker run -it -rm react-nginx