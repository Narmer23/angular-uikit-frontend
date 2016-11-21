/**
 * Created by Manuel on 27/09/2016.
 */
angular.module('services').factory('ExampleService', function ($q, $http, Conf) {
    var exampleService = {};

    var filter = {
        codes: [],
        page: 0,
        pageSize: 20
    };

    var filtersTags = [];
    var tagColors = ['#4FBD88', '#508BB1', '#FFBD6B', '#FF916B', '#2DAC6F', '#30739E']; //TAG color for each field

    exampleService.getFilter = function () {
        return filter;
    };
    exampleService.getFilterTags = function () {
        return filtersTags;
    };

    exampleService.addFilter = function (label, property, value) {
        var i = 0;
        for (var key in filter) {
            i++;
            if (filter.hasOwnProperty(key) && key === property) {
                filter[key].push(value);
                filtersTags.push({label: label, code: property, value: value, color: tagColors[i]});
                break;
            }
        }
    };

    exampleService.removeFilter = function (tag) {
        for (var key in filter) {
            if (filter.hasOwnProperty(key) && key === tag.code) {
                var index = filter[key].indexOf(tag.value);
                filter[key].splice(index, 1);
                index = filtersTags.indexOf(tag);
                filtersTags.splice(index, 1);
                break;
            }
        }
    };

    exampleService.getAll = function () {
        return $q(function (resolve, reject) {
            resolve([
                {
                    code: "EX_1",
                    name: "Example 1"
                },
                {
                    code: "EX_2",
                    name: "Example 2"
                },
                {
                    code: "EX_3",
                    name: "Example 3"
                },
                {
                    code: "EX_4",
                    name: "Example 4"
                }
            ]);
        });

        /*return $q(function (resolve, reject) {
         $http({
         method: "GET",
         url: Conf.basePath + "/lab/examples/dto",
         params: filter
         }).then(
         function (resp) {
         resolve(resp.data);
         },
         function (resp) {
         reject(resp.data);
         }
         );
         });*/
    };

    exampleService.count = function () {

        return $q(function (resolve, reject) {
            resolve(4);
        });

        /*return $q(function (resolve, reject) {
         $http({
         method: "GET",
         url: Conf.basePath + "/examples/dto/count",
         params: filter
         }).then(
         function (resp) {
         resolve(resp.data);
         },
         function (resp) {
         reject(resp.data);
         }
         );
         });*/
    };

    exampleService.getById = function (exampleId) {
        return $q(function (resolve, reject) {
            resolve({code: "EX_1", name: "Example 1"});
        });

        /*return $q(function (resolve, reject) {
         $http({
         method: "GET",
         url: Conf.basePath + "/examples/dto/{exampleId}".replace("{exampleId}", exampleId)
         }).then(
         function (resp) {
         resolve(resp.data);
         },
         function (resp) {
         reject(resp.data);
         }
         );
         });*/
    };

    exampleService.post = function (data) {
        return $q(function (resolve, reject) {
            resolve({code: "EX_1", name: "Example 1"});
        });
        /*return $q(function (resolve, reject) {
         $http({
         method: "POST",
         url: Conf.basePath + "/examples/dto",
         data: data
         }).then(
         function (resp) {
         resolve(resp.data);
         },
         function (resp) {
         reject(resp.data);
         }
         );
         });*/
    };

    return exampleService;
});