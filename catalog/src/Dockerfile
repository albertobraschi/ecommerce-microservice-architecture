FROM    ubuntu:14.04

# Install Node.js and npm
RUN     apt-get update
RUN     apt-get install -y nodejs
RUN     apt-get install -y npm
RUN     ln -s /usr/bin/nodejs /usr/bin/node

# Install app dependencies
COPY    package.json /src/package.json
RUN     cd /src; npm install

# Bundle app source
COPY    . /src

EXPOSE  8080

CMD ["node", "/src/app.js"]
