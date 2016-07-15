# Destroy and rebuild docker machine
```
docker-machine rm default -y && \
    docker-machine create --driver virtualbox default
```

# REMOVE ALL
```
docker stop dns && docker rm dns
docker stop catalog && docker rm catalog
docker stop catalog-data && docker rm catalog-data
docker stop catalog-test && docker rm catalog-test
docker stop checkout && docker rm checkout
docker stop checkout-data && docker rm checkout-data
docker stop checkout-test && docker rm checkout-test
```

# BUILD & RUN

## dns
```
docker run --name dns \
    --rm -v /var/run/docker.sock:/docker.sock \
    phensley/docker-dns \
    --domain microcommerce.test
```
    
## catalog-data
```
docker run --name catalog-data \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    --rm redis
```

## checkout-data
```
docker run --name checkout-data \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    --rm redis
```

## catalog
```
docker build -t salvozappa/nodejs ./catalog/src && \
    docker run --name catalog \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    --rm salvozappa/nodejs
```

## catalog-test
```
docker build -t salvozappa/mocha ./catalog/test && \
    docker run --name catalog-test \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    --rm salvozappa/mocha
```

## checkout
```
docker build -t salvozappa/nodejs ./checkout/src && \
    docker run --name checkout \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    --rm salvozappa/nodejs
```

## checkout-test
```
docker build -t salvozappa/mocha ./checkout/test && \
    docker run --name checkout-test \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    --rm salvozappa/mocha
```

## bash
```
docker run -it --rm \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search microcommerce.test \
    ubuntu /bin/bash
```
