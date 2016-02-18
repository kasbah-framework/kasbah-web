FROM postgres:9.5.1
ENV POSTGRES_PASSWORD kasbahweb
ENV POSTGRES_USER kasbahweb
ENV POSTGRES_DB kasbahweb

COPY schema.sql /docker-entrypoint-initdb.d
