FROM node:14

# WORKDIR in docker container
WORKDIR /frontend

# Docker uses caching so install all the dependencies first
COPY package*.json .
RUN npm install

# Source code changes much more often so easier to rebuild the image when you structure like this
# copy react app to the container
COPY . .

# We could just set REACT_APP_DATA_ENCRYPTION_KEY in .env file
# But do it like this because it's needed for prod anyways
ARG DATA_ENCRYPTION_KEY
ENV REACT_APP_DATA_ENCRYPTION_KEY=$DATA_ENCRYPTION_KEY

CMD ["npm", "start"]