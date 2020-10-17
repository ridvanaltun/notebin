ARG DOCKER_IMAGE
FROM dpage/pgadmin4:4.27

# root user is required for the coming operations
USER root

# create servers
WORKDIR /pgadmin4/
COPY ./servers.json ./servers.json

ARG APP_NAME
ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_DATABASE
ARG POSTGRES_USER

# fill /pgadmin4/servers.json
RUN sed -i -r "s/%%APP_NAME%%/${APP_NAME}/g" servers.json && \
  sed -i -r "s/%%POSTGRES_HOST%%/${POSTGRES_HOST}/g" servers.json && \
  sed -i -r "s/%%POSTGRES_PORT%%/${POSTGRES_PORT}/g" servers.json && \
  sed -i -r "s/%%POSTGRES_DATABASE%%/${POSTGRES_DATABASE}/g" servers.json && \
  sed -i -r "s/%%POSTGRES_USER%%/${POSTGRES_USER}/g" servers.json

# create password file
# @see https://www.postgresql.org/docs/9.1/libpq-pgpass.html
# The file can only be used when it has umask 600 (only readable, writable by pgadmin)
ARG POSTGRES_PASSWORD
RUN echo "${POSTGRES_HOST}:${POSTGRES_PORT}:${POSTGRES_DATABASE}:${POSTGRES_USER}:${POSTGRES_PASSWORD}" > ./pgpassfile && \
  chown pgadmin:pgadmin ./pgpassfile && \
  chmod 600 ./pgpassfile

# load servers
RUN python /pgadmin4/setup.py --load-servers /pgadmin4/servers.json