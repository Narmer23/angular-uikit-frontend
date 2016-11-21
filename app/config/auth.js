angular.module('authModule', [])

.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    })
    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'authModule:notAuthenticated',
        notAuthorized: 'authModule:notAuthorized'
    })
    .constant('USER_ROLES', {
        anonymous: 'anonymous',
        phase_master: "phase_master",
        admin: "admin",
        holonix: "holonix",
        user: "user",
        production_manager: "production_manager",
        operator: "operator",
        order_reader: "order_reader"
    })
    .run(function ($rootScope, AUTH_EVENTS, AuthService, USER_ROLES, Conf) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
            //if not defined emit notAuthorized
            if (!next || !next.data || !next.data.authorizedRoles) {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
            var authorizedRoles = next.data.authorizedRoles;
            if (authorizedRoles.indexOf(USER_ROLES.anonymous) < 0) {
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            }else{
                if(next.name==Conf.login && AuthService.isAuthenticated()){
                    event.preventDefault();
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                }
                
            }
        });
    })
    .directive('authorizedRoles', function ($rootScope, AuthService) {
        return{
            restrict: 'A',
            link: function (scope, element, attr) {
                $rootScope.$watch(function() {
                    var authorizedRoles = attr.authorizedRoles.split(" ");
                    if (AuthService.isAuthenticated() && AuthService.isAuthorized(authorizedRoles)) {
                        element.removeClass("ng-hide");
                    } else {
                        element.addClass("ng-hide");
                    }
                });
            }
        };
    });
;