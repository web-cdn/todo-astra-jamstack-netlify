#!/bin/sh
echo "What is your Astra DB username? 🚀"
read ASTRA_DB_USERNAME
echo "\nWhat is your Astra DB password? 🔒"
read ASTRA_DB_PASSWORD
echo "\nWhat is your Astra keyspace name? 🔑"
read ASTRA_DB_KEYSPACE
echo "\nWhat is your Astra database id? Example: 4e62bc79-0e12-4667-bd7d-2191ece2a32c ☁️"
read ASTRA_DB_ID

echo "\nWhat is your Astra database region? Example: us-east1 🌍"
read ASTRA_DB_REGION

ASTRA_ENDPOINT="https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com"

# Set GitPod.io environment variables
eval $(gp env -e ASTRA_DB_USERNAME=$ASTRA_DB_USERNAME ASTRA_DB_PASSWORD=$ASTRA_DB_PASSWORD ASTRA_DB_KEYSPACE=$ASTRA_DB_KEYSPACE ASTRA_ENDPOINT=$ASTRA_ENDPOINT)
eval $(gp env -e)

# Get Astra auth token
ENDPOINT="https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1/auth"
AUTH_TOKEN=$(curl --request POST \
  --url $ENDPOINT \
  --header 'content-type: application/json' \
  --data '{"username":"'${ASTRA_DB_USERNAME}'","password":"'${ASTRA_DB_USERNAME}'"}'  | jq -r '.authToken')

# Create todos table
curl --request POST \
  --url "https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1/keyspaces/${ASTRA_DB_KEYSPACE}/tables" \
  --header 'content-type: application/json' \
  --header "x-cassandra-token: ${AUTH_TOKEN}" \
  --data '{"ifNotExists":true,"columnDefinitions":[{"static":false,"name":"list_id","typeDefinition":"text"},{"static":false,"name":"id","typeDefinition":"timeuuid"},{"static":false,"name":"title","typeDefinition":"text"},{"static":false,"name":"completed","typeDefinition":"boolean"}],"primaryKey":{"partitionKey":["list_id","id"]},"tableOptions":{"defaultTimeToLive":0,"clusteringExpression":[{"column":"id","order":"DESC"}]},"name":"todos"}'
