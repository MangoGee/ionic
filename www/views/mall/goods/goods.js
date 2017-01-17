'use strict';

angular.module('Goods',[])
  .filter(
    'to_trusted', ['$sce', function ($sce) {
      return function (text) {
        return $sce.trustAsHtml(text);
      }
    }]
  )

  .filter(
    'toPercentage', function () {
      return function (input) {
        input = parseInt(input*100);
        input = input + "%";
        return input;
      }
    }
  )

  .directive('itemHeight', function () {
    return {
      restrict: 'C',
      template: function (tEle, tAttr) {
        var oEle = tEle[0];
        var height = document.body.clientWidth * 0.25;
        oEle.style.height  = height;
      }
    }
  })

  .controller('GoodsCtrl', function($state, $rootScope, $scope, $ionicModal, $timeout, $ionicPopup, $ionicLoading, $stateParams, $ionicSideMenuDelegate, HttpFactory, Constant) {
    var start = 0;
    var cid = 0;
    var isFistLoad = true;
    var moreCaneBeLoad = true;
    var isBigImgMode = false;

    var mainClassId = parseInt($stateParams.mainClassId);

    $scope.$on('$ionicView.enter', function(scopes, states) {
      console.log("加载数据。。。");
      $scope.goodClassNames = [{'name':'全部'}, {'name':'服装'}, {'name':'母婴'}, {'name':'化妆品'}, {'name':'居家'}, {'name':'鞋包配饰'}, {'name':'美食'}, {'name':'文体车品'}, {'name':'数码家电'}];
      $scope.selectedGC = 0;
      $scope.searchStr = '';
      $scope.rankTop = {
        mgGoodsTop : '',
        lowprofitsTop : '',
        popularityTop : ''
      };

      $scope.formData = {
        'classid' : 0,
        'lowestPrice' : '',
        'highestPrice' : '',
        'lowestCouPrice' : '',
        'highestCouPrice' : ''
      };
      $scope.loadData();
    });

    $scope.showData = function (classid) {
      $scope.selectedGC = parseInt(classid);
      $scope.formData.classid = $scope.selectedGC;
      cid = parseInt(classid);
      $scope.goods = null;
      start = 0;
      moreCaneBeLoad = true;
      $scope.loadData();
    }

    $scope.loadData = function (append) {
      if (cid==0) {
        cid = 'all';
      }

      var currentExeid = 'find_dtkgoods';
      if (mainClassId==2) {
        currentExeid = 'find_lowprofitsgoods'
      } else if (mainClassId==3) {
        currentExeid = 'find_hottestgoods'
      } else if (mainClassId==4) {
        currentExeid = 'find_populargoods'
      } else if (mainClassId==5) {
        $scope.rankTop.lowpricegoods = 1;
      } else if (mainClassId==6) {
        $scope.rankTop.oneyuangoods = 1;
      }

      getData(append,currentExeid);

    };

    var getData = function (append,currentExeid) {
      var searchStr = $scope.searchStr;
      HttpFactory.send({
        url : ,
        data : {},
        method : 'post',
        mask : true,
        notEncrypt : true,
        success : function (response) {
          console.log(response);

          var popupTemplate = '';
          var popupTitle = '';
          if (response.results==0 ) {
            $scope.dealReset();
            popupTemplate = '<p style="text-align: center;">未找到相关商品>_<|||</p>';
            popupTitle = 'Sorry~';
            popupMessages(popupTemplate, popupTitle);
          } else if (append&&response.rows && response.rows.length==0) {
            popupTemplate = '<p style="text-align: center;">相关商品已经展示完毕( ^___^ )y</p>';
            popupTitle = '没有更多的商品啦！';
            popupMessages(popupTemplate, popupTitle);
          }

          if (response.rows && response.rows.length > 0) {
            for (var i=0; i<response.rows.length; i++) {
              var row = response.rows[i];
              var content = Tools.removeHtml(row.shorttitle);
              content=content.replace(/\ +/g,"");//去掉空格
              content=content.replace(/[ ]/g,"");    //去掉空格
              content=content.replace(/[\r\n]/g,"");//去掉回车换行


              row.shorttitle = content;
              row.effecttime = new Date(row.effecttime).Format("yyyy-MM-dd");

              if(append){
                $scope.goods.push(row);
              }
            }

            if(!append){
              $scope.goods = response.rows;
            }

          } else {//如果没有下一页，就返回之前的页数
            start -= Constant.PageSize;
            moreCaneBeLoad = false;
          }

          $scope.$broadcast("scroll.refreshComplete");
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      });
    }

    $scope.doRefresh = function () {
      start = 0;
      moreCaneBeLoad =true;
      $scope.loadData();
    };

    $scope.moreDataCanBeLoaded = function () {
      return moreCaneBeLoad;
    };

    $scope.load_more = function () {
      if(isFistLoad){//第一次加载执行下一页查询，这是个小bug
        $scope.$broadcast("scroll.infiniteScrollComplete");
        isFistLoad = false;
        return;
      }
      start = start + Constant.PageSize;
      $scope.loadData(true);
    };

    $scope.onSearch = function (searchStr) {
      $scope.searchStr = searchStr;
      $scope.loadData();
    };

    $scope.toggleRightSideMenu = function () {
      var isOpen = !$ionicSideMenuDelegate.isOpenRight();
      $ionicSideMenuDelegate.toggleRight(isOpen);
    };

    $scope.getMode = function () {
      return isBigImgMode;
    };

    $scope.setMode = function () {
      isBigImgMode = !isBigImgMode;
    };

    $scope.indicatorOption = {
      radius : 50,
      percentage :true,
      barColor : "#87CEEB"
    };

    $scope.indicatorValue = 70;

    //侧边栏modal-----开始
    $ionicModal.fromTemplateUrl("views/mall/goods/filterbar.html", {
      scope: $scope,
      animation: "slide-in-right"
    }).then(function(modal) {
      $scope.rightSideBar = modal;
    });

    $scope.openRSBModal = function() {
      $scope.rightSideBar.show();
    };

    $scope.closeRSBModal = function() {
      console.log($scope.formData);
      $scope.rightSideBar.hide();
    };

    $scope.dealReset = function () {
      $scope.formData = {
        'classid' : 0,
        'lowestPrice' : '',
        'highestPrice' : '',
        'lowestCouPrice' : '',
        'highestCouPrice' : ''
      };
    };

    $scope.dealFilter = function () {

      if (!$scope.formData.lowestPrice && $scope.formData.highestPrice) {
        $scope.formData.lowestPrice = 0;
      }

      if (!$scope.formData.lowestCouPrice && $scope.formData.highestCouPrice) {
        $scope.formData.lowestCouPrice = 0;
      }

      if (!$scope.formData.highestPrice) {
        $scope.formData.highestPrice = '';
      }

      if (!$scope.formData.highestCouPrice) {
        $scope.formData.highestCouPrice = '';
      }

      if ($scope.formData.highestPrice && ($scope.formData.lowestPrice > $scope.formData.highestPrice)) {
        var tempPrice = $scope.formData.lowestPrice;
        $scope.formData.lowestPrice = $scope.formData.highestPrice;
        $scope.formData.highestPrice = tempPrice;
      }

      if ($scope.formData.highestCouPrice && ($scope.formData.lowestCouPrice > $scope.formData.highestCouPrice)) {
        var tempPrice = $scope.formData.lowestCouPrice;
        $scope.formData.lowestCouPrice = $scope.formData.highestCouPrice;
        $scope.formData.highestCouPrice = tempPrice;
      }

      cid = parseInt($scope.formData.classid);
      $scope.selectedGC = cid;
      $scope.loadData();
      $scope.closeRSBModal();
    };
    //侧边栏modal-----结束

    $scope.$on('$destroy', function() {
      $scope.rightSideBar.remove();
    });

    //未找到结果弹窗-----开始
    var popupMessages = function(popupTemplate, popupTitle) {
      var myPopup = $ionicPopup.show({
        template: popupTemplate,
        title: popupTitle
      });
      $timeout(function() {
        myPopup.close();
      }, 1200);
    };
    //未找到结果弹窗-----结束

    $scope.toDetail = function (goods){
      $state.go('tab.detail',{goods: angular.toJson(goods)});
    }

    $ionicLoading.show({
        content: '',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $timeout(function () {
        $ionicLoading.hide();
    }, 2000);

  })
