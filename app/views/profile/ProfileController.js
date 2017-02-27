angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {
        $stateProvider
            .state("profile", {
                parent: 'root',
                abstract: true,
                url: '/profile',
                template: "<ui-view></ui-view>",
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    }]);