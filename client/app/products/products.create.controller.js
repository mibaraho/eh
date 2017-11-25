'use strict';

angular.module('ehApp')
  .controller('MerchantProductsCreateCtrl', function ($scope, $state, ProductsService, Auth) {
    $scope.action = 'create';
    $scope.item = {}
    $scope.item.ProductImages = []
    $scope.currentUser = {}
    $scope.example = {}
    $scope.disabled = true;

    Auth.getCurrentUser(function(currentUser){
      $scope.currentUser = currentUser;
      $scope.disabled = false;
    })
    $scope.submit = function(){
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $scope.disabled = true;
        ProductsService.create({ id: $scope.currentUser.MerchantId }, $scope.item, function(result){
          $state.go('merchant-products')
        }, function(err){
          console.log(err)
        })
      }
    }

    $scope.validate = function(){
        $scope.disabled = true;
        ProductsService.validate({}, $scope.item, function(result){
          $scope.validating = false;
        $scope.disabled = false;
          $scope.validation = result
        }, function(err){
          console.log(err)
        })
    }
    var getItems = function(page) {
      $scope.pendingActions = true;
      ProductsService.search({ term : $scope.item.name }).$promise.then(function(result){
        $scope.search = result;
      }, function(err){

        $scope.error = true;
        $scope.pendingActions = false;

      });
    }
    $scope.examples = [{
          code: 1,
          name: "Sapatos Vlancos",
          model: "Chic",
          brand: "Bamers",
          price: 9990,
          stock: 18,
          description: "Ermosos sapatos vlancos que realmente van a hacerte deslumbrar esta temporada. ¡Úsalos!",
          ProductImages: [{
            name: "Zapatos",
            url: "https://www.casadelasbatas.com/media/catalog/product/cache/4/image/9df78eab33525d08d6e5fb8d27136e95/z/a/zapatos_blancos_laboral_isacco.jpg"
          }]
        }, {
          code: 2,
          name: "Computador de Escritorio",
          model: "XPS-1000",
          brand: "Dell",
          price: 499990,
          stock: 180,
          description: "Hermoso televisor pantalla plana que te permite ver todos los partidos de la temporada. Ideal para celebrar fiestas y subir el volumen",
          ProductImages: [{
            name: "Computador",
            url: "https://http2.mlstatic.com/computador-moderno-memoria-4giga-320gb-wifi-lcd17-1-ano-gtia-D_NQ_NP_20216-MCO20186894286_102014-O.jpg"
          }]
        }, {
          code: 3,
          name: "Zapatillas Deportivas Nike",
          model: "Runner",
          brand: "Nike",
          price: 59990,
          stock: 180,
          description: "Increibles zapatillas para trotar, correr y hacer deportes en general. Con estas zapatillas puedes enfrentar cualquier tipo de desafío deportivo, asegurando tu tranquilidad. Estas zapatillas son realmente buenas",
          ProductImages: [{
            name: "Zapatilla Deportiva",
            url: "https://www.runnea.com/archivos/201601/runnea-rebajas-invierno-2016-vomero10-840x485x80.jpg?0"
          }]
        }

    ]

    $scope.exampleChanged = function(){
      console.log($scope.example)
      $scope.item = _.find($scope.examples, function(item){ return item.code == $scope.example.code })
    }

  });
