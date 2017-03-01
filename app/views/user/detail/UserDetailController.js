angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("user.detail", {
                url: '/detail/:userId',
                controller: 'UserDetailController',
                controllerAs: "vm",
                templateUrl: "views/user/detail/userDetail.html",
                resolve: {
                    User: function ($stateParams, UserService) {
                        return UserService.getById($stateParams.userId)
                    },
                    UserRoles: function (UserService) {
                        return UserService.getRoles();
                    }
                },
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
    }])
    .controller("UserDetailController",['$state', 'User', 'UserRoles', 'Upload','UserService', 'Conf', function ($state, User, UserRoles, Upload, UserService, Conf) {

        var vm = this;
        vm.user = User;
        vm.newRole = null;
        vm.roles = UserRoles;

        vm.userUpdate = {
            name: vm.user.name,
            email: vm.user.email,
            firstName: vm.user.firstName,
            lastName: vm.user.lastName,
            roles: vm.user.roles
        };


        vm.save = function (userUpdate) {
            if (vm.newAvatar) {
                Upload.upload({
                    url: Conf.basePath + '/userAttachments/user/' + vm.user.id + '/avatar',
                    data: {file: vm.newAvatar}
                }).then(function () {
                    sendUpdate(userUpdate);
                }, function (error) {
                    console.log(error);
                });
            } else {
                sendUpdate(userUpdate);
            }
        };

        function sendUpdate(userUpdate) {
            UserService.patch(userUpdate, vm.user.id).then(function (data) {
                UIkit.notify({
                    message: "<i class='uk-icon-info-circle'></i> User updated",
                    status: 'info',
                    timeout: 2000,
                    pos: 'top-center'
                });
                $state.go("user.list");
            }, function (err) {
                console.log(err);
            })
        }

        if (vm.user.avatar) {
            vm.avatarUrl = Conf.basePath + '/attachments/' + vm.user.avatar.id + '/content'
        }

        vm.uploadAvatar = function (file) {
            vm.newAvatar = file[0];
            vm.avatarUrl = window.URL.createObjectURL(vm.newAvatar);
        };

        vm.removeAvatar = function () {
            vm.newAvatar = null;
            vm.avatarUrl = null;
            delete vm.userUpdate.avatar;
            window.URL.revokeObjectURL(vm.avatarUrl);
        };

        vm.toggleRole = function (role) {
            var index = vm.userUpdate.roles.indexOf(role);
            if (index < 0) {
                vm.userUpdate.roles.push(role);
            }
            else {
                vm.userUpdate.roles.splice(index, 1);
            }
        };
        vm.addNewRole = function(newRole){
            var index = vm.userUpdate.roles.indexOf(newRole);
            if (index < 0) {
                vm.userUpdate.roles.push(newRole);
                vm.roles.push(newRole);
            }
            vm.newRole = null;
        }

    }]);