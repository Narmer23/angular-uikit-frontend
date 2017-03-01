"use strict";

import angular from 'angular';
import './sass/app.scss';


angular.element(document).ready(
    function () {
        var initInjector = angular.injector(['ng']);

        var $timeout = initInjector.get('$timeout');
        var $http = initInjector.get('$http');
        var $q = initInjector.get('$q');

        var deviceReady = $q(function (resolve, reject) {
            if (window.cordova) {
                document.addEventListener('deviceready', function () {
                    resolve();
                }, false);
            } else {
                resolve();
            }
        });

        var Conf = {
            basePath: env.basePath,
            landing: "example.list",
            login: "login"
        };

        angular.module('initialConfigModule', []).constant("Conf", Conf);


        deviceReady.then(function () {
            $http({
                url: Conf.basePath + "/self",
                withCredentials: true
            }).then(function (resp) {

                var user = resp.data;

                angular.module('initialConfigModule').constant('InitUser', {
                    user: user,
                    isLoggedIn: true
                });
                angular.bootstrap(document, ['app']);
            }, function () {
                angular.module('initialConfigModule').constant('InitUser', {
                    user: null,
                    isLoggedIn: false
                });
                angular.bootstrap(document, ['app']);
            });
        });
    }
);

import 'uikit';
import 'uikit/dist/js/components/pagination.js';
import 'uikit/dist/js/components/notify.js';
import 'angular-ui-router';
import 'angular-uikit';
import 'ng-file-upload';


angular.module('app', [
    'initialConfigModule',
    'translateModule',
    'ui.router',
    'angularUikit',
    'ngFileUpload',
    'authModule',
    'services',
    'directives',
    'filters'
])
    .config(['$httpProvider', '$compileProvider', '$urlRouterProvider', 'Conf', function ($httpProvider, $compileProvider, $urlRouterProvider, Conf) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.timeout = 10000;
        $compileProvider.debugInfoEnabled(false);
        $urlRouterProvider.otherwise(Conf.login);
    }])
    .config(['$stateProvider', 'USER_ROLES', function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("app", {
                abstract: true,
                url: '/app',
                templateUrl: "views/root.html",
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('ErrorInterceptor');
            }
        ]);
        $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
            var ajaxCall = 0;
            return {
                request: function (config) {
                    if (!config.withoutLoader) {
                        ajaxCall++;
                        if (ajaxCall == 1) {
                            $rootScope.$broadcast('loader:show');
                        }
                    }
                    return config;
                },
                response: function (response) {
                    if (!response.config.withoutLoader) {
                        ajaxCall--;
                        if (ajaxCall <= 0) {
                            $rootScope.$broadcast('loader:hide');
                        }
                    }
                    return response;
                },
                responseError: function (response) {
                    if (!response.config.withoutLoader) {
                        ajaxCall--;
                        if (ajaxCall <= 0) {
                            $rootScope.$broadcast('loader:hide');
                        }
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }])
    .factory('ErrorInterceptor',['$rootScope', '$q', function ($rootScope, $q) {
        return {
            responseError: function (response) {

                if ([500, 404, 400].indexOf(response.status) >= 0) {
                    $rootScope.$broadcast("httpError", response);
                    $rootScope.$broadcast('loader:hide');
                }

                return $q.reject(response);
            }
        };
    }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            event.preventDefault();
            console.log(error);
        });
    }]);
angular.module('services', []);
angular.module('directives', []);
angular.module('filters', []);


function requireAll(r) {
    r.keys().forEach(r); 
}
requireAll(require.context('./', true, /\.js$/));