angular.module('starter')

.factory(("ionPlatform"), function ($q) {
    var ready = $q.defer();

    ionic.Platform.ready(function (device) {
        ready.resolve(device);
    });

    return {
        ready: ready.promise
    };
})

//get Lists Serivce 類似 constructor
.service('getListService', function ($http, $localStorage, $q) {
    var url = helper.URL.productURL + '/getCKLists.aspx'; //新班開課、活動快報
    var urlCourse = helper.URL.productURL + '/LOD/CourseApp.aspx'; //課程異動
    var urlLecture = helper.URL.productURL + '/LectureApp.aspx'; //教材進度
    var urlclassRoom = helper.URL.productURL + '/classroomapp.aspx'; //上課教室
    var urlCourseAdviser = 'http://www.public.tw/prog/blue/HotCourse/api/HotCourse_Select_List.ashx'; //課業諮詢
    var urlCommit = 'http://www.public.tw/prog/ding/CK_APP_API/Comment_Select_List.ashx'; //問題反應
    return ({
        getLists: getLists,
        getCourse: getCourse, //課程異動
        getLecture: getLecture,
        getClassRoom: getClassRoom,
        getCourseAdviser: getCourseAdviser, //課業諮詢
        getCommit: getCommit
    });

    //新班開課、活動快報
    function getLists(LC, page) {
        var request = $http({
            method: "POST",
            url: url,
            params: { TOKEN: $localStorage.key.token, SERID: $localStorage.serID, LC: LC, page: page },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }

    //課程異動
    function getCourse() {
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });
        var request = $http({
            method: "POST",
            url: urlCourse,
            params: { LODid: LODID, PID: $localStorage.UserInfo.myPID, TOKEN: $localStorage.key.token },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }

    //教材進度
    function getLecture() {
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });
        console.log(LODID);
        var request = $http({
            method: "POST",
            url: urlLecture,
            params: { LODid: LODID, PID: $localStorage.UserInfo.myPID, TOKEN: $localStorage.key.token },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }

    //上課教室
    function getClassRoom() {
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });
        var request = $http({
            method: "POST",
            url: urlclassRoom,
            params: { LODid: LODID, PID: $localStorage.UserInfo.myPID, TOKEN: $localStorage.key.token },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }

    function getLODID(array) {
        angular.forEach(array, function (data) {
            if (data.ischecked) {
                return data.LODID;
            }
        });
    }

    //課業諮詢
    function getCourseAdviser() {
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });

        var request = $http({
            method: "POST",
            url: urlCourseAdviser,
            params: { nickname: $localStorage.UserInfo.myUID },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return request;
    }

    //問題反應
    function getCommit() {
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });

        var request = $http({
            method: "GET",
            url: urlCommit,
            params: { nickname: $localStorage.UserInfo.myUID },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return request;
    }

})

.service('getDetialService', function ($http, $localStorage, $q) {
    var url = helper.URL.productURL + '/getListDetail.aspx'; //活動快報、新班開課(內容)
    var urlClassRoom = helper.URL.productURL + '/classroomapp.aspx'; //上課教室
    return ({
        getDetail: getDetail,
        getClassRoomDetail: getClassRoomDetail
    });

    function getDetail(LC, nb) {
        var request = $http({
            method: "POST",
            url: url,
            params: { TOKEN: $localStorage.key.token, NB: nb, LC: LC, SERID: $localStorage.serID, TOKEN: $localStorage.key.token },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        //console.log({TOKEN:$localStorage.key.token, NB:nb, LC:LC, SERID:$localStorage.serID })
        //console.log(request)
        return request;
    }

    //上課教室-詳情
    function getClassRoomDetail(rID) {
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });
        var request = $http({
            method: "POST",
            url: urlClassRoom,
            params: { rID: rID, C: 'DETAIL', LODid: LODID, PID: $localStorage.UserInfo.myPID, TOKEN: $localStorage.key.token },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }

})

.service('getbadgeService', function ($http, $localStorage, $q, $cacheFactory) {
    return ({
        badge: badge
    });


    function badge() {
        var badge1 = $http({
            method: "POST",
            url: helper.URL.productURL + '/getBadge.aspx',
            params: { SERID: $localStorage.serID, C: 'BADGE.N', DATE: $localStorage.iconbadge.newsBadge.date },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        var badge2 = $http({
            method: "POST",
            url: helper.URL.productURL + '/getBadge.aspx',
            params: { SERID: $localStorage.serID, C: 'BADGE.C', DATE: $localStorage.iconbadge.newClassBadge.date },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        var LODID;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODID = data.LODID;
            }
        });
        var badge3 = $http({
            method: "POST",
            url: helper.URL.productURL + '/LOD/CourseApp.aspx',
            params: { LODid: LODID, PID: $localStorage.UserInfo.myPID, C: 'BADGE', DATE: $localStorage.iconbadge.classChangeBadge.date, TOKEN: $localStorage.key.token },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

        });
        return $q.all([badge1, badge2, badge3]);
    }
})

.service('logService', function ($http, $localStorage) {

    var url = helper.URL.productURL + '/Analysis.aspx';

    return ({
        sendFunClick: sendFunClick
    });

    function sendFunClick(funName) {
        console.log($localStorage.userPlatform);
        $http({
            method: "POST",
            url: url,
            params: { fun: funName, pid: $localStorage.UserInfo.myPID, serid: $localStorage.serID, logtype: 'func', platform: $localStorage.userPlatform },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
})


.service('httpService', ['$http', '$localStorage', function ($http, $localStorage) {
    var url_q = "http://www.public.tw/prog/ding/CK_APP_API/v2/HotCourse_Insert_v2.ashx";
    var url_c = "http://www.public.tw/prog/ding/CK_APP_API/v2/Comment_Insert_v2.ashx"; //問題反映-新增
    var serID;
    angular.forEach($localStorage.MyLOD, function (data) {
        if (data.ischecked) {
            serID = data.Lid;
        }
    });

    return ({
        postToSaveQuestion: postToSaveQuestion,
        postToSaveCommit: postToSaveCommit
    });

    //可能沒在用
    function postToSaveQuestion(postParmas) {
        var request = $http({
            method: "POST",
            url: url_q,
            params: { SerID: serID, nickname: $localStorage.UserInfo.myUID, name: $localStorage.UserInfo.myName, myTitle: postParmas.myTitle, myContent: postParmas.myContent, myid: '' },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }

    //問題反映-新增
    function postToSaveCommit(postParmas) {
        var request = $http({
            method: "POST",
            url: url_c,
            params: { SerID: serID, nickname: $localStorage.UserInfo.myUID, name: $localStorage.UserInfo.myName, myTitle: postParmas.myTitle, myContent: postParmas.myContent, myid: '' },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return request;
    }
}])

.service('utilService', ['$localStorage', function ($localStorage) {
    return ({
        getCheckedLod: getCheckedLod()
    });

    function getCheckedLod() {
        var LODLname;
        angular.forEach($localStorage.MyLOD, function (data) {
            if (data.ischecked) {
                LODLname = data.Lname;
            }
        });
        return LODLname;
    }

}]);
