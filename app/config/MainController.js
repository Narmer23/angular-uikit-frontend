angular.module('app')
    .controller("MainController",['$scope', 'AUTH_EVENTS', '$state', 'AuthService', '$timeout', '$translate', 'Conf', function ($scope, AUTH_EVENTS, $state, AuthService, $timeout, $translate, Conf) {

        $scope.languageSelected = $translate.use();
        $scope.showCounter = 0;
        $scope.stateChange = 0;

        $scope.changeLanguage = function (lang) {
            $translate.use(lang).then(function (lang) {
                $scope.languageSelected = lang;
            });
        };

        $scope.$on('loader:show', function () {
            showLoader();
        });

        $scope.$on('loader:hide', function () {
            hideLoader();
        });


        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.resolve) {
                if ($scope.stateChange <= 0) {
                    showLoader();
                }
                $scope.stateChange++;
            }
        });
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.resolve) {
                hideLoader();
                $scope.stateChange = 0;
            }
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
            $state.go(Conf.login);
        });

        $scope.$on(AUTH_EVENTS.notAuthorized, function () {
            $state.go(Conf.landing)
        });

        $scope.$on("httpError", function (e, response) {
            var message = "[" + response.code + "] Errore";
            if (response.data && response.data.code) {
                message = "[" + response.data.code + "] " + response.data.message;
            }

            UIkit.notify({
                message: "<i class='uk-icon-warning'></i>" + message,
                status: 'danger',
                timeout: 5000,
                pos: 'top-center'
            });
        });


        function showLoader() {
            $scope.showCounter++;
            if ($scope.showCounter == 1) {
                $scope.loaderTimer = $timeout(function () {
                    if ($scope.showCounter > 0) {
                        $scope.inLoading = true;
                    }
                }, 200);
            }
        }

        function hideLoader() {
            $scope.showCounter--;
            if ($scope.showCounter <= 0) {
                $timeout.cancel($scope.loaderTimer);
                $scope.inLoading = false;
            }
        }
    }]);
