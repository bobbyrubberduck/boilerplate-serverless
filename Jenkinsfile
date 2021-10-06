#!groovy
@Library('instamotion-shared-libraries') _

pipeline {
  agent {
    label 'nodejs'
  }

  options {
    ansiColor('xterm')
    buildDiscarder(
      logRotator(
        daysToKeepStr: '14',
        numToKeepStr: '7',
        artifactDaysToKeepStr: '14',
        artifactNumToKeepStr: '3'
      )
    )
    timeout(time: 10, unit: 'MINUTES')
  }

  environment {
    AWS_SDK_LOAD_CONFIG = 1
  }

  stages {
    stage('Install deps') {
      steps {
        sh "npm i"
        sh "wget -O aws-env https://github.com/Droplr/aws-env/raw/master/bin/aws-env-linux-amd64 && chmod +x aws-env"
        sh "mkdir ~/.aws"
        sh "touch ~/.aws/config"
        sh "echo [default] >> ~/.aws/config"
        sh "echo 'region = eu-central-1' >> ~/.aws/config"
        sh "echo 'output = json' >> ~/.aws/config"
      }
    }

    stage('Test') {
      steps {
        sh "touch ~/.aws/credentials"
        sh "echo [default] >> ~/.aws/credentials"
        sh "echo 'aws_access_key_id = root' >> ~/.aws/credentials"
        sh "echo 'aws_secret_access_key = root' >> ~/.aws/credentials"
        sh "npm run test"
        sh "rm ~/.aws/credentials"
      }
    }

    stage('Lint') {
      steps {
        sh "npm run lint"
        sh "npm run pretty"
      }
    }

    stage('Deploy to Dev') {
      steps {
        sh "./bin/deploy.sh dev"
      }
    }


    stage('Deploy to Prod') {
      when { branch 'master' }
      steps {
        sh "./bin/deploy.sh prod"
      }
    }
  }
  post {
    success {
      slackSend(channel: '#team-captain-alerts', color: 'good', message: "Build successfully : ${env.JOB_NAME} [${env.BUILD_NUMBER}] (<${env.RUN_DISPLAY_URL}|Open>) :thumbsup:")
    }
    failure {
      slackSend(channel: '#team-captain-alerts', color: 'danger', message: "Build failed : ${env.JOB_NAME} [${env.BUILD_NUMBER}] (<${env.RUN_DISPLAY_URL}|Open>) :man-shrugging::shrug:")
    }
  }
}
