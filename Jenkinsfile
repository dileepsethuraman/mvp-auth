pipeline {
    agent any

    stages {

        stage ('Build') {

            steps {

                sh 'docker build -t build:1  -f Dockerfile $HOME/devOps/mvp-auth'

            }

        }

        stage ('Test') {

            steps {

                sh 'docker run -it --rm -p 3001:3000 --name tmpaddress build:1 npm test'

            }

        }

    }

}