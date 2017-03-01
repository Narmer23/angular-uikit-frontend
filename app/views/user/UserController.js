angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {
        $stateProvider
            .state("user", {
                parent: 'root',
                abstract: true,
                url: '/user',
                template: "<ui-view></ui-view>",
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
    }]);