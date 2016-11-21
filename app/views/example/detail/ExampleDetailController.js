angular.module('app')
    .config(function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("example.detail", {
                url: '/detail/:exampleId',
                controller: 'ExampleDetailController',
                controllerAs: "vm",
                templateUrl: "views/example/detail/exampleDetail.html",
                resolve: {
                    Example: function ($stateParams, ExampleService) {
                        return ExampleService.getById($stateParams.exampleId)
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    })
    .controller("ExampleDetailController", function (Example) {

        var vm = this;

        vm.example = Example;
        vm.samples = Example.samples;
        vm.basePath = Conf.basePath;
        
    });