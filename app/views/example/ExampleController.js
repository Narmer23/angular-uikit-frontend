angular.module('app')
    .config(function($stateProvider, USER_ROLES) {
        $stateProvider
            .state("example", {
                parent: 'root',
                abstract: true,
                url: '/example',
                template: "<ui-view></ui-view>",
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    });