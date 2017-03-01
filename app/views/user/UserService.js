/**
 * Created by Manuel on 27/09/2016.
 */
angular.module('services').factory('UserService', ['$q', '$http', 'Conf', function ($q, $http, Conf) {
    var userService = {};

    var filter = {
        names: [],
        roles: [],
        page: 0,
        pageSize: 20
    };

    var filtersTags = [];
    var tagColors = ['#4FBD88', '#508BB1', '#FFBD6B', '#FF916B', '#2DAC6F', '#30739E']; //TAG color for each field

    userService.getFilter = function () {
        return filter;
    };
    userService.getFilterTags = function () {
        return filtersTags;
    };

    userService.addFilter = function (label, property, value) {
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

    userService.removeFilter = function (tag) {
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

    userService.getAll = function () {
        return $q(function (resolve, reject) {
            $http({
                method: "GET",
                url: Conf.basePath + "/users/dto"
            }).then(
                function (resp) {
                    resolve(resp.data);
                },
                function (resp) {
                    reject(resp.data);
                }
            );
        });
    };

    userService.getRoles = function () {
        return $q(function (resolve, reject) {
            $http({
                method: "GET",
                url: Conf.basePath + "/users/roles"
            }).then(
                function (resp) {
                    resolve(resp.data);
                },
                function (resp) {
                    reject(resp.data);
                }
            );
        });
    };

    userService.getById = function (userId) {
        return $q(function (resolve, reject) {
            $http({
                method: "GET",
                url: Conf.basePath + "/users/dto/{id}".replace("{id}", userId)
            }).then(
                function (resp) {
                    resolve(resp.data);
                },
                function (resp) {
                    reject(resp.data);
                }
            );
        });
    };

    userService.register = function (userRegistration) {
        return $q(function (resolve, reject) {
            $http({
                method: "POST",
                url: Conf.basePath + "/registration",
                data: userRegistration
            }).then(
                function (resp) {
                    resolve(resp.data);
                },
                function (resp) {
                    reject(resp.data);
                }
            );
        });
    };

    userService.modify = function (userUpdate, userId) {
        return $q(function (resolve, reject) {
            $http({
                method: "PUT",
                url: Conf.basePath + "/users/{id}".replace("{id}", userId),
                data: userUpdate
            }).then(
                function (resp) {
                    resolve(resp.data);
                },
                function (resp) {
                    reject(resp.data);
                }
            );
        });
    };
    
    userService.patch = function (userUpdate, userId) {
        return $q(function (resolve, reject) {
            $http({
                method: "PATCH",
                url: Conf.basePath + "/users/{id}".replace("{id}", userId),
                data: userUpdate
            }).then(
                function (resp) {
                    resolve(resp.data);
                },
                function (resp) {
                    reject(resp.data);
                }
            );
        });
    };

    return userService;
}]);