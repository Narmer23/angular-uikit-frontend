angular.module('services').factory('AuthService', ['$q', '$timeout', 'InitUser', '$http', 'Conf', function ($q, $timeout, InitUser, $http, Conf) {
    var authService = {};

    authService.user = InitUser.user;
    authService.isLoggedIn = InitUser.isLoggedIn;

    authService.login = function (username, password) {

        return $q(function (resolve, reject) {
            $http({
                method: "POST",
                url: Conf.basePath + "/login",
                data: {
                    username: username,
                    password: password
                }
            }).then(function (resp) {
                authService.user = resp.data.user;
                authService.isLoggedIn = true;
                resolve(authService.user);
            }, function () {
                authService.user = null;
                authService.isLoggedIn = false;
                reject();
            });
        });
    };

    authService.logout = function () {
        return $q(function (resolve, reject) {
            $http({
                method: "DELETE",
                url: Conf.basePath + "/logout"
            }).then(function () {
                authService.user = null;
                authService.isLoggedIn = false;
                resolve();
            }, function () {
                reject();
            });
        });
    };

    authService.getUser = function () {
        return authService.user;
    };

    authService.setUser = function (user) {
        authService.user = user;
    };
    
    authService.isAuthenticated = function () {
        return authService.isLoggedIn;
    };

    authService.isAuthorized = function (authorizedRoles) {

        if (authorizedRoles === null || authorizedRoles === undefined) {
            return true;
        }

        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        if (!authService.isAuthenticated()) {
            return false;
        }
        if (!authService.getUser()) {
            return false;
        }

        var hasRole = false;
        authService.getUser().roles.forEach(function (role) {
            if (authorizedRoles.indexOf(role) >= 0) {
                hasRole = true;
            }
        });
        return hasRole;
    };

    return authService;
}]);