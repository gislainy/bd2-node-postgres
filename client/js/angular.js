angular.module('bd2Companhia', [])
  .controller('companhiaController', ($scope, $http) => {
    $scope.tabActive = 'funcionario';
    $scope.alerta = {
      mensagem: '',
      tipo: 'success',
      mostrar: false
    };
    $scope.dados = {
      departamento: {},
      dependente: {
        data_nasc: new Date()
      },
      funcionario: {}
    };
    $scope.ativarTab = function (tab) {
      if ($scope.tabActive != tab)
        $scope.tabActive = tab;
      $scope.alerta.mostrar = false;
    };
    $scope.mostrarAlerta = (mensagem, danger) => {
      $scope.alerta.mostrar = true;
      $scope.alerta.mensagem = mensagem;
      if (danger)
        $scope.alerta.tipo = 'danger';
      else $scope.alerta.tipo = 'sucess';
    }
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
    $scope.dependente_adicionar = function () {
      var dep_dados = $scope.dados.dependente;
      if (dep_dados && dep_dados.nome && dep_dados.cpf)
        $http({
          url: '/api/v1/dependente/new',
          method: "POST",
          data: { 'dependente': dep_dados }
        })
          .then(function (response) {
            $scope.dependente = response && response.data;
            $scope.tabActive = 'dependente';
            $scope.dados.dependente = {};
            $scope.mostrarAlerta('Dependente cadastrado com sucesso');

          },
          function (response) { // optional
            console.dir({ response })
          });
      else {
        $scope.mostrarAlerta('Por favor, preencha todos os dados do dependente', true);
      }
    };
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
    $scope.clickReajustarPorPecentual = (funcionarioId) => {
      $scope.dados.funcionario = $scope.funcionario.filter((dep) =>
        dep.cpf === funcionarioId
      )[0];
      $scope.dados.funcionario.percentual = 0;
      $scope.tabActive = 'reajustar_por_percentual';
    }
    $scope.reajustar_por_percentual = () => {
      var dep_dados = $scope.dados.funcionario;
      if (dep_dados && dep_dados.percentual)
        $http({
          url: '/api/v1/funcionario/percentual',
          method: "POST",
          data: { 'funcionario': dep_dados }
        })
          .then(function (response) {
            $scope.funcionario = response && response.data;
            $scope.tabActive = 'funcionario';
            $scope.dados.funcionario = {};
            $scope.mostrarAlerta('Percentual alterado com sucesso');

          },
          function (response) { // optional
            console.dir({ response })
          });
      else {
        $scope.mostrarAlerta('Por favor, preencha todos o campos de percentual', true);
      }
    };
    $scope.clickExcluirDepartamento = (departamentoId) => {
      if (departamentoId) {
        var possuiReferencia = $scope.funcionario.some((func) => func.dno === departamentoId);
        if (!possuiReferencia) {
          $http({
            url: '/api/v1/gerentes_departamentos/' + departamentoId,
            method: "delete",
            data: { 'departamentoId': departamentoId }
          })
            .then(function (response) {
              $scope.gerentes_departamentos = response && response.data;
              $scope.tabActive = 'gerentes_departamentos';
              $scope.mostrarAlerta('Departamento excluido com sucesso');

            },
            function (response) { // optional
              console.dir({ response })
            });
        } else $scope.mostrarAlerta('Esse departamento não pode ser excluído pois possui dependência com funcionário', true);
      }
    };
  });