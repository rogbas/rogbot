pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''npm install
npm build'''
      }
    }
    stage('error') {
      steps {
        parallel(
          "unit test": {
            timestamps() {
              sleep 10
            }
            
            
          },
          "canary": {
            timestamps()
            sleep 20
            
          }
        )
      }
    }
  }
}