angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("user.new", {
                url: '/new',
                controller: 'UserNewController',
                controllerAs: "vm",
                templateUrl: "views/user/new/userNew.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    UserRoles: function (UserService) {
                        return UserService.getRoles();
                    }
                }
            })
    }])
    .controller("UserNewController", ['$rootScope', 'UserService', 'UserRoles', '$state', 'Conf', 'Upload', function ($rootScope, UserService, UserRoles, $state, Conf, Upload) {

        var vm = this;

        vm.roles = UserRoles;
        vm.newRole = null;
        vm.userRegistration = {
            roles: []
        };

        vm.save = function (userRegistration) {
            UserService.register(userRegistration).then(function (data) {
                UIkit.notify({
                    message: "<i class='uk-icon-info-circle'></i> User created",
                    status: 'info',
                    timeout: 2000,
                    pos: 'top-center'
                });
                if (vm.newAvatar) {
                    Upload.upload({
                        url: Conf.basePath + '/userAttachments/user/' + data.id + '/avatar',
                        data: {file: vm.newAvatar}
                    }).then(function () {
                        $state.go('user.list');
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    $state.go('user.list');
                }
            }, function (err) {
                console.log(err);
            });
        };

        vm.uploadAvatar = function (file) {
            vm.newAvatar = file[0];
            vm.avatarUrl = window.URL.createObjectURL(vm.newAvatar);
        };

        vm.removeAvatar = function () {
            vm.newAvatar = null;
            vm.avatarUrl = null;
            delete vm.userRegistration.avatar;
            window.URL.revokeObjectURL(vm.avatarUrl);
        };

        vm.toggleRole = function (role) {
            var index = vm.userRegistration.roles.indexOf(role);
            if (index < 0) {
                vm.userRegistration.roles.push(role);
            }
            else {
                vm.userRegistration.roles.splice(index, 1);
            }
        };
        vm.addNewRole = function(newRole){
            var index = vm.userRegistration.roles.indexOf(newRole);
            if (index < 0) {
                vm.userRegistration.roles.push(newRole);
                vm.roles.push(newRole);
            }
            vm.newRole = null;
        }

    }]);