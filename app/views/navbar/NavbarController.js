/**
 * Created by Manuel on 16/11/2016.
 */
angular.module('app')
    .controller("NavbarController", function ($state, $scope, User, AuthService, ImageAttachmentService, Conf) {
        var vm = this;
        vm.user = User;

        vm.logout = function(){
            AuthService.logout().then(function () {
                $state.go(Conf.login);
            }, function () {
                UIkit.modal.alert("Logout failed.");
            });
        };

        vm.getAvatarPath = function(){
            return ImageAttachmentService.getAttachmentPath(vm.user.avatar);
        };

        $scope.$on("user:profileChanged", function(){
            vm.user = AuthService.getUser();
        })
        
    });