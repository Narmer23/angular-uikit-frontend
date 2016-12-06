"use strict"
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
            basePath: "http://<API_BASE_PATH>/api",
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


angular.module('app', [
    'initialConfigModule',
    'translateModule',
    'ui.router',
    'angularUikit',
    'authModule',
    'services',
    'directives',
    'filters'
])
    .config(function ($httpProvider, $compileProvider, $urlRouterProvider, Conf) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.timeout = 10000;
        $compileProvider.debugInfoEnabled(false);
        $urlRouterProvider.otherwise(Conf.login);
    })
    .config(function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("app", {
                abstract: true,
                url: '/app',
                templateUrl: "views/root.html",
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('ErrorInterceptor');
            }
        ]);
        $httpProvider.interceptors.push(function ($rootScope, $q) {
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
        });
    })
    .factory('ErrorInterceptor', function ($rootScope, $q) {
        return {
            responseError: function (response) {

                if ([401, 403].indexOf(response.status) < 0) {
                    $rootScope.$broadcast("httpError", response);
                    $rootScope.$broadcast('loader:hide');
                }

                return $q.reject(response);
            }
        };
    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            event.preventDefault();
            console.log(error);
        });
    })
;
angular.module('services', []);
angular.module('directives', []);
angular.module('filters', []);
