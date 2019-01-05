FROM node:10.14.2-alpine

ENV USERNAME node
ENV HOME /home/$USERNAME
ENV APP_PATH $HOME/app
ENV API_PORT 4060
ENV APP_PORT 3000
ENV DEBUGGER_PORT 9229
# for nuxt to be exposed correctly
# https://stackoverflow.com/a/43746783
ENV HOST 0.0.0.0

# dockerize
# https://github.com/jwilder/dockerize#for-alpine-images
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Create app directory
WORKDIR $APP_PATH

# Install app dependencies efficiently
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package*.json /tmp/
COPY yarn.lock /tmp/
RUN cd /tmp && yarn --pure-lockfile
RUN mv /tmp/node_modules $APP_PATH/node_modules

# Bundle app source
COPY . $APP_PATH

EXPOSE $API_PORT
EXPOSE $APP_PORT
EXPOSE $DEBUGGER_PORT

CMD [ "yarn", "start" ]
