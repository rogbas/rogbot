pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''npm install
npm build'''
      }
    }
    stage('unit test') {
      steps {
        timestamps()
        sleep 20
      }
    }
  }
}