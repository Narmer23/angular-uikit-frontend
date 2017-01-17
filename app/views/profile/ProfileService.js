/**
 * Created by Manuel on 27/09/2016.
 */
angular.module('services').factory('ProfileService', function ($q, $http, Conf) {
    var profileService = {};
        
    profileService.patchUser = function (userUpdate) {
        return $q(function (resolve, reject) {
            $http({
                method: "PATCH",
                url: Conf.basePath + "/self",
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
    
    profileService.modifyUser = function (userUpdate) {
        return $q(function (resolve, reject) {
            $http({
                method: "PUT",
                url: Conf.basePath + "/self",
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

    return profileService;
});