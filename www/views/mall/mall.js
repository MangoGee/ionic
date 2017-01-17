'use strict';

angular.module('Mall',[])
.filter(
  'to_trusted', ['$sce', function ($sce) {
      return function (text) {
          return $sce.trustAsHtml(text);
      }
  }]
)

.controller('MallCtrl', function($state, $rootScope, $scope, $location, $ionicModal, $timeout, $ionicLoading, $ionicViewSwitcher, $ionicActionSheet, CacheFactory, HttpFactory, Constant, ToShare) {

  var start = 0;
  var isFistLoad = true;
  var moreCanBeLoad = false;

  $scope.$on('$ionicView.enter', function(scopes, states) {
    $rootScope.hideTabs = false;
    console.log("加载数据。。。");
    $scope.loadData();
  });

  $scope.loadData = function () {

  };

  $scope.toGoods = function (mainClassId) {
      $state.go('tab.goods',{mainClassId: mainClassId});
      $ionicViewSwitcher.nextDirection("forward");
  };

  $scope.toDetail = function (goods){
    $state.go('tab.detail',{goods: angular.toJson(goods)});
  }

  $ionicLoading.show({
      content: '加载中。。。',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
  });

  $timeout(function () {
      $ionicLoading.hide();
  }, 2000);

  //分享功能——开始
  $scope.showShare = function () {
    var url;
    ToShare.showShare(url, $scope.selectData);
  }
  //分享功能——结束

})
