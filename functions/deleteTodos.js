const fetch = require("cross-fetch");
const ENDPOINT = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1`;
const ASTRA_DB_KEYSPACE = process.env.ASTRA_DB_KEYSPACE;
const TABLE_NAME = "jamstack_todos";

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  try {
    const response = await fetch(
      `${ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/${body.sessionId}`,
      {
        method: "DELETE",
        headers: {
          "x-cassandra-token": process.env.ASTRA_DB_APPLICATION_TOKEN,
        },
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }
};
