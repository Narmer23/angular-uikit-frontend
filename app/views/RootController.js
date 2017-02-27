angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("root", {
                parent: "app",
                views: {
                    "menu": {
                        templateUrl: "views/menu/menu.html",
                        controller: 'MenuController',
                        controllerAs: 'vm'
                    },
                    "navbar": {
                        templateUrl: "views/navbar/navbar.html",
                        controller: 'NavbarController',
                        controllerAs: 'vm',
                        resolve: {
                            User: function(AuthService){
                                return AuthService.getUser();
                            }
                        }
                    },
                    "content": {
                        template: "<ui-view></ui-view>",
                        controller: 'RootController',
                        controllerAs: 'vm'
                    }
                },
                abstract: true,
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    }])
    .controller("RootController", function () {
        var vm = this;        
        
    });