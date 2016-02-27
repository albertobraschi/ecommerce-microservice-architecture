## remove all docker containers
echo -e '\033[0;32mStopping all containers... \033[0m'
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)

echo -e '\033[0;32mStart dns... \033[0m'
## run catalog
docker run --name dns \
    -vd /var/run/docker.sock:/docker.sock \
    phensley/docker-dns \
    --domain hamaca.io

echo -e '\033[0;32mBuild and run catalog data store... \033[0m'
## run catalog-data
docker run --name catalog-data \
    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns) \
    --dns-search hamaca.io \
    -d redis

echo -e '\033[0;32mBuild and run catalog service... \033[0m'
## run catalog
docker build -t salvozappa/nodejs /Users/salvo/code/hamaca/catalog/src && docker run --name catalog -p 8080:8080    --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns)     --dns-search hamaca.io     -iPd salvozappa/nodejs

echo -e '\033[0;32mRun tests... \033[0m'
## test catalog-test
docker build -t salvozappa/mocha /Users/salvo/code/hamaca/catalog/test && docker run --name catalog-test   --dns $(docker inspect -f '{{.NetworkSettings.IPAddress}}' dns)     --dns-search hamaca.io     -iP salvozappa/mocha

echo -e '\033[0;32mStopping all containers... \033[0m'
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)
