angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("login", {
                url: '/login',
                templateUrl: "views/login/login.html",
                controller: 'LoginController',
                controllerAs: "vm",
                data: {
                    authorizedRoles: [USER_ROLES.anonymous]
                }
            })
    }])
    .controller("LoginController", ['$state', 'AuthService', 'InitUser', 'Conf', function ($state, AuthService, InitUser, Conf) {

        var vm = this;

        vm.login = function(credentials){
            AuthService.login(credentials.username, credentials.password).then(function(data){
                angular.module('initialConfigModule').constant('InitUser', {
                    user: data,
                    isLoggedIn: true
                });
                $state.go(Conf.landing);
            },
            function (error) {
                vm.loginError = true;
            })
        }
                        
    }]);