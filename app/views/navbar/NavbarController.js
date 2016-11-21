/**
 * Created by Manuel on 16/11/2016.
 */
angular.module('app')
    .controller("NavbarController", function ($state, User, AuthService, Conf) {
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
            return Conf.basePath + '/attachments/' + user.avatar.id + '/content';
        };
        
    });