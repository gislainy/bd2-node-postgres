angular.module('bd2Companhia', [])
  .controller('companhiaController', ($scope, $http) => {
    $scope.tabActive = 'funcionario';
    $scope.alerta = {
      mensagem: '',
      tipo: 'success',
      mostrar: false
    };
    $scope.dados = {
      departamento: {}
    };
    $scope.ativarTab = function (tab) {
      if ($scope.tabActive != tab)
        $scope.tabActive = tab;
    };
    $scope.mostrarAlerta = (mensagem, danger) => {
      $scope.alerta.mostrar = true;
      $scope.alerta.mensagem = mensagem;
      if (danger)
        $scope.alerta.tipo = 'danger';
      else $scope.alerta.tipo = 'sucess';
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
      var ultimo = $scope.gerentes_departamentos[$scope.gerentes_departamentos.length - 1] || {};
      $scope.dados.departamento.dnumero = ultimo && ultimo.dnumero + 1;
    }, function errorCallback(response) {
      console.log('Error: ' + response);
    });
    $scope.departamento_adicionar = function () {
      var dep_dados = $scope.dados.departamento;
      if (dep_dados && dep_dados.dnome && dep_dados.dnumero && dep_dados.ger_cpf)
        $http({
          url: '/api/v1/gerentes_departamentos/new',
          method: "POST",
          data: { 'departamento': dep_dados }
        })
          .then(function (response) {
            $scope.gerentes_departamentos = response && response.data;
            $scope.tabActive = 'gerentes_departamentos';
            $scope.dados.departamento = {};
            $scope.mostrarAlerta('Departamento cadastrado com sucesso');

          },
          function (response) { // optional
            console.dir({ response })
          });
      else {
        $scope.mostrarAlerta('Por favor, preencha todos os dados do departamento', true);
      }
    };
    $scope.departamento_editar = (departamentoId) => {
      $scope.dados.departamento = $scope.gerentes_departamentos.filter((dep) =>
        dep.dnome === departamentoId
      )[0];
      $scope.tabActive = 'gerentes_departamentos_form';
    }
  });