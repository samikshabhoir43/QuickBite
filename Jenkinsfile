
pipeline {
    agent {
        label 'spring'
    }

    environment {
        DOCKER_IMAGE = 'samikshabhoir43/quickbite'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        NAMESPACE = 'quickbite'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" |
                          docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/quickbite.yaml

                    kubectl set image deployment/quickbite \
                      quickbite=${DOCKER_IMAGE}:${BUILD_NUMBER} \
                      -n ${NAMESPACE}

                    kubectl rollout status deployment/quickbite \
                      -n ${NAMESPACE} --timeout=180s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get pods -n ${NAMESPACE}
                    kubectl get svc -n ${NAMESPACE}
                '''
            }
        }
    }
}

