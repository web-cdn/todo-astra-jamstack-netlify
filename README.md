# Code Splitting + SSR + Serverless + DataStax Astra  with React Router demo

This is a demo repository set up to demo code splitting by route on React Router 
with server rendered React components.

After you fetch server rendered HTML routes start fire __locally__.

## Preparing for demo

Before running the demo, you must install a number of components

  * AWS cli &amp; proper credentials
  * servlerless (`npm install -g serverless`)

Also, create [DataStax Astra](http://astra.datastax.com) Cassandra database: 
    
  * To keep allow defaults to work name cluster and keyspace `tododemo`
  * Download secure bundle to local astra directory 

## Running in AWS

Deploys Lambda and sets up API Gateway. If custom domain specified, deploys app under this custom domain (first deploy might take some time)

```bash
PUBLIC_PATH=/dev/ \
ASTRA_USERNAME=tododemo \
ASTRA_PASSWORD=****** \
run sls:deploy
```

To initialize/clear the Astra C* Database:

 `curl -X POST https://{deployed_endpoint}/api/init`

## Running locally

```bash
git clone https://github.com/tjake/todo-react-serverless-astra
cd todo-react-serverless-astra
npm install
npm run build
ASTRA_USERNAME=tododemo \
ASTRA_PASSWORD=******** \
ASTRA_npm start
```

To initialize/clear the Astra C* Database:
 
 `curl -X POST https://localhost:3000/api/init`


### Running in AWS with a Custom Domain

  * Create/transfer yourdomain.com in/to Route53
  * Verify yourdomain.com ownership
  * Create *.yourdomain.com certificate request in CloudFront Global (N. Virginia)
  * Wait for it verification
  
Run once to deploy domain:

```
CUSTOM_DOMAIN=todo.domain.com CUSTOM_DOMAIN_ENABLED=true API_URL=https://todo.yourdomain.com/api npm run sls create_domain
```

To properly serve assets you can use bucket for static files (created automatically by serverless)

```
PUBLIC_PATH=https://s3-eu-west-1.amazonaws.com/todocdn.yourdomain.com/ \
  CDN_BUCKET=todocdn.yourdomain.com \
  CUSTOM_DOMAIN=todo.yourdomain.com \
  CUSTOM_DOMAIN_ENABLED=true \
  API_URL=https://todo.yourdomain.com/api \
  npm run sls:deploy
```

![todo](./todo.png)

## Things of note:

 - The contents of this repo were based on the [TodoMVC code](https://github.com/tastejs/todomvc/tree/master/examples/react) originally written by [Pete Hunt](https://github.com/petehunt).
 - Upgraded to webpack v4 comparing to upstream repo
 - We have 3 webpack configs:
   - One for server
   - Another for client
   - Third one (./webpack.serverless.js) for running in serverless
 - The server starts with empty data. Run `curl -X POST http://localhost:3000/api/init` to load initial data.
