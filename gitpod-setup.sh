#!/bin/sh
echo "What is your Astra DB username?"
read ASTRA_DB_USERNAME
echo "\nWhat is your Astra DB password?"
read ASTRA_DB_PASSWORD
echo "\nWhat is your Astra keyspace name?"
read ASTRA_DB_KEYSPACE
echo "\nWhat is your Astra endpoint? (Example: https://4e62bc79-0e12-us-east1.apps.astra.datastax.com)"
read ASTRA_ENDPOINT
eval $(gp env -e ASTRA_DB_USERNAME=$ASTRA_DB_USERNAME ASTRA_DB_PASSWORD=$ASTRA_DB_PASSWORD ASTRA_DB_KEYSPACE=$ASTRA_DB_KEYSPACE ASTRA_ENDPOINT=$ASTRA_ENDPOINT)
