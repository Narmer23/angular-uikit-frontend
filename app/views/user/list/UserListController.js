angular.module('app')
    .config(['$stateProvider', 'USER_ROLES', function ($stateProvider, USER_ROLES) {
        $stateProvider
            .state("user.list", {
                url: '/list',
                controller: 'UserListController',
                controllerAs: "vm",
                templateUrl: "views/user/list/userList.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    Users: function (UserService) {
                        return UserService.getAll();
                    },
                    UserRoles: function (UserService) {
                        return UserService.getRoles();
                    },
                    CurrentUser: function (AuthService) {
                        return AuthService.getUser();
                    }
                }
            })
    }])
    .controller("UserListController", ['$q', '$translate', 'UserService', 'UserRoles', 'Users', 'Conf', 'CurrentUser', function ($q, $translate, UserService, UserRoles, Users, Conf, CurrentUser) {

        var vm = this;
        vm.users = Users;
        vm.currentUser = CurrentUser;
        vm.userRoles = UserRoles;
        vm.filter = UserService.getFilter();
        vm.basePath = Conf.basePath;

        vm.filterTags = UserService.getFilterTags();

        vm.addFilter = function (label, property, value) {
            UserService.addFilter(label, property, value);
            vm.resetFilterInputs();
            vm.changePage(0);
        };

        vm.resetFilterInputs = function () {
            vm.name = null;
            vm.role = null;
        };

        vm.removeFilter = function (tag) {
            UserService.removeFilter(tag);
            vm.changePage(0);
        };

        vm.changePage = function (pageIndex) {
            vm.filter.page = pageIndex;
            UserService.getAll().then(function (data) {
                vm.users = data;
            });
        };

        vm.toggleRole = function (user, role) {
            var index = user.roles.indexOf(role);
            if (index < 0) {
                user.roles.push(role);
            }
            else {
                user.roles.splice(index, 1);
            }
            user.touched = true;
        };

        vm.updateUsers = function (users) {
            var promises = [];
            users.forEach(function (user) {
                if (user.touched) {
                    delete user.touched;
                    promises.push(UserService.patch({roles: user.roles ? user.roles : []}, user.id));
                }
            });
            $q.all(promises).then(function () {
                UIkit.notify({
                    message: "<i class='uk-icon-info-circle'></i> " + $translate.instant('USER', {ACTION: 'updated', PLURAL:'true'}),
                    status: 'info',
                    timeout: 2000,
                    pos: 'top-center'
                });
            })
        };

        vm.usersNotTouched = function () {
            return vm.users.every(function (user) {
                return !user.touched;
            });
        }

    }]);

