const SonarQube = require ('sonarqube-scanner');
SonarQube ({
    serverUrl :'http://172.31.11.77:9000',
    options : {
        'sonar.projectName':'examPrepUI',
        'sonar.projectDescription':'Exam Prem frontend',
        'sonar.projectKey':'examPrepHubUI',
        'sonar.projectLanguage':'js',
        'sonar.projectVersion':'1.0.0',
        'sonar.Login':'c139d40aa8084932214e2b7187ea83812c968e54'
    },
});