angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicLoading, $http,
   $ionicPopup, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $ionicPlatform, $ionicHistory, getbadgeService, $ionicNavBarDelegate, logService, $cordovaNetwork, $rootScope) {
    // Form data for the login modal
// console.log('log......');
    var startTime = 0;
    var endTime = 0;
    $scope.loginData = {};
    $scope.notifications = [];
    $scope.clickCount = 0;
    $scope.goback = function () {
        $scope.clickCount++;
        if ($scope.clickCount > 1) {
            $scope.clickCount = 0;
            return;
        }
        $ionicHistory.goBack();
    };

    $scope.$on('bridgeSent', function (e, data) {
        console.log(data);
        $timeout(function () {
            $scope.$broadcast('getPostData', data);
        }, 100);

    });

    //getbadge function
    $scope.getBadge = function () {
        getbadgeService.badge()
            .then(function (success) {
                console.log(success);
                $localStorage.iconbadge.newsBadge.badge = success[0].data[0].Badge;
                $localStorage.iconbadge.newClassBadge.badge = success[1].data[0].Badge;
                $localStorage.iconbadge.classChangeBadge.badge = success[2].data[0].Badge;
            },
            function (err) {
                console.log(err);
            });
    };

    $scope.getPreviousTitle = function () {
        return $ionicHistory.backTitle();
    };
    //輔考期限檢查
    var checkLearnEndDate = function () {
        var i = 0;
        var today = new Date();
        if ($localStorage.MyLOD.length > 0) {
            angular.forEach($localStorage.MyLOD, function (data) {
                i++;
                var endDate = new Date(data.LearnEndDate.replace('上午', '').replace('下午', ''));
                if (today > endDate) {
                    //刪除array i = 第幾個陣列
                    $localStorage.MyLOD.splice(i - 1, 1);
                }
            });
        }

        if ($localStorage.MyLOD.length <= 0) {
            // $timeout($scope.openModal, 1000);
            $ionicLoading.show({
                template: '您的輔考期限已到期',
                duration: 1500
            });
            $localStorage.$reset($scope.localStorageItems);
        }
    };

    // call to register automatically upon device ready
    $ionicPlatform.ready(function (device) {
        // $timeout($scope.openModal, 400);
        //$timeout($scope.openModal, 2000);

        console.log('hihihihihihi');
        // document.addEventListener("deviceready", onDeviceReady, false);
        startTime = new Date().getTime();
        //檢查網路
        // $scope.network = $cordovaNetwork.getNetwork();
        // $scope.isOnline = $cordovaNetwork.isOnline();
        // $scope.$apply();
        //
        // cordova.getAppVersion.getVersionNumber().then(function (version) {
        //   $scope.appVersion  = version;
        // });
        //
        // // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            $scope.isOnline = true;
            $scope.network = $cordovaNetwork.getNetwork();
console.log("online");
            $scope.$apply();
        });

        // // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
console.log("got offline");
            $scope.isOnline = false;
            $scope.network = $cordovaNetwork.getNetwork();
            $scope.networkNotification();
            $scope.$apply();
        });
        //
        $scope.networkNotification = function () {
            $ionicPopup.alert({
                title: '警告',
                template: '<div class="center">目前是無網路狀態，請確認您的網路是否暢通</div>'
            });
        };

        //檢查是否第一次進入
        if ($localStorage.UserInfo === null || $localStorage.UserInfo === '' || $localStorage.UserInfo === undefined) {
            $localStorage.$default($scope.localStorageItems);

            $timeout($scope.openModal, 400);
            // $scope.register();
            console.log('is first enter');

        } else {

            var today = new Date();
            var startDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + ' ' + today.getHours() +
            ':' + today.getMinutes();
            console.log(today);
            if ($localStorage.isLogin === 0) {
                $timeout($scope.openModal, 1000);
            }

            checkLearnEndDate();
            $scope.getBadge();
        }

        //檢查Platform
        if (ionic.Platform.isAndroid()) {
            $localStorage.userPlatform = 'Android';
        }
        else if (ionic.Platform.isIOS()) {
            $localStorage.userPlatform = 'IOS';
        }
    });

    // 監聽pause and resume 事件
    function onDeviceReady()
    {
alert('onDeviceReady...');
        //初始化
        var appId = 'cNeRrXvFZ1BIHiRSDr9p3FdbxfWxxz3s2AbIZPMU'; //get from parse
        var ClientKey = 'BWiMVSahqmaV5ZUnmO7y7pYFAp3jKwNpXeW1W3nT'; //get from parse

        // parsePlugin.initialize(appId, ClientKey, function() {
        //   //增加設定頻道 不用先預設頻道了
        //   //parsePlugin.subscribe('CK_ALL');
        // }, function(e) {
        //     console.log('error');
        // });
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);

        document.addEventListener("deviceready", function ()
        {
            var type = $cordovaNetwork.getNetwork()
            var isOnline = $cordovaNetwork.isOnline()
            var isOffline = $cordovaNetwork.isOffline()

            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                var onlineState = networkState;
            })

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                var offlineState = networkState;
            })

        }, false);
    }

    //進入APP後台
    function onPause() {
        endTime = new Date().getTime();
        var seconds = (endTime - startTime) / 1000;

        /*不使用異步執行 callback回來時間不夠*/
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://www.public.tw//prog/ding/CK_APP_API/Analysis.aspx?pid=" + $localStorage.UserInfo.myPID + "&logtype=usetime&usetime=" + seconds.toFixed() + "", true);
        xmlhttp.send();


        //logService.sendUseTime(seconds.toFixed());
        console.log("-------------------pause-------------------", seconds.toFixed());
    }
    //進入APP前台
    function onResume() {

        //時間重新計算
        startTime = new Date().getTime();
        console.log("-------------------resume-------------------");
        checkLearnEndDate();
        //跑getbadgeService
        $scope.getBadge();
    }

    // Notification Received
    $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        //console.log('this::::' + JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
            handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
            handleIOS(notification);
        }
    });

    function handleAndroid(notification) {
        //sorry this code just copy paste
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
        if (notification.event == "registered") {
            $scope.regId = notification.regid;
            //storeDeviceToken("android");
        }
        else if (notification.event == "message") {
            console.log(notification);
            $cordovaDialogs.alert(notification.message, "Push Notification Received");
            $scope.$apply(function () {
                $scope.notifications.push(JSON.stringify(notification.message));
            });
        }
        else if (notification.event == "error")
            $cordovaDialogs.alert(notification.msg, "Push notification error event");
        else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
    }

    // IOS Notification Received Handler
    function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == "1") {
            // Play custom audio if a sound specified.
            if (notification.sound) {
                var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
            }

            if (notification.body && notification.messageFrom) {
                $cordovaDialogs.alert(notification.body, notification.messageFrom);
            }
            if (notification.badge) {
                $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                    console.log("Set badge success " + result);
                }, function (err) {
                    console.log("Set badge error " + err);
                });
            }
        }
            // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
            // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
            // the data in this situation.
        else {
            if (notification.body && notification.messageFrom) {
                $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
            } else {
                if (notification.badge) {
                    var badge = parseInt(notification.badge) + $localStorage.badgeTotal;
                    $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                        console.log("Set badge success " + result);
                    }, function (err) {
                        console.log("Set badge error " + err);
                    });
                }
            }
        }
    }

    // Register
    $scope.register = function () {
        var config = null;
        if (ionic.Platform.isAndroid()) {
            config = {
                "senderID": "703439741476" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
            };
        }
        else if (ionic.Platform.isIOS()) {
            config = {
                "badge": "true",
                "sound": "true",
                "alert": "true"
            };
        }

        $cordovaPush.register(config).then(function (result) {
            console.log("Register success??????? " + result);
            $scope.registerDisabled = true;
            // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here

        }, function (err) {
            console.log("Register error " + err);
        });
    };


    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', function ($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false,
        backdropClickToClose: false
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // 監控Login
    $scope.$watch(function () { return $localStorage.isLogin; }, function (newVal, oldVal) {
        if (oldVal !== newVal && newVal === undefined) {
            console.log('It is undefined');
        }
        //變化的話就改變scope的內容
        $scope.isLogin = $localStorage.isLogin;
        $scope.userInfo = $localStorage.UserInfo;
    }, true);


    // Open the login modal
    $scope.login = function () {
        if ($localStorage.isLogin == 1) {
            //ionic 提示框用法
            var confirmPopup = $ionicPopup
            .confirm({
                title: '提示',
                template: '<div class="center">你確出嗎</div>',
                cancelText: '取消',
                okText: '確定',
                okType: 'button-positive'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    //$localStorage.$reset($scope.localStorageItems);
                    console.log('登出：：');
                    if (ionic.Platform.isAndroid()) {
                        // android 刪除channels 解法
                        angular.forEach($localStorage.MyLOD, function (data) {
                            angular.forEach($scope.settingsListDefault, function (data2, key) {
                                // parsePlugin.unsubscribe(data2.channelString + data.LODID, function() {
                                // },function(e) {
                                //     alert('error');
                                // });
                            });

                        });
                    }
                    else if (ionic.Platform.isIOS()) {
                        // parsePlugin.getSubscriptions(function(subscriptions) {
                        //       console.log(subscriptions);
                        //       angular.forEach(subscriptions, function(data) {
                        //     	parsePlugin.unsubscribe(data, function(msg) {
                        //         console.log(data);
                        //     }, function(e) {
                        //         console.log('error');
                        //     });
                        //   });
                        //   }, function(e) {
                        //       console.log(e);
                        //   });

                    }
                    $localStorage.$reset($scope.localStorageItems);
                    if ($localStorage.isLogin === 0) {
                        $ionicLoading.show({
                            template: '<div class="ion-checkmark-round myIcon"></div>登出成功',
                            duration: 1500
                        });
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: false,
                            historyRoot: true
                        });
                        if ($localStorage.isLogin === 0) {
                            $timeout($scope.openModal, 100);
                        }
                    }
                }
            });
        } else {
            $scope.modal.show();
        }
    };

    $scope.settingsListDefault = [
      { text: '活動快報推播通知', channelString: 'news', checked: true },
      { text: '課程異動推播通知', channelString: 'classChange', checked: true },
      { text: '新班開課推播通知', channelString: 'newClass', checked: true }
    ];

    //$scope.badgesItem = {activity: 0, classchange: 0, classroom: 0, bookupdate: 0};
    var badgeDefultDate = MyUtil.namespace().getDate();
    $scope.iconbadge = { newsBadge: { badge: 0, date: badgeDefultDate }, classChangeBadge: { badge: 0, date: badgeDefultDate }, newClassBadge: { badge: 0, date: badgeDefultDate } };

    $scope.localStorageItems = { isLogin: 0, serID: null, userID: null, UserInfo: null, key: null, MyLOD: null, UserSettings: $scope.settingsListDefault, iconbadge: null, appVersion: null, loginDate: null, myppp: null };
    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        //console.log('Doing login', $scope.loginData);

        $ionicLoading.show({
            template: helper.templateString.loading('登入中請稍候...')
        });
        var params1 = { UID: $scope.loginData.UID, PW: $scope.loginData.PW, S: 1 };
        $localStorage.myppp = params1;


        console.log(params1);
        var url = helper.URL.productURL + '/checkUserAndCreateToken.aspx';
        $http({
            method: "POST",
            url: url,
            params: { UID: $scope.loginData.UID, PW: $scope.loginData.PW, S: 1 }, // S = 1 --> 選擇是學員 0 --> 則不是
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).
              // 登入後成功來讀取資料
              success(function (data, status, headers, config) {
                  if (data.MyLOD !== "") {
                      $localStorage.isLogin = data.isLogin; //isLogin
                      $localStorage.serID = data.serID; //serID
                      $localStorage.UserInfo = data.UserInfo[0]; //userInfo
                      $localStorage.key = data.key; //post server key
                      $localStorage.MyLOD = data.MyLOD.length === 0 ? "" : data.MyLOD; // if MyLOD is empty return ""
                      $localStorage.iconbadge = $scope.iconbadge;
                      $localStorage.appVersion = $scope.appVersion;
                      $localStorage.loginDate = new Date();
                      $ionicLoading.show({
                          template: '<div class="ion-checkmark-round myIcon"></div>登入成功',
                          duration: 1500
                      });

                      $ionicHistory.nextViewOptions({
                          disableAnimate: true,
                          disableBack: false,
                          historyRoot: true
                      });
                      console.log('登入：：');
                      //$ionicLoading.hide();
                      $timeout(function () {
                          angular.forEach($localStorage.MyLOD, function (data) {
                              angular.forEach($scope.settingsListDefault, function (data2, key) {
                                  // parsePlugin.subscribe(data2.channelString + data.LODID, function() {
                                  // },function(e) {
                                  //     alert('error');
                                  // });
                              });

                          });
                      }, 1000);
                      checkLearnEndDate();

                      $scope.closeLogin();

                      window.location.href = '#/app/main';
                  } else {
                      var message = '登入失敗';
                      if (data.isLogin == 1) {
                          message = '您為非學員';
                      }
                      $ionicLoading.show({
                          template: '<div class="ion-close-round myIcon"></div>' + message,
                          duration: 1500
                      });
                  }
              }).
              error(function (data, status, headers, config) {
                  console.log("登入error");
              });
    };
})

.controller('UserProfileCtrl', function ($scope, $localStorage) {
// console.log($localStorage.UserSettings);
    $scope.settingsList = $localStorage.UserSettings;
    //get version
    // cordova.getAppVersion.getVersionNumber().then(function (version) {
    //     $scope.appVersion = version;
    //     // console.log(version);
    // });
    $scope.pushNotificationChange = function (val) {
        $localStorage.UserSettings = $scope.settingsList;
        if (val.checked) {
            angular.forEach($localStorage.MyLOD, function (data) {
                // parsePlugin.subscribe(val.channelString + data.LODID, function() {
                // },function(e) {
                //     alert('error');
                // });
            });

        } else {
            angular.forEach($localStorage.MyLOD, function (data) {
                // parsePlugin.unsubscribe(val.channelString + data.LODID, function() {
                // },function(e) {
                //     alert('error');
                // });
            });

        }
    };
})

.controller('MainCtrl', function ($scope, $stateParams, $ionicScrollDelegate, $ionicLoading, $ionicModal, $localStorage,
   $timeout, $ionicPopup, $http, getbadgeService, logService) {
    //console.log('test');
    $scope.req = '';
    $scope.iconbadge = {};
    $scope.iconbadge = $localStorage.iconbadge;
    //console.log($scope.iconbadge.newsBadge)
    var ref;
    $scope.$watch(function () { return $localStorage.MyLOD; }, function (newVal, oldVal) {
        if (oldVal !== newVal && newVal === undefined) {
            //console.log('It is undefined');
        }
        //用angular foreach 會有點慢
        //補課預約
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                $scope.myLODID = data.LODID;
                $scope.req = 'DBID=' + data.LODID
                + '&PID='
                + $localStorage.UserInfo.myPID + '&MYNAME=' + $localStorage.UserInfo.myName
                + '&LNAME=' + data.Lname + '&SERID='
                + data.Lid + '&VID=' + data.Vid;
                $scope.need = "http://m.public.com.tw/App/LODLogin.aspx?" + $scope.req;
                //console.log($scope.need);
            }

        });
    }, true);

    $scope.$watch(function () { return $localStorage.iconbadge; }, function (newVal, oldVal) {
        if (oldVal !== newVal && newVal === undefined) {
            //console.log('It is undefined');
        }
        $scope.iconbadge = $localStorage.iconbadge;

    }, true);
    $scope.classLists = function () {
        window.location.href = '#/app/main/classLists';
    };

    var inAppBrowserOptions = 'closebuttoncaption=關閉,location=no,enableViewportScale=yes,clearcache=yes';

    $scope.LOD = function () {
        //log
        logService.sendFunClick('fun6_click');
        ref = cordova.InAppBrowser.open($scope.need, getSetting(), inAppBrowserOptions);
        //window.open = cordova.InAppBrowser.open;
    };

    $scope.badge = function () {
        $scope.getbadge.badge().then(function (data) {
            console.log(data[0].data[0].Badge);
        });
    };

    var getSetting = function () {
        var setting;
        if (ionic.Platform.isAndroid()) {
            setting = '_blank';
            // setting = '_system';
        }
        else if (ionic.Platform.isIOS()) {
            setting = '_blank';
        }

        return setting;
    };

    //上課教室
    $scope.classRoom = function () {
        window.location.href = '#/app/main/classroom';
    };

    //教材進度
    $scope.lecture = function () {
        window.location.href = '#/app/main/lecture';
    };

    //行動公職王
    $scope.checkPublic = function () {
        //log
        logService.sendFunClick('fun7_click');
        //cordova.InAppBrowser.open('http://m.public.com.tw/', getSetting(), inAppBrowserOptions);
        cordova.InAppBrowser.open('https://www.public.com.tw/home/mindex', getSetting(), inAppBrowserOptions);
        window.open = cordova.InAppBrowser.open;
    };

    //平時測驗
    $scope.YouTest = function () {
        //log
        // logService.sendFunClick('fun8_click');
        // var postV = window.open('http://elite.ish.com.tw/Home/PublicIndex', getSetting(), inAppBrowserOptions);
        //
        // postV.addEventListener('loadstop', function() {
        //   var msg = " var formDiv = document.createElement('form'); formDiv.id='formDiv'; ";
        //   msg += " formDiv.innerHTML='<input type='text' id='account' value='A146255897'/><input type='text' id='password' value='123456'/>';" ;
        //   msg +=  "document.getElementById('formDiv').submit();";
        //
        //   postV.executeScript({
        //     code: msg
        //   }, function (values){
        //     console.log(values);
        //   });
        //
        // });
        //
        //
        // console.log(postV);
        // window.open = postV;

        // $http.post('http://elite.ish.com.tw/Home/PublicIndex', {account: 'A146255897', password: '123456'})
        // .then(function (res){
        //   console.log(res.data);
        // }, function (){
        //
        // });

        // var keys = ["account", "password"];
        // var values = ["A146255897", "123456"];
        var url = 'http://www.public.tw/prog/ding/CK_APP_API/RedirectToTest.aspx?account=' + $localStorage.myppp.UID + '&password=' + $localStorage.myppp.PW + '';
        //console.log('look youtest url', url);
        cordova.InAppBrowser.open(url, getSetting(), inAppBrowserOptions);
        //window.open = cordova.InAppBrowser.open;
        //     if (!newWindow){
        //       return false;
        //     }
        //
        //  var html = "";
        //  html += "<html><head></head><body><form id='formid' method='post' action='"    + url + "'>";
        //  if (keys && values && (keys.length == values.length)){
        //      for ( var i = 0; i < keys.length; i++){
        //          html += "<input type='hidden' name='" + keys[i] + "' value='" + values[i] + "'/>";
        //      }
        //  }
        //  html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()" + "</script></body></html>";
        //  newWindow.document.write(html);
    };

    //歷屆試題
    $scope.HistoryExam = function () {
        //log
        logService.sendFunClick('fun9_click');
        //cordova.InAppBrowser.open('http://m.public.com.tw/App/f01.aspx', getSetting(), inAppBrowserOptions);
        cordova.InAppBrowser.open('https://www.public.com.tw/previousexamnew', getSetting(), inAppBrowserOptions);
        window.open = cordova.InAppBrowser.open;
    };

    $scope.closePage = function (typ) {
        if (typ == 'P') {
            $scope.modalP.hide();
        }
        else if (typ == 'Y') {
            $scope.modalY.hide();
        }
        else if (typ == 'L') {
            $scope.modalL.hide();
        }
    };
})

.controller('loginCtrl', function ($scope, $stateParams, $ionicScrollDelegate, $localStorage) {
    $scope.trustSrc = function (src) {
        //要使用ng-src 必須調用 $sce.trustAsResourceUrl
        return $sce.trustAsResourceUrl(src);
    }
})

//活動快報
//todo 要改成用route的方式 不然正式app會讀不到
.controller('newsListsCtrl', function ($scope, $http, $ionicLoading, $localStorage, getListService, $ionicHistory, ionicMaterialMotion, $timeout, logService, $ionicPopup) {
    //log

    logService.sendFunClick('fun1_click');
    $scope.page = 0;
    var max_page = 50;
    $scope.noMore = true;
    //更改 進入的date
    $localStorage.iconbadge.newsBadge.date = MyUtil.namespace().getDate();
    $localStorage.iconbadge.newsBadge.badge = 0;

    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    });

    //活動快報
    getListService.getLists('BD', $scope.page + 1)
        .then(function (data) {
            $scope.newsLists = data.data.lists;
            $scope.page = data.data.page;
            $scope.noMore = false;
            //listAnimation();
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading
            .show({
                template: '讀取錯誤！',
                duration: 1500
            });
        });
    //$scope.noMore = false;

    //活動快報
    $scope.loadMoreList = function () {
        getListService.getLists('BD', $scope.page + 1)
        .then(function (success) {
            if (success.data.lists.length == 0) {
                $scope.noMore = true;
            };
            //
            $scope.page = success.data.page;
            angular.forEach(success.data.lists, function (value, key) {
                $scope.newsLists.push({
                    title: value.title, NB: value.NB
                });


            });

            if ($scope.page == max_page) {
                $scope.noMore = true;
            };

            $scope.$broadcast('scroll.infiniteScrollComplete');


        },

        function (error) {
            console.log('err');
            $ionicLoading.show({
                template: '讀取錯誤!',
                duration: 1500
            });
            $ionicHistory.goBack(-1);
        });
    }
})

.controller('newsCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicScrollDelegate, $localStorage, getDetialService) {
    //console.log($stateParams.nb);
    //$scope.nb = $stateParams.nb;
    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
    })
    getDetialService.getDetail('BD', $stateParams.nb)
      .then(function (success) {

          $scope.news = success.data;
          $ionicLoading.hide();
          $ionicScrollDelegate.scrollTop()
      }, function (error) {

          $ionicLoading
            .show({
                template: '讀取錯誤！',
                duration: 1500
            });
      });

    $scope.reload = function (nb) {
        $ionicLoading.show({
            template: helper.templateString.loading('讀取中...'),
        })

        getDetialService.getDetail('BD', nb)
          .then(function (success) {
              $scope.news = success.data;
              $ionicLoading.hide();
              $ionicScrollDelegate.scrollTop(true);
          }, function (error) {

              $ionicLoading
                .show({
                    template: '讀取錯誤！',
                    duration: 1500
                });
          });
    }
})

    //新班開課
.controller('classListsCtrl', function ($scope, $http, $ionicLoading, $localStorage, getListService, $ionicHistory, ionicMaterialMotion, $timeout, logService) {
    $scope.page = 0;
    var max_page = 50;
    $scope.noMore = true;
    //log
    logService.sendFunClick('fun2_click');
    //更改 進入的date
    $localStorage.iconbadge.newClassBadge.date = MyUtil.namespace().getDate();
    $localStorage.iconbadge.newClassBadge.badge = 0;
    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    })

    //新班開課
    getListService.getLists('E', $scope.page + 1)
      .then(function (data) {
          $scope.classLists = data.data.lists;
          $scope.page = data.data.page;
          $ionicLoading.hide();
          $scope.noMore = false;
      }, function (error) {
          $ionicLoading
            .show({
                template: '讀取錯誤！',
                duration: 1500
            });
      });

    //新班開課
    $scope.loadMoreList = function () {
        $timeout(function () {
            getListService.getLists('E', $scope.page + 1)
            .then(function (success) {
                $scope.page = success.data.page;
                angular.forEach(success.data.lists, function (value, key) {
                    $scope.classLists.push({
                        title: value.title, NB: value.NB
                    });
                });
                //動畫
                if ($scope.page == max_page) {
                    $scope.noMore = true;
                };

                $scope.$broadcast('scroll.infiniteScrollComplete');
            },

              function (error) {
                  console.log('err');
                  $ionicLoading.show({
                      template: '讀取錯誤!',
                      duration: 1500
                  });
                  $ionicHistory.goBack(-1);
              });
        }, 500);
    }
})

//新班開課-內容
.controller('classCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicScrollDelegate, $localStorage, $timeout, getDetialService) {

    //console.log($stateParams.nb);
    //$scope.nb = $stateParams.nb;
    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    })
    getDetialService.getDetail('E', $stateParams.nb)
      .then(function (success) {
          $scope.ckClass = success.data;
          console.log(success.data[0].content);
          $ionicLoading.hide();
          $ionicScrollDelegate.scrollTop();
      }, function (error) {

          $ionicLoading
            .show({
                template: '讀取錯誤！',
                duration: 1500
            });

          scope.open = function (href) {
              console.log(href);
          };
      });

    $scope.reload = function (nb) {
        $ionicLoading.show({
            template: helper.templateString.loading('讀取中...'),
        })

        getDetialService.getDetail('E', nb)
          .then(function (success) {
              $scope.ckClass = success.data;
              $ionicLoading.hide();
              $ionicScrollDelegate.scrollTop(true);
          }, function (error) {

              $ionicLoading
                .show({
                    template: '讀取錯誤！',
                    duration: 1500
                });
          });
    }
})

.controller('UserInfoCtrl', function ($scope, $localStorage) {

    $scope.$watch(function () { return $localStorage.isLogin; }, function (newVal, oldVal) {
        if (oldVal !== newVal && newVal === undefined) {
            console.log('It is undefined');
        }
        //變化的話就改變scope的內容
        $scope.userInfo = $localStorage.UserInfo;
    }, true);
})

.controller('IdentityCtrl', function ($scope, $localStorage) {
    $scope.iData = { ClassName: '' };
    //$ionicConfigProvider.views.maxCache(0);
    //this default
    if ($scope.iData.ClassName == '') {
        angular.forEach($localStorage.MyLOD,
          function (data) {
              //console.log(data);
              if (data.ischecked == true) {
                  //console.log(data.Lname);
                  $scope.iData = {
                      ClassName: data.Lname
                  }
              };
          });
    };
    $scope.$watch(function () { return $localStorage.isLogin; }, function (newVal, oldVal) {
        if (oldVal !== newVal && newVal === undefined) {
            console.log('It is undefined');
        }
        //變化的話就改變scope的內容
        $scope.MyLOD = $localStorage.MyLOD;
    }, true);

    $scope.iDataChange = function (val) {
        angular.forEach($localStorage.MyLOD, function (data) {
            data.ischecked = false;
            if (data.Lname == val) {
                data.ischecked = true;
            };
        });
    }
})

//課程異動
.controller('CourseMoveCtrl', function ($scope, $localStorage, getListService, $ionicLoading, logService) {
    //更改 進入的date
    $localStorage.iconbadge.classChangeBadge.date = MyUtil.namespace().getDate();
    $localStorage.iconbadge.classChangeBadge.badge = 0;

    //log
    logService.sendFunClick('fun3_click');

    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    })
    getListService.getCourse().then(function (success) {
        // console.log(success.data.length);
        $scope.courses = success.data;
        if ($scope.courses.length == 0) {
            $scope.noData = true;
        };
        //$localStorage.badgeItem.classchange = 0;
        $ionicLoading.hide();
    },
       function () {
           $ionicLoading.show({
               template: '讀取失敗!!',
               duration: 1500
           })
       });
})

    //教材進度
.controller('lectureAppCtrl', function ($scope, $ionicLoading, getListService, $ionicPopover, logService) {
    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    })
    //log
    logService.sendFunClick('fun5_click');
    getListService.getLecture().then(function (success) {

        $ionicPopover.fromTemplateUrl('templates/LecturePopover.html', {
            scope: $scope,
            backdropClickToClose: false
        }).then(function (popover) {
            $scope.popover = popover;
            $scope.lectureData = {};
        });

        $scope.lecture = success.data.data;
        angular.forEach(success.data.category, function (data) {
            data.category = data.category.replace('-', ' ').replace('-', ' ')
        });
        $scope.categoryItem = success.data.category;
        $scope.total = '筆數';
        $ionicLoading.hide();
    });

    $scope.$on('backdropClick', function (e, d) {
        $scope.popover.hide();
    });
})

    //上課教室
.controller('classRoomCtrl', function ($scope, $ionicLoading, getListService, $ionicPopover, $localStorage, logService) {
    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    });
    //log
    logService.sendFunClick('fun4_click');
    getListService.getClassRoom().then(function (success) {
        $scope.classRoom = success.data;
        $scope.show = false;
        if ($scope.classRoom.length <= 0) {
            $scope.show = true;
        }
        $ionicLoading.hide();
    });
})

//上課教室-詳情
.controller('classroomDetailCtrl', function ($scope, $ionicLoading, getDetialService, $ionicPopover, $stateParams) {
    $ionicLoading.show({
        template: helper.templateString.loading('讀取中...'),
        duration: 10000
    });
    //console.log($stateParams.rID);
    getDetialService.getClassRoomDetail($stateParams.rID)
      .then(function (success) {
          $scope.PopoverOpen = function ($event) {
              $scope.popover.show($event);
          };
          $scope.classRoom = success.data;
          $ionicLoading.hide();
      },
    function (err) {
        console.log(err);
    });

})

//課業諮詢
.controller('courseAdviserCtrl', function ($scope, getListService, $ionicModal, utilService, httpService, $timeout, $ionicLoading, $rootScope) {
    //http request
    $scope.isSendQ = false;
    getListService.getCourseAdviser()
    .then(function (success) {
        $scope.courseList = success.data;
    }, function (error) {
        console.error(error);
    });

    $scope.LODLname = utilService.getCheckedLod;
    //setting modal
    $ionicModal.fromTemplateUrl('templates/modal-template/question-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //課業諮詢-新增
    $scope.addQuestion = function () {
        $scope.modal.show();
    }

    $scope.modalClose = function () {
        $scope.modal.hide();
    }

    //課業諮詢-詳情
    $scope.goDetail = function (data) {
        window.location.href = "#/app/main/courseAdviserDetail";
        $scope.$emit('bridgeSent', data)
    }

    $scope.sentQuestion = function (myTitle, myContent) {
        console.log('isQ', $scope.isSendQ);

        if ($scope.isSendQ) { return; }
        $scope.isSendQ = true;
        var postParmas = {
            myTitle: myTitle,
            myContent: myContent
        };


        httpService.postToSaveQuestion(postParmas)
          .then(function (success) {
              if (success.data == "True") {
                  // and reload data from server
                  getListService.getCourseAdviser()
                    .then(function (success) {
                        $scope.courseList = success.data;
                    }, function (error) {
                        console.error(error);
                    });

                  $ionicLoading.show({
                      template: '發問成功!!'
                  });
                  $scope.isSendQ = false;
                  $timeout(function () {
                      $ionicLoading.hide();

                      $scope.modal.hide();
                  }, 1000)
              }
          }, function () {

          })
    }

})

//課業諮詢-詳情
.controller('courseAdviserDetailCtrl', function ($scope, getListService, $ionicModal, utilService, httpService, $timeout, $ionicLoading, $rootScope) {
    $scope.$on('getPostData', function (e, data) {
        $scope.detailData = data;
    })
})

//問題反映
.controller('commitCtrl', function ($scope, getListService, $ionicModal, utilService, httpService, $timeout, $ionicLoading, $rootScope) {
    //http request
    $scope.isSendQ = false;
    getListService.getCommit()
    .then(function (success) {
        $scope.commitList = success.data;
    }, function (error) {
        console.error(error);
    });

    $scope.LODLname = utilService.getCheckedLod;
    //setting modal
    $ionicModal.fromTemplateUrl('templates/modal-template/commit-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //問題反映-新增
    $scope.addQuestion = function () {
        $scope.modal.show();
    }

    $scope.modalClose = function () {
        $scope.modal.hide();
    }

    //問題反映-詳情
    $scope.goDetail = function (data) {
        window.location.href = "#/app/main/commitDetail";
        $scope.$emit('bridgeSent', data)
    }

    //問題反映-新增
    $scope.sentQuestion = function (myTitle, myContent) {
        if ($scope.isSendQ) { return; }
        $scope.isSendQ = true;
        var postParmas = {
            myTitle: myTitle,
            myContent: myContent
        };

        //問題反映-新增
        httpService.postToSaveCommit(postParmas)
          .then(function (success) {
              if (success.data == "True") {
                  // and reload data from server
                  getListService.getCommit() //刷新列表
                    .then(function (success) {
                        $scope.commitList = success.data;
                    }, function (error) {
                        console.error(error);
                    });

                  $ionicLoading.show({
                      template: '發問成功!!'
                  });
                  $scope.isSendQ = false;
                  $timeout(function () {
                      $ionicLoading.hide();

                      $scope.modal.hide();
                  }, 1000)
              }
          }, function () {

          })
    }

})

//問題反映-詳情
.controller('commitDetailCtrl', function ($scope, getListService, $ionicModal, utilService, httpService, $timeout, $ionicLoading, $rootScope) {
    $scope.$on('getPostData', function (e, data) {
        $scope.detailData = data;
    })
});
