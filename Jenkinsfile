pipeline {
    agent any
    
    options {
        ansiColor('xterm')
    }

    stages {
        stage('build') {
            agent {
                docker {
                    image 'node:22-alpine'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('test') {
            parallel {
                stage('unit tests') {
                    agent {
                        docker {
                            image 'node:22-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        // Unit tests with Vitest
                        sh 'npx vitest run --reporter=verbose'
                    }
                }
                stage('integration test'){
                    agent{
                        docker{
                            image 'mcr.microsoft.com/playwright:v1.54.2-jammy'
                            reuseNode true

                        }
                   } 
                   steps{
                       sh 'npx playwright test'
                   }
                }
            }
        }

        stage('deploy') {
            agent {
                docker {
                    image 'alpine'
                }
            }
            steps {
                // Mock deployment which does nothing
                echo 'Mock deployment was successful!'
            }
        }
        stage('e2e'){
            agent{
                docker{
                   image 'mcr.microsoft.com/playwright:v1.54.2-jammy' 
                   reuseNode true
                }
            }
            environment{
                E2E_BASE_URL ='https://valentinos-magic-beans.click/'
            }
            steps{
                sh 'npx playwright test'
            }
            post{
                always{
                    publishHTML([allowMissing:false,alwaysLinkToLastBuild:true,icon:'',KeepAll:false,reportDir:'reports-e2e/html',reportFile:'index.html',reportName:'Playwright HTML Report',reportTitles:'',useWrapperFileDirectory:true])
                    junit stdioRentention:'All', testResults:'reports-e2e/junit.xml'
                }
            }
        }
    }
}