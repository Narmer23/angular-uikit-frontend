angular.module('app')
    .config(function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("profile.modify", {
                url: '/modifyProfile',
                controller: 'ModifyProfileController',
                controllerAs: "vm",
                templateUrl: "views/profile/modify/modifyProfile.html",
                data: {
                    authorizedRoles: [USER_ROLES.user]
                }
            })
    })
    .controller("ModifyProfileController", function ($rootScope, ProfileService, AuthService, $state, Conf, Upload) {

        var vm = this;
        vm.user = AuthService.getUser();
        vm.userUpdate = {
            email: vm.user.email,
            firstName: vm.user.firstName,
            lastName: vm.user.lastName
        };

        vm.changePassword = {};

        vm.save = function (userUpdate) {
            if (vm.changePassword.currentPassword && vm.changePassword.newPassword) {
                vm.userUpdate.newPassword = vm.changePassword.newPassword;
                vm.userUpdate.currentPassword = vm.changePassword.currentPassword;
            }
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
            ProfileService.patchUser(userUpdate).then(function (data) {
                AuthService.setUser(data);
                UIkit.notify({
                    message: "<i class='uk-icon-info-circle'></i> Profile updated",
                    status: 'info',
                    timeout: 2000,
                    pos: 'top-center'
                });
                $rootScope.$broadcast("user:profileChanged");
                $state.go(Conf.landing);
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

    });