pipeline {
    agent any
    
    options {
        ansiColor('xterm')
        timeout(time: 30, unit: 'MINUTES')
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

                // -------------------------
                // UNIT TESTS (Vitest)
                // -------------------------
                stage('unit tests') {
                    agent {
                        docker {
                            image 'node:22-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx vitest run --reporter=junit --outputFile=test-results.xml'
                    }
                    post {
                        always {
                            junit 'test-results.xml'
                        }
                    }
                }

                // -------------------------
                // PLAYWRIGHT INTEGRATION TESTS
                // (For your local/DEV environment)
                // -------------------------
                // stage('integration test') {
                //     agent {
                //         docker {
                //             image 'mcr.microsoft.com/playwright:v1.54.2-jammy'
                //             reuseNode true
                //         }
                //     }
                //     steps {
                //         sh '''
                //           npm ci
                //           npx playwright test
                //         '''
                //     }
                // }
            }
        }

        // -------------------------
        // MOCK DEPLOY
        // -------------------------
        stage('deploy') {
            agent {
                docker {
                    image 'alpine'
                }
            }
            steps {
                echo 'Mock deployment was successful!'
            }
        }

        // -------------------------
        // FULL END-TO-END TESTING (AGAINST PRODUCED WEBSITE)
        // -------------------------
        stage('e2e') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.54.2-jammy'
                    reuseNode true
                }
            }
            environment {
                E2E_BASE_URL = 'https://valentinos-magic-beans.click/'
            }
            steps {
                sh '''
                  node -v
                  npm -v
                  npm ci
                  npx playwright test
                '''
            }
            post {
                always {
                    // 1) Publish HTML report (compatible with older plugin versions)
                    publishHTML([
                        reportDir: 'reports-e2e/html',
                        reportFiles: 'index.html',
                        reportName: 'Playwright HTML Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        allowMissing: true
                    ])
                    // 2) Publish JUnit (works as-is)
                    junit testResults: 'reports-e2e/junit.xml'
                    // 3) Archive the full report so you can download & open it locally
                    archiveArtifacts artifacts: 'reports-e2e/**', fingerprint: true

            
                }
            }
        }
    }
}