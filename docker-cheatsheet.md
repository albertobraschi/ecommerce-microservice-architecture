# Destroy and rebuild docker machine
```
docker-machine rm default -y && \
    docker-machine create --driver virtualbox default
```

# BUILD & RUN

## dns
```
docker run --name dns \
    --rm -v /var/run/docker.sock:/docker.sock \
    phensley/docker-dns \
    --domain hamaca.io
```
    
## catalog-data
```
docker run --name catalog-data \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    --rm redis
```

## catalog
```
docker build -t salvozappa/nodejs ./catalog/src && \
    docker run --name catalog \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    --rm salvozappa/nodejs
```

## catalog-test
```
docker build -t salvozappa/mocha ./catalog/test && \
    docker run --name catalog-test \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    --rm salvozappa/mocha
```

## checkout
```
docker build -t salvozappa/nodejs ./checkout/src && \
    docker run --name checkout \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    --rm salvozappa/nodejs
```

## checkout-test
```
docker build -t salvozappa/mocha ./checkout/test && \ 
    docker run --name checkout-test \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    --rm salvozappa/mocha
```

## bash
```
docker run -it --rm \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    ubuntu /bin/bash 
```
