# JAMStack + Netlify + Astra + Cassandra Example
This is an example React Todo application
using a [DataStax Astra](https://astra.datastax.com/register) free tier database.

The project interacts directly with the database from the React frontend and can be deployed to Netlify for free with a few clicks.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/phact/todo-astra-jamstack-netlify) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/phact/todo-astra-jamstack-netlify)

## Getting started
1. Create a [DataStax Astra](https://astra.datastax.com/register) Cassandra database (free tier):
![image](https://user-images.githubusercontent.com/3254549/88737275-c938f080-d0ed-11ea-8273-f547da8ef9e6.png)
2. Click use this template at the top of the README:
![image](https://user-images.githubusercontent.com/3254549/88738196-161cc700-d0ee-11ea-9bd4-b5389b19f4bb.png)
3. Enter a repository name and click repository from template:
![image](https://user-images.githubusercontent.com/3254549/88738761-42384800-d0ee-11ea-82e8-a2cd085b6f83.png)
4. Clone the repository:
![image](https://user-images.githubusercontent.com/3254549/88739059-6e53c900-d0ee-11ea-9b25-56b2436a9817.png)
5. Install Node dependencies: `npm install`.
6. Set `ASTRA_DB_USERNAME`, `ASTRA_DB_PASSWORD`, `ASTRA_DB_KEYSPACE`, `ASTRA_DB_ID`, and `ASTRA_DB_REGION` environment variables.
7. Build the app: `npm run dev`.

## Things to Note:
 - The contents of this repo are based on [Jakes's port](https://github.com/tjake/todo-astra-react-serverless/) of the [TodoMVC code](https://github.com/tastejs/todomvc/tree/master/examples/react) originally written by [Pete Hunt](https://github.com/petehunt).
 - The example is modified from https://github.com/huksley/todo-react-ssr-serverless.
