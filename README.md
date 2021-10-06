# assignment

This repository is used as an example serverless project.

## Technologies

- **serverless framework**: for managing deployment
- **npm**: for dependencies
- **typescript**: for languages and its static type
- **jest**: for test framework
- **localstack**: for test environment

## How to install?

Create a new repository on github with a chosen name.

Clone this repo

```shell
shell> git clone git@github.com:Instamotion/assignment.git <im-project-name>
```

inside the folder run the following command and use the name of the repository as project name.

```shell
shell> npm run init:project
```

push the code in your new repository

```shell
shell> git push origin HEAD
```

done.

## How to test on localstack?

Official docs [here](https://github.com/localstack/localstack)

Spin up localstack

```shell
shell> npm run localstack
```

for debug

```shell
shell> npm run localstack:debug
```

Localstack dashboard, where you can check created resources.

```shell
shell> open http://localhost:8080
```

Check if services are running

```shell
shell> http://localstack:8080/health?reload
```

Deploy stack on localstack

```shell
shell> npm run deploy:local
```

Install `aws` CLI if you do not have it yet. It is also recommended to install `awslocal` for easy execution of commands locally.

Run step functions:

```shell
shell> aws --endpoint='http://localhost:4585' stepfunctions start-execution \
--state-machine-arn=arn:aws:states:us-east-1:000000000000:stateMachine:ChainMachine \
--input="{\"name\":\"Pippo\"}"
```

 or

```shell
shell> awslocal stepfunctions start-execution \
 --state-machine-arn=arn:aws:states:us-east-1:000000000000:stateMachine:ChainMachine \
 --input="{\"name\":\"Pippo\"}"
```

Output of the step functions is stored on

```shell
http://localhost:4572/[project-name]-local-task/task.txt
```

Api gateway url is visible in the console after successful deployment and it looks like this:

```shell
http://localhost:4567/restapis/[serverless-id]/local/_user_request_/[lambda-function-name]
```

### Limitation

- Localstack doesn't support `api gateway` for step functions, which means you need to use aws cli to start the execution.
- `us-east-1` is the default region and cannot be changed for testing
- `000000000000` is the default account id and cannot be changed for testing
- api key is not supported

## Good to know

- In order to access resources such as `sqs`, `s3` on localstack, requires you to use the local docker ip address available as env variable `LOCALSTACK_HOSTNAME`. See example in `src/functions/store/index.ts`.

- The env variable `SERVICES` inside the `bin/start-localstack` file contains the name of the services that will run on localstack. Service name follows the name convention of `aws cli`.

- Localstack can run scripts as soon as all resources have been created. This is useful for creating resources that are required to exist on aws. Folder `bin/docker-entrypoint-initaws.d` already contains some of them. They are executed in the alphabetic order.

- Environment variables are managed via `.env.[local|dev|prod].yaml` files for not critical and `ssm` for api keys and secrets.
In case you `add|replace|adjust` the ssm vars in serverless, adjust `./bin/docker-entrypoint-initaws.d/10-aws-resources.sh` in order to create the necessary resources on localstack.

## Development

The project comes with several tools to keep code quality and consistency of commit messages.

### Commit message

On installation time a git prepare commit hook message is installed. It will
prefix the commit with branch type and ticket number to simplify the process.
What you need to do is just create the branch like below:

**Branch Name**: [TICKET-TYPE]/[TICKET-ID]-random-text
Ex. feature/CAT-123-random-text

**Supported ticket type**: feature|bugfix|chore|next

If you followed the branch name you just need to do:

```shell
shell> git commit -m 'Add new fancy feature'
```

the result will be

```shell
F [CAT-123] Add new fancy feature
```

### Code quality

Pre-commit and pre-push hooks are added to avoid of pushing not nice or broken code:

- On git commit `npm run lint:fix` and `npm run pretty:fix` will run.
- On git push `npm run test`.

### Deployment process

The project has a pipeline setup, that works in the following way:

- Every branch pushed in the remote repository will be deployed to the dev environment.
- Every time a branch is merged on master, it will be deployed to the dev and prod.
- In both cases the pipeline will run from the beginning.

## Updating modules in this repository

Some of those updates are major releases. Running npm update won't update the version of those. Major releases are never updated in this way because they (by definition) introduce breaking changes, and npm wants to save you trouble.

To update all packages to a new major version, install the `npm-check-updates` package globally:

```shell
shell> npm install -g npm-check-updates
```

then run it:

```shell
shell> ncu -u
```

this will upgrade all the version hints in the `package.json` file, to `dependencies` and `devDependencies`, so npm can install the new major version.

You are now ready to run the update:

```shell
shell> npm update
```

If you just downloaded the project without the `node_modules` dependencies and you want to install the shiny new versions first, just run

```shell
shell> npm install
```
