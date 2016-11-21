angular.module('app')
    .config(function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("example.list", {
                url: '/list',
                controller: 'ExampleListController',
                controllerAs: "vm",
                templateUrl: "views/example/list/exampleList.html",
                data: {
                    authorizedRoles: [USER_ROLES.user]
                },
                resolve: {
                    Examples: function (ExampleService) {
                        return ExampleService.getAll();
                    },
                    ExamplesLength: function (ExampleService) {
                        return ExampleService.count();
                    }
                }
            })
    })
    .controller("ExampleListController", function (ExampleService, Examples, ExamplesLength, Conf) {

        var vm = this;
        vm.examples = Examples;
        vm.examplesLength = ExamplesLength;
        vm.filter = ExampleService.getFilter();
        vm.basePath = Conf.basePath;
                
        vm.filterTags = ExampleService.getFilterTags();

        vm.addFilter = function(label, property, value){
            ExampleService.addFilter(label, property, value);
            vm.resetFilterInputs();
            vm.changePage(0);
        };

        vm.resetFilterInputs = function() {
            vm.application = null;
            vm.material = null;
            vm.rl = null;
            vm.segment = null;
            vm.effect = null;
            vm.product = null;
        };
        
        vm.removeFilter = function(tag){
            ExampleService.removeFilter(tag);
            vm.changePage(0);
        };
        
        vm.changePage = function(pageIndex){
            vm.filter.page = pageIndex;
            ExampleService.getAll().then(function(data){
                vm.examples = data;
            });
            ExampleService.count().then(function(data){
               vm.examplesLength = data; 
            });
        };
    });

