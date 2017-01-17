'use strict';

angular.module('Detail',[])
.filter(
  'to_trusted', ['$sce', function ($sce) {
      return function (text) {
        return $sce.trustAsHtml(text);
      }
  }]
)

.controller('DetailCtrl', function($state, $stateParams, $rootScope, $scope, $ionicModal, $ionicHistory, $http, CacheFactory, HttpFactory, Constant, ToShare) {

  $scope.$on('$ionicView.enter', function(scopes, states) {
    console.log("加载秒杀详情数据");
    //console.log($stateParams.goods);
    $scope.selectData = angular.fromJson($stateParams.goods);
    $scope.selectData.effecttime = new Date($scope.selectData.effecttime).Format("yyyy-MM-dd");
    $scope.shareType = [{'id': 1,'itemName' : '微信', 'itemImg' : 'img/shareicon/wechat.png'}, {'id': 2,'itemName' : '朋友圈', 'itemImg' : 'img/shareicon/moments.png'}, {'id': 3,'itemName' : 'QQ', 'itemImg' : 'img/shareicon/QQ.png'}, {'id': 4,'itemName' : 'QQ空间', 'itemImg' : 'img/shareicon/QZONE.png'}, {'id': 5,'itemName' : '微博', 'itemImg' : 'img/shareicon/weibo.png'}];
  });

  $scope.toTargetUrl = function (activityId, itemId) {
        var url;
        checkAppAvailability(url,urlSchemes);
  };

  var checkAppAvailability = function (url,urlSchemes) {
    var uriScheme = null;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      uriScheme = 'taobao://';
    } else if (navigator.userAgent.match(/android/i)) {
      uriScheme = 'com.taobao.taobao';
    }

    appAvailability.check(
      uriScheme, //URI-Schemes or Package-Name
      function() {           // Success callback
        window.open('taobao'+urlSchemes,'_system');
      },
      function() {           // Error callback
        window.open(url,'_system');
      }
    );
  };

  //分享功能——开始
  $ionicModal.fromTemplateUrl("views/mall/goods/sharebar.html", {
    scope: $scope,
    animation: "slide-in-up"
  }).then(function(modal) {
    $scope.shareBar = modal;
  });

  $scope.openShareBarModal = function() {
    $scope.shareBar.show();
  };

  $scope.closeShareBarModal = function() {
    $scope.shareBar.hide();
  };

  var dealShare = function (shareAppid, url) {
    ToShare.showShare(shareAppid,url, $scope.selectData);
  };

  $scope.toShare = function (shareAppid) {
    var url;
    dealShare(shareAppid,url);
  };
  $scope.$on('$destroy', function() {
    $scope.shareBar.remove();
  });
  //分享功能——结束
})
