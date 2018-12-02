pipeline {
    agent any
    stages {
        stage ('Test Pre-requisites') {
            options {
                timeout(time: 2, unit: 'MINUTES')
            }
            steps {
                sh '''
                    docker rmi build:1
                    docker run --rm -p 27017:27017 --name mongodb -d  mongo
                '''
                sleep 5
                nodejs(nodeJSInstallationName: 'jenkins-node') {
                    sh 'node /home/srishti/devOps/mvp-auth/scripts/createEntries.js'
                }
            }
        }
        stage ('Build') {
            options {
                timeout(time: 2, unit: 'MINUTES')
            }
            steps {
                sh 'docker build -t build:1 -f /home/srishti/devOps/mvp-auth/Dockerfile /home/srishti/devOps/mvp-auth/.'
            }
        }
        stage('Run tests') {
            options {
                timeout(time: 2, unit: 'MINUTES')
            }
            agent { 
                docker {
                    image 'build:1'
                    args '-v /home/srishti/devOps/mvp-auth:/home/mvp-auth -w /home/mvp-auth --name buildtest'
                }
            } 
            steps {
                sh '''
                cd /home/mvp-auth
                npm test
                '''
            }
        }
        stage ('Clean-up after test') {
            options {
                timeout(time: 2, unit: 'MINUTES')
            }
            steps {
                sh '''
                    docker stop mongodb
                    '''
            }
        }
    }
}