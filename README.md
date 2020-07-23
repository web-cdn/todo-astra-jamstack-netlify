# JAMStack + Netlify + DataStax Astra + Apache Cassandra with React Router Example

This is an example React Todo application
using a [DataStax Astra](https://astra.datastax.com/register) free tier database for storage in AWS. 

The project interacts directly with the database from the React frontend and can be deployed on Netlify for free with a few clicks.

## Pre-reqs
1. Create a [DataStax Astra](https://astra.datastax.com/register) Cassandra database (free tier).
    

## Running locally

```bash
git clone https://github.com/phact/todo-astra-jamstack-netlify
cd todo-astra-jamstack-netlify
npm install
npm run build
```

## Using GitPod



## Running on Netlify
1. Create a [Netlify account](https://app.netlify.com/signup).
2. Connect your sample GitHub application to Netlify.
3. Your app will automatically deploy using the using the setting in [netlify.toml](netlify.toml).

## Things of note:
 - The contents of this repo are based on [Jakes's port](https://github.com/tjake/todo-astra-react-serverless/) of the [TodoMVC code](https://github.com/tastejs/todomvc/tree/master/examples/react) originally written by [Pete Hunt](https://github.com/petehunt).
 - The example is modified from https://github.com/huksley/todo-react-ssr-serverless
 
