pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''npm install
npm build'''
      }
    }
    stage('') {
      steps {
        parallel(
          "Unit Test": {
            sleep 10
            
          },
          "Canary": {
            sleep 8
            
          }
        )
      }
    }
  }
}