<img src="./app/images/color_logo_transparent.png" alt="AppScore banner" align="center" width="400px"/>
<br />

[![pipeline status](https://gitlab.com/FutureProof/AppScoreAPI/badges/master/pipeline.svg)](https://gitlab.com/FutureProof/AppScoreUI/commits/master)

[![coverage report](https://gitlab.com/FutureProof/AppScoreAPI/badges/master/coverage.svg)](https://gitlab.com/FutureProof/AppScoreUI/commits/master)

<br />

## Running the project locally

### Running the app without Docker
If you want to run the application without Docker then you need to create a .env file in the project root directory and set up the following values:
```
PORT=3090
TEST_PORT=3091
JWT_TOKEN_SECRET=9mU8&qT5hzZ2rDC3x*1wnV6oW
DB=mongodb://localhost:27017/appscore
DEFAULT_CLIENT_NAME=FutureProof
ADMIN_PWD=Appscore1
LOG_LEVEL=debug
ENGINE_API_TOKEN=U^$%&*$%H^*tr795
ENGINE_PROCESS_TIMEOUT_MINUTES=2
```
**_N.B. Check the docker-compose files to see if any additional environment settings have been added since this README was last updated._**

### Setting up the environment
1. Create a directory to hold the MongoDD used by the app
    ```
    mkdir C://data
    ```
2. Install Docker Community Editition (CE) for your environment from the Docker from the Docker store `https://store.docker.com/search?type=edition&offering=community`
3. Once installed open a command line editor and create a network (to enable the UI and API project to communicate):
    ```
    docker network create appscore
    ```

### Setting up the code
1. Set up an SSH connection to the repository, a guide can be located here: `https://docs.gitlab.com/ee/ssh/`
2. Clone this repo using `git clone git@gitlab.com:FutureProof/AppScoreAPI.git`
2. Move to the appropriate directory: `cd aapscoreapi`.<br />

## Building the docker image
1. Build the docker image:
    ```
    npm run docker:build
    ```

## Run the docker container
There's an extra docker-compose-dev.yml file for local development. This uses the docker network set-up in the section `## Setting up the environment` and also provides the environment variables required

1. In order to access the db and api then you'll need to ensure that you've installed and setup the appscoreapi project from `https://gitlab.com/FutureProof/AppScoreAPI`
2. Run the docker conatiner:
    ```
    npm run docker:up
    ```
3. The web site is now accessible from `http://localhost:3000`

## Deploy Docker image to AWS repository
1. Log into AWS and navigate to ECS Repositories `https://eu-west-1.console.aws.amazon.com/ecs/home?region=eu-west-1#/repositories`
2. Copy the Repositroy URI of the appscore-ui repostitory
3. Open a terminal
4. Tag the docker image:
    ```
    docker tag appscore-api <repository-uri>:latest
    ```
5. Log into the AWS console from the terminal:
    ```
    aws ecr get-login --no-include-email
    ```
6. Copy the value returned from the above command into the terminal prompt and execure it to log in
7. Push the image to the repository:
    ```
    docker push <repository-uri>:latest
    ```
8. If there are environment variables that need to be added or updated go to the [Update Task Definition section](#update-task-definition)
9. Restart the service (see the [Restart Service](#restart-service) section)

## Update Task Definition
If there are new environment variables or some of the values need changing then use the following steps to update the AWS Service
1. Log into AWS and navigate to ECS Task Definitions `https://eu-west-1.console.aws.amazon.com/ecs/home?region=eu-west-1#/taskDefinitions`
2. Select the Task Definision to be updated
3. Tick the box next to the latest version and press _Create New Revision_
4. Scroll down to the _Containers_ section
5. Select the container you wish to update
6. Change the relevant values and click _Update_
7. Repeat steps **6** and **7** until all the relevant changes have been made
8. Click _Create_ to create the new version of the taks definition

## Restart Service
You need to restart the AWS aervice to restart the Docker container which will use the new image and also any envrionment variables changed in the [Update Task Definition section](#update-task-definition)

**_N.B. If the ui is being deployed as well then it's best to deploy the Docker image for the UI repository before restarting the service - otherwise you'll end up restarting it twice!._**
1. Log into AWS and navigate to ECS Clusters `https://eu-west-1.console.aws.amazon.com/ecs/home?region=eu-west-1#/clusters/appscore-test/services`
2. Select the cluster to be updated
3. Select the service from the list
4. Click the **Update** button
5. Ensure the _Revision_ is set to the correct value
6. Ensure the _Platform_ Version is set to the correct value
7. Ensure the **Force New Deployment** checkbox is ticked (this is only needed if only the docker image has been updated)
8. Check the remaining values are correct
9. Click _Next Steps_
10. Check the values are correct
11. Click _Next Steps_
12. Check the values are correct
13. Click _Next Steps_
12. Check the values are correct
13. Click _Update Service_
