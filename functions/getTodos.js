const fetch = require("cross-fetch");
const ENDPOINT = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1`;
const ASTRA_DB_KEYSPACE = process.env.ASTRA_DB_KEYSPACE;
const TABLE_NAME = "jamstack_todos";

exports.handler = async (event, context) => {
  const { path } = event;
  const sessionId = path.split("getTodos/")[1];
  try {
    const response = await fetch(
      `${ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/${sessionId}`,
      {
        headers: {
          "x-cassandra-token": process.env.ASTRA_DB_APPLICATION_TOKEN,
        },
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(await response.json()),
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }
};
