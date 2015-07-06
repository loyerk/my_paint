/*jslint browser: true, node: true */
/*global $, jQuery, alert*/
/*jshint sub:true*/
"use strict";

var token = null,
    angular,
    cordova,
    StatusBar,
    User,
    app = angular.module('starter', ['ionic', 'ngRoute']),
    cameraOptions,
    cameraSuccess,
    cameraError,
    onPhotoDataSuccess,
    onFail,
    destinationType,
    Camera,
    onSuccess,
    onFail,
    options,
    myImg,
    FileUploadOptions,
    params,
    ft,
    FileTransfer,
    onUploadSuccess,
    onUploadFail,
    photo,
    tabUsers,
    password,
    email,
    idTab = [],
    index,
    i,
    j = 0,
    fuo,
    infoSend,
    server,
    $cordovaFileTransfer,
    ft,
    win,
    fail,
    $interval,
    getSnap,
    myNewSnap = {},
    snapTime,
    interval,
    snapIsView,
    snapId,
    dataSnap,
    returnHome;

if (sessionStorage === "undefined") {

    token = null;
    password = null;
    email = null;
} else {

    token = sessionStorage.getItem('token');
    password = sessionStorage.getItem('password');
    email = sessionStorage.getItem('email');
}

User = {
    password: password,
    token: token,
    email: email
};

app.controller('checkConnexionCtrl', function ($location) {

    if (User.token === null) {

        $location.path('/form');
    } else {

        $location.path('/home');
    }
});

app.config(function ($routeProvider) {

    $routeProvider
        .when('/', {templateUrl: 'form.html'})
        .when('/home', {templateUrl: 'home.html'})
        .when('/snap', {templateUrl: 'snap.html'})
        .otherwise({redirectTo : '/'});
});

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.controller('formInscription', function ($scope, $http) {

    $scope.formData = {};
    $scope.inscription = function () {

        if ($scope.formData.email !== undefined) {

            $http({
                method  : 'POST',
                url     : 'http://remikel.fr/api.php?option=inscription',
                data    : $scope.formData  // pass in data as strings
            })
                .success(function (data) {
                    console.log(data);

                    if (data.error) {
                  // if not successful, bind errors to error variables
                        console.log(data.error);
                    } else {
                  // if successful, bind success message to message
                        console.log('utilisateur inscrit');
                    }
                }).error(function (data, status) {
                    console.log(status);
                    console.log(data);
                });
        } else {

            console.log('error');
        }
    };
});

app.controller('formConnexion', function ($scope, $http, $location) {

    $scope.formData = {};
    $scope.connexion = function () {

        if ($scope.formData.email !== undefined) {

            $http({
                method  : 'POST',
                url     : 'http://remikel.fr/api.php?option=connexion',
                data    : $scope.formData  // pass in data as strings
            })
                .success(function (data) {
                    console.log(data);

                    if (data.error) {
                  // if not successful, bind errors to error variables
                        console.log(data.error);
                    } else {
                  // if successful, bind success message to message
                        console.log('utilisateur connecté');
                        User.token = data.token;
                        User.password = $scope.formData.password;
                        User.email = $scope.formData.email;
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('password', $scope.formData.password);
                        sessionStorage.setItem('email', $scope.formData.email);
                        $location.path('/home');
                    }
                }).error(function (data, status) {
                    console.log(status);
                    console.log(data);
                });
        } else {

            console.log('error');
        }
    };
});

app.controller('homeController', function ($scope, $http, $location) {

    $scope.takePic = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: 0
        };
        navigator.camera.getPicture(onSuccess, onFail, options);
    };
    onSuccess = function (FILE_URI) {

        console.log(FILE_URI);
        photo = FILE_URI;
        document.getElementById('photo').src = photo;
        document.getElementById('send').style.display = "block";
        document.getElementById('photoButton').style.display = "none";

        $http({
            method  : 'POST',
            url     : 'http://remikel.fr/api.php?option=toutlemonde',
            data    : {'email' : User.email, 'token' : User.token}
        })
            .success(function (data) {
                console.log(data);

                if (data.error) {
              // if not successful, bind errors to error variables
                    console.log(data.error);
                } else {
              // if successful, bind success message to message
                    console.log('liste récupérée');
                    document.getElementById('search').style.display = "block";
                    console.log(data);
                    $scope.tabUsers = data.data;
                }
            }).error(function (data, status) {
                console.log(status);
                console.log(data);
            });
    };
    onFail = function (e) {
        console.log(e);
    };

    $scope.check = function () {

        if (this.isChecked === true) {

            idTab.push(this.user.id);

        } else {

            index = idTab.indexOf(this.user.id);

            if (index > -1) {

                idTab.splice(index, 1);
            }
        }
    };

    var sendSnap = function (senderEmail, destId, senderToken) {

        fuo = new FileUploadOptions();
        fuo.fileKey = "file";
        fuo.fileName = photo.substr(photo.lastIndexOf('/') + 1);
        fuo.mimeType = "image/jpeg";

        params = {};
        params.email = senderEmail;
        params.u2 = destId;
        params.temps = 5;

        params.token = senderToken;

        if (params.temps < 1) {
            params.temps = 1;
        }

        fuo.params = params;

        ft = new FileTransfer();

        ft.upload(photo, encodeURI('http://remikel.fr/api.php?option=image'), win, fail, fuo);

        win = function (r) {
            console.log(r);
            console.log('win');
        };
        fail = function (error) {
            console.log(error);
            console.log('fail');
        };
    };

    $scope.send = function () {

        if (idTab.length > 0) {

            for (i = 0; i < idTab.length; i = i + 1) {

                sendSnap(sessionStorage.getItem('email'), idTab[i], 10, sessionStorage.getItem('token'));
            }

        } else {

            console.log('Veuillez choisir un destinataire.');
        }
    };

    getSnap = function () {

        $http({
            method  : 'POST',
            url     : 'http://remikel.fr/api.php?option=newsnap',
            data    : {'email': sessionStorage.getItem('email'), 'token': sessionStorage.getItem('token')}
        })
            .success(function (data) {

                console.log(data);

                if (data.error) {
              // if not successful, bind errors to error variables
                    console.log(data.error);
                } else {
              // if successful, bind success message to message
                    console.log('Requête arrivée !');
                    if (data.data.length > 0) {

                        document.getElementById('viewSnapButton').style.display = "block";
                        $scope.myNewSnap = data.data;
                        dataSnap = $scope.myNewSnap;
                        console.log($scope.myNewSnap);
                    }
                }
            }).error(function (data, status) {
                console.log(status);
                console.log(data);
            });
    };
    getSnap();
    setInterval(function () {
        getSnap();
    }, 30000);

    $scope.viewSnap = function () {

        if ($scope.myNewSnap.length > 0) {

            $location.path('/snap');

        } else {

            $location.path('/home');
            document.getElementById('viewSnapButton').style.display = "none";
        }
    };
});

app.controller('mySnapController', function ($http, $location) {

    console.log('mySnapController');
    console.log(dataSnap);

    snapIsView = function (snapId) {

        $http({
            method  : 'POST',
            url     : 'http://remikel.fr/api.php?option=vu',
            data    : {'email': sessionStorage.getItem('email'), 'token': sessionStorage.getItem('token'), 'id': snapId}
        })
            .success(function (data) {

                console.log(data);

                if (data.error) {
              // if not successful, bind errors to error variables
                    console.log(data.error);
                } else {
              // if successful, bind success message to message
                    console.log('Snap vu');
                    interval();
                }
            }).error(function (data, status) {
                console.log(status);
                console.log(data);
            });
    };

    if (dataSnap.length > j) {

        document.getElementById('thisSnap').src = dataSnap[j].url;

        snapTime = dataSnap[j].temps * 1000;

        interval = setInterval(function () {
            if (dataSnap.length > j - 1) {

                document.getElementById('thisSnap').src = dataSnap[j].url;

                snapTime = dataSnap[j].temps * 1000;

                snapIsView(dataSnap[j].id);
                j = j + 1;

            } else {

                j = 0;
                document.getElementById('thisSnap').src = '';
                $location.path('/home');
            }
        }, snapTime);

    } else {

        j = 0;
        document.getElementById('thisSnap').src = '';
        $location.path('/home');
    }

    returnHome = function () {
        $location.path('/home');
    };
});