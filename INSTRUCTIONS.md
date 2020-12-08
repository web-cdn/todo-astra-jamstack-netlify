<!--- Enter the repository name --->
# Running JAMStack + Netlify + Astra + Cassandra 
Follow the instructions below to get started.

<!--- 
Modify this section as needed, however always include the Astra setup parts
--->
## Prerequisites
Let's do some initial setup.

### DataStax Astra
<!--- enter a unique UTM_CODE for your sample app below --->
1. Create a [DataStax Astra account](https://astra.datastax.com/register?utm_source=github&utm_medium=referral&utm_campaign=todo-astra-jamstack-netlify) if you don't 
already have one:
![image](https://astra-screenshots.s3.amazonaws.com/current/register-basic-auth.png)

2. Create an (always) free-tier Cassandra database (take note of your db password):
![image](https://user-images.githubusercontent.com/69874632/101203026-ef801700-361e-11eb-8321-de2d65259763.png)
![image](https://user-images.githubusercontent.com/69874632/101203076-0292e700-361f-11eb-88ee-1f6356f4d7dc.png)
![image](https://user-images.githubusercontent.com/69874632/101203115-12aac680-361f-11eb-9087-8ff5cb9516d7.png)

3. After your database is provisioned, head to the `Connect` screen and copy your connection 
information (we'll need this later!):
![image](https://user-images.githubusercontent.com/69874632/101202697-797bb000-361e-11eb-8ded-6e9b1d94fcac.png)

### Github
<!-- Enter your GITHUB_URL below -->
1. Click `Use this template` at the top of the [GitHub Repository](https://github.com/DataStax-Examples/todo-astra-jamstack-netlify):
![image](https://raw.githubusercontent.com/DataStax-Examples/sample-app-template/master/screenshots/github-use-template.png)

2. Enter a repository name and click 'Create repository from template':
![image](https://raw.githubusercontent.com/DataStax-Examples/sample-app-template/master/screenshots/github-create-repository.png)

3. Clone the repository:
![image](https://raw.githubusercontent.com/DataStax-Examples/sample-app-template/master/screenshots/github-clone.png)

<!--- 
Include locally as a minimum so that folks will
create an Astra DB and use your repository as a template.

Remove paths that you don't need.
--->
## 🚀 Getting Started Paths:
*Make sure you've completed the [prerequisites](#prerequisites) before starting this step*
  - [Running on your local machine](#running-on-your-local-machine)
  - [Running on Gitpod](#running-on-gitpod)
  - [Deploying to Netlify](#deploying-to-netlify)

<!--- 
Include the appropriate commands to run the app locally (post cloning). If you're using
Docker or something similar, include that setup here.
--->
### Running on your local machine
1. `cd` to the cloned repository, and install Node dependencies: `npm install`.

2. Populate your environment variables into a .env file
```
cp .env-template .env
```

and modify .env to include your database specific values (you can find these in the database detail screen in the Astra UI).

```
ASTRA_DB_ID=REPLACE-ME
ASTRA_DB_REGION=REPLACE-ME
ASTRA_DB_KEYSPACE=REPLACE-ME
ASTRA_DB_PASSWORD=REPLACE-ME
ASTRA_DB_USERNAME=REPLACE-ME
```

3. In the cloned repository, build the app: `npm start`.

4. Open http://localhost:8080 to view your application:
![image](https://user-images.githubusercontent.com/3254549/88739693-fdadac00-d0ef-11ea-9f95-d2ee643b5431.png)

<!--- 
Include Gitpod where possible, it provides a good DX for experimentation 
--->
### Running on Gitpod
<!-- Enter your GITPOD_LINK below -->
1. Click the 'Open in Gitpod' link:
[![Open in IDE](https://gitpod.io/button/open-in-gitpod.svg)](https://dtsx.io/3gtADSq)

2. Wait for your Gitpod workspace to start:
![image](https://user-images.githubusercontent.com/3254549/88744125-5171c280-d0fb-11ea-9676-de4589e42589.png)

3. Set your Astra database details in the Gitpod terminal at the bottom of the screen:
![image](https://user-images.githubusercontent.com/3254549/88744148-64849280-d0fb-11ea-9b20-52d5226a14c6.png)

4. Click the 'Open browser' button in the bottom right of the screen:
![image](https://user-images.githubusercontent.com/3254549/88744346-ebd20600-d0fb-11ea-9853-cf370dfcf143.png)

5. View your application:
6. ![image](https://user-images.githubusercontent.com/3254549/88744380-04422080-d0fc-11ea-93a1-fe40854f428c.png)

### Deploying to Netlify
<!-- Enter your NETLIFY_URL below -->
1. Click the 'Deploy to Netlify' button:
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://dtsx.io/2EtfGty)

2. Connect your GitHub account:
![image](https://user-images.githubusercontent.com/3254549/88744656-d9a49780-d0fc-11ea-97ad-f05aa0ace11e.png)

3. Fill in the Netlify environment variables with information on your Astra database:
![image](https://user-images.githubusercontent.com/3254549/88744704-fb9e1a00-d0fc-11ea-8d92-4182aed4499d.png)

4. Click 'Save and Deploy':
![image](https://user-images.githubusercontent.com/3254549/88744776-2c7e4f00-d0fd-11ea-8530-71e2a85e34a2.png)

5. Wait for your app to deploy (this will take a minute or two, the screen will auto-refresh when the deployment is complete):
![image](https://user-images.githubusercontent.com/3254549/88744798-3bfd9800-d0fd-11ea-8858-281bd0d4ff70.png)

6. Click your Netlify app link to view your live app:
![image](https://user-images.githubusercontent.com/3254549/88744822-4fa8fe80-d0fd-11ea-97dd-9f9611b332dc.png)

7. You've deployed your app to Netlify!
![image](https://user-images.githubusercontent.com/3254549/88744842-62233800-d0fd-11ea-8e20-29aa71027885.png)

### Things to Note:
 - The contents of this repo are based on [Jake's port](https://github.com/tjake/todo-astra-react-serverless/) of the [TodoMVC code](https://github.com/tastejs/todomvc/tree/master/examples/react) originally written by [Pete Hunt](https://github.com/petehunt).
 - The example is modified from https://github.com/huksley/todo-react-ssr-serverless.
