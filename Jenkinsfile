pipeline {
    agent any
    options {
            buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '4', daysToKeepStr: '', numToKeepStr: '4')
        }
    environment {
        EMAIL_TO = 'vijayprapth56@gmail.com'
        HOME = '.'
    }
    stages {
        stage('Pipeline Started') {
            steps{
                emailext body: '''JOB HAS BEEN STARTED: job '${JOB_NAME} #${BUILD_NUMBER}' ''',
                to: "${EMAIL_TO}",
                subject: "STARTED: Job '${JOB_NAME} #${BUILD_NUMBER}'"
            }
        }
        stage('echo') {
            steps{
                sh 'npm -version'
            }
        }
        stage('Build Package') {
            steps{
                sh 'npm install'
                sh 'npm run build'
            }
        }
        // stage('Execute sonar report') {
        //     steps{
        //         withSonarQubeEnv('sonarqube') {
        //             sh 'npm run sonar'
        //         }
        //     }
        // }
        // stage('Code Quality Check') {
        //     steps{
        //         timeout(time: 1,unit: 'HOURS') {
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }
        stage('push artifact on local registry') {
            steps {
                sh 'npm publish --registry=http://172.31.11.77:8081/repository/nodejs-registry/'
            }
        }
        stage('build image and tag') {
            steps{
                sh 'docker build -f build/Dockerfile-prod -t ${JOB_NAME}:v1.${BUILD_NUMBER} .'
                sh 'docker tag ${JOB_NAME}:v1.${BUILD_NUMBER} 172.31.11.77:8085/${JOB_NAME}:v1.${BUILD_NUMBER}'
                sh 'docker tag ${JOB_NAME}:v1.${BUILD_NUMBER} 172.31.11.77:8085/${JOB_NAME}:latest'
            }
        }
        stage('push image on local registry') {
                steps{
                    withCredentials([string(credentialsId: 'nexus-examprep', variable: 'Nexus_REG')]) {
                            sh 'docker login -u admin -p ${Nexus_REG} 172.31.11.77:8085'
                            sh 'docker push 172.31.11.77:8085/${JOB_NAME}:v1.${BUILD_NUMBER}'
                            sh 'docker push 172.31.11.77:8085/${JOB_NAME}:latest'
                            sh 'docker rmi -f ${JOB_NAME}:v1.${BUILD_NUMBER} 172.31.11.77:8085/${JOB_NAME}:v1.${BUILD_NUMBER} 172.31.11.77:8085/${JOB_NAME}:latest '
                    }
                }
            }
        stage('deploy') {
            steps{
                ansiblePlaybook become: true, credentialsId: 'aws-pro-srv', disableHostKeyChecking: true, installation: 'ansible', inventory: './deploy-ui-live/inventory.txt', playbook: './deploy-ui-live/deploy-ui.yml'
            }
        }
    }
    post {
        success {
            emailext body : '''BUILD IS SUCCESSFULL''',
            to: "${EMAIL_TO}",
            subject: "BUILD SUCCESS : job '${JOB_NAME} #${BUILD_NUMBER}'"
        }
        failure {
             emailext attachLog: true, compressLog: true, body: 'Check console output at $BUILD_URL to view the results.', //\n\n  ${CHANGES} \n\n -------------------------------- \n${compressLog: true}',
             to: "${EMAIL_TO}",
             subject: 'Build failed in Jenkins: $PROJECT_NAME - #$BUILD_NUMBER'
            //emailext attachLog: true, body: 'Check console output at $BUILD_URL to view the results.', compressLog: true, subject: 'Build failed in Jenkins: $PROJECT_NAME - #$BUILD_NUMBER', to: 'nikhilve99@gmail.com'
        }
    }
}
