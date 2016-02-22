# Set environment
eval "$(docker-machine env default)"

# Reset docker machine
docker-machine rm default -y && docker-machine create --driver virtualbox default && eval "$(docker-machine env default)"

# Build image
docker build -t salvozappa/nodejs .

# RUN

## dns
docker run --name dns \
    --rm -v /var/run/docker.sock:/docker.sock \
    phensley/docker-dns \
    --domain hamaca.io

## catalog
docker build -t salvozappa/nodejs . && docker run --name catalog -p 8080:8080    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns)     --dns-search hamaca.io     -iP --rm salvozappa/nodejs

## catalog-data
docker run --name catalog-data \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    --rm redis

## bash
docker run -it --rm \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    ubuntu /bin/bash 