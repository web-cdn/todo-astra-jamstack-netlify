#!/bin/sh
echo What is your Astra DB username?
read ASTRA_DB_USERNAME
echo What is your Astra DB password?
read ASTRA_DB_PASSWORD
echo What is your Astra keyspace name?
read ASTRA_DB_KEYSPACE
echo What is your Astra endpoint?
read ASTRA_ENDPOINT
eval $(gp env -e ASTRA_DB_USERNAME=$ASTRA_DB_USERNAME ASTRA_DB_PASSWORD=$ASTRA_DB_PASSWORD ASTRA_DB_KEYSPACE=$ASTRA_DB_KEYSPACE ASTRA_ENDPOINT=$ASTRA_ENDPOINT)
