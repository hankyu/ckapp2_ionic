// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngIOS9UIWebViewPatch', 'starter.controllers', 'ngStorage', 'ngCordova', 'angular.filter', 'ngMaterial', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})
// .constant('ApiEndpoint', {
//   url: 'http://localhost:8100//prog/ding/CK_APP_API'
// })
// For the real endpoint, we'd use this
// .constant('ApiEndpoint', {
//  url: 'http://www.public.tw//prog/ding/CK_APP_API'
// })


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $mdThemingProvider) {
  // $mdThemingProvider.theme('docs-dark')
  //       .primaryPalette('yellow')
  //       .dark()
  //       .foregroundPalette['3'] = 'rgba(255,255,255,1)';
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "templates/main.html",
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.search', {
    url: "/userinfo",
    views: {
      'menuContent': {
        templateUrl: "templates/UserInfo.html",
        controller:'UserInfoCtrl'
      }
    }
  })

  .state('app.identity', {
    url: "/identity",
    views: {
      'menuContent': {
        templateUrl: "templates/Identity.html",
        controller:'IdentityCtrl'
      }
    },
    cache: false
  })
    .state('app.userprofile', {
      url: "/userprofile",
      views: {
        'menuContent': {
          templateUrl: "templates/UserProfile.html",
          controller: 'UserProfileCtrl'
        }
      },
      cache: false
    })
  .state('app.main-newsLists', { //活動快報
    url: "/main/newsLists",
    views: {
      'menuContent': {
        templateUrl: "templates/NewsLists.html",
        controller: 'newsListsCtrl'
      }
    }
  })
  .state('app.main-newsLists-Detail', { //活動快報-內容
    url: "/main/newsLists/:nb",
    views: {
      'menuContent': {
        templateUrl: "templates/NewsDetail.html",
        controller: 'newsCtrl'
      }
    }
  })
  .state('app.main-classLists', { //新班開課
    url: "/main/classLists",
    views: {
      'menuContent': {
        templateUrl: "templates/ClassOpenLists.html",
        controller: 'classListsCtrl'
      }
    }
  })
  .state('app.main-classLists-Detail', { //新班開課-內容
    url: "/main/classLists/:nb",
    views: {
      'menuContent': {
        templateUrl: "templates/ClassOpenDetail.html",
        controller: 'classCtrl'
      }
    }
  })
  .state('app.main-CourseMove', { //課程異動
    url: "/main/courseMove",
    views: {
      'menuContent': {
        templateUrl: "templates/CourseMove.html",
        controller: 'CourseMoveCtrl'
      }
    }
  })
  .state('app.main-Lecture', {
    url: "/main/lecture",
    views: {
      'menuContent': {
        templateUrl: "templates/LectureApp.html",
        controller: 'lectureAppCtrl'
      }
    }
  })
  .state('app.main-classroom', {
    url: "/main/classroom",
    views: {
      'menuContent': {
        templateUrl: "templates/ClassRoom.html",
        controller: 'classRoomCtrl'
      }
    }
  })

  .state('app.main-classroom-Detail', {
    url: "/main/classroom/:rID",
    views: {
      'menuContent': {
        templateUrl: "templates/ClassRoomDetail.html",
        controller: 'classroomDetailCtrl'
      }
    }
  })

      //課業諮詢
  .state('app.courseAdviser', {
    url: "/main/courseAdviser",
    views: {
      'menuContent': {
        templateUrl: "templates/courseAdviser.html",
        controller: 'courseAdviserCtrl'
      }
    }
  })

      //課業諮詢-詳情
  .state('app.courseAdviser-Detail', {
    url: "/main/courseAdviserDetail",
    views: {
      'menuContent': {
        templateUrl: "templates/courseAdviserDetail.html",
        controller: 'courseAdviserDetailCtrl'
      }
    }
  })

      //問題反映
  .state('app.commit', {
    url: "/main/commit",
    views: {
      'menuContent': {
        templateUrl: "templates/commit.html",
        controller: 'commitCtrl'
      }
    }
  })

      //問題反映-詳情
  .state('app.commit-Detail', {
    url: "/main/commitDetail",
    views: {
      'menuContent': {
        templateUrl: "templates/commitDetail.html",
        controller: 'commitDetailCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
