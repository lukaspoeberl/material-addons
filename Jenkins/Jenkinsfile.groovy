pipeline {

    agent {
        docker {
            image 'docker.porscheinformatik.com/eenv/builders/default'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v /srv/jenkins/.docker:/home/jenkins/.docker'
            alwaysPull true
        }
    }

    options {
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    environment {
        CARFIN_NPM_TOKEN = credentials('CARFIN_NPM_TOKEN')
    }

    stages {
        stage('Install Deps') {
            steps {
                sh 'npm install'
            }
        }
        stage('Publish') {
            steps {
                ansiColor('xterm') {
                    sh """
                    npm run build:mat-add
                    npm publish ./dist/material-addons
                """
                }
            }
        }

    }
}
