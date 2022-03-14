
#!/bin/bash -e

rep=$(curl -s --unix-socket /var/run/docker.sock http://ping > /dev/null)
status=$?

if [ $status -eq 7 ]; then
    echo 'docker is not running - test will not be executed'
    exit 1
fi
echo "Downloading Decendencies ..."
npm install --force
cd keycloak-connect-graphql/examples/config
wget https://raw.githubusercontent.com/orchestracities/anubis/ui-connector/keycloak/realm-export.json -O realm-export.json
mkdir config
cd config
mkdir opa-service
cd opa-service
wget https://raw.githubusercontent.com/orchestracities/anubis/master/config/opa-service/opa.yaml -O opa.yaml



echo "Deploying services via Docker Compose..."
cd ..
cd ..
 docker-compose up -d



echo "Setting up tenant Tenant1..."
curl -s -i -X 'POST' \
  'http://127.0.0.1:8085/v1/tenants/' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Tenant1"
}'

echo "Setting up policy that allows reading and creating entities under tenant Tenant1 and path / ..."
curl -s -i -X 'POST' \
'http://127.0.0.1:8085/v1/policies/' \
-H 'accept: */*' \
-H 'fiware_service: Tenant1' \
-H 'fiware_service_path: /' \
-H 'Content-Type: application/json' \
-d '{
"access_to": "*",
"resource_type": "entity",
"mode": ["acl:Read"],
"agent": ["acl:AuthenticatedAgent"]
}'

curl -s -i -X 'POST' \
'http://127.0.0.1:8085/v1/policies/' \
-H 'accept: */*' \
-H 'fiware_service: Tenant1' \
-H 'fiware_service_path: /' \
-H 'Content-Type: application/json' \
-d '{
"access_to": "*",
"resource_type": "entity",
"mode": ["acl:Write"],
"agent": ["acl:AuthenticatedAgent"]
}'

curl -s -i -X 'POST' \
'http://127.0.0.1:8085/v1/policies/' \
-H 'accept: */*' \
-H 'fiware_service: Tenant1' \
-H 'fiware_service_path: /' \
-H 'Content-Type: application/json' \
-d '{
"access_to": "*",
"resource_type": "entity",
"mode": ["acl:Control"],
"agent": ["acl:AuthenticatedAgent"]
}'
echo "Setting up Keycloack"

docker cp  realm-export.json config_keycloak_1:/opt/jboss/keycloak/bin
docker exec -ti config_keycloak_1 bash "-c" "cd opt/jboss/keycloak/bin && sh standalone.sh -Dkeycloak.migration.action=import -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=realm-export.json -Dkeycloak.migration.strategy=OVERWRITE_EXISTING -Djboss.http.port=8888 -Djboss.https.port=9999 -Djboss.management.http.port=7777" 
 exit 1