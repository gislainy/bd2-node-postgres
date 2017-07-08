angular.module('bd2Companhia', [])
  .controller('companhiaController', ($scope, $http) => {
    $scope.tabActive = 'funcionario';
    $scope.ativarTab = function (tab) {
      if ($scope.tabActive != tab)
        $scope.tabActive = tab;
    }
    // Get funcionário all todos
    $scope.funcionario = [];
    $http({
      method: 'GET',
      url: '/api/v1/funcionario/all'
    }).then(function successCallback(response) {
      $scope.funcionario = response && response.data;
    }, function errorCallback(response) {
      console.log('Error: ' + response);
    });
    $scope.departamento = [];
    $http({
      method: 'GET',
      url: '/api/v1/departamento/all'
    }).then(function successCallback(response) {
      $scope.departamento = response && response.data;
    }, function errorCallback(response) {
      console.log('Error: ' + response);
    });
    $scope.dependente = [];
    $http({
      method: 'GET',
      url: '/api/v1/dependente/all'
    }).then(function successCallback(response) {
      $scope.dependente = response && response.data;
    }, function errorCallback(response) {
      console.log('Error: ' + response);
    });
	$scope.gerentes_departamentos = [];
    $http({
      method: 'GET',
      url: '/api/v1/gerentes_departamentos/all'
    }).then(function successCallback(response) {
      $scope.gerentes_departamentos = response && response.data;
    }, function errorCallback(response) {
      console.log('Error: ' + response);
    });
  });