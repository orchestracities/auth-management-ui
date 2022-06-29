#!/bin/bash -e
docker-compose down -v
docker image rm orchestracities/configuration-api 
docker image rm orchestracities/management-ui
docker image rm orchestracities/anubis-management-api:master
