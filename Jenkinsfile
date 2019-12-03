pipeline {
  agent any
  stages {
    stage('lint') {
      steps {
        sh 'npm run lint'
      }
    }
  }
  stages {
    stage('build') {
      steps {
        sh 'npm run build'
      }
    }
  }
  stages {
    stage('test') {
      steps {
        sh 'npm run test'
      }
    }
  }
}