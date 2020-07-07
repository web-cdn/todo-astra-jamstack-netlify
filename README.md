# Serverless + DataStax Astra + Apache Cassandra with React Router demo

This is a demo repository set up to a Serverless react based todo application
using a [DataStax Astra](https://astra.datastax.com) free tier database for storage in AWS. 

This project uses the [DataStax NodeJS Cassandra Driver](https://github.com/datastax/nodejs-driver) 
and in [AWS Lambda](https://aws.amazon.com/lambda) with server rendered React components.

## Preparing for demo

Before running the demo, you must install a number of components

  * AWS cli &amp; proper credentials
  * servlerless (`npm install -g serverless`)

Also, create [DataStax Astra](http://astra.datastax.com) Cassandra database (free tier): 
    
  * To keep allow defaults to work name cluster and keyspace `tododemo`
  * Download secure bundle to local astra directory 

## Running in AWS

Deploys Lambda and sets up API Gateway. If custom domain specified, deploys app under this custom domain (first deploy might take some time)

```bash
npm install
PUBLIC_PATH=/dev/ \
ASTRA_USERNAME=todolist \
ASTRA_PASSWORD=****** \
npm run sls:deploy
```

To initialize/clear the Astra C* Database:

 `curl -X POST https://{deployed_endpoint}/api/init`

NOTE: if you specify a different [secure connect bundle](https://docs.datastax.com/en/astra/aws/doc/dscloud/astra/dscloudObtainingCredentials.html) name the path must be /opt/secure-connect-{dbname}.zip for AWS lambda to locate it.

## Running locally

```bash
git clone https://github.com/tjake/todo-react-serverless-astra
cd todo-react-serverless-astra
npm install
npm run build
ASTRA_USERNAME=todolist \
ASTRA_PASSWORD=******** \
ASTRA_SECURE_BUNDLE_ZIP=./astra/secure-connect-todolist.zip \
npm start
```

To initialize/clear the Astra C* Database:
 
 `curl -X POST https://localhost:3000/api/init`

NOTE: The (secure connect bundle)[https://docs.datastax.com/en/astra/aws/doc/dscloud/astra/dscloudObtainingCredentials.html] must be specified to the local astra directory location when running locally.

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
 - The Astra demo was modified from https://github.com/huksley/todo-react-ssr-serverless
 - There are 3 webpack configs:
   - One for server
   - Another for client
   - Third one (./webpack.serverless.js) for running in serverless
 - The server starts with empty data. Run `curl -X POST http://localhost:3000/api/init` to load initial data.
 - The Cassandra lambda calls are located in [server.js](./server.js)