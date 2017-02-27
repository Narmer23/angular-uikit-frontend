angular.module('app').directive('onEnter', ['$timeout', function($timeout) {
    return {
        scope: {
            onEnter: "&"
        },
        link: function(scope, element, attrs) {
            element.on("keydown keypress", function(event) {
                if(event.which === 13) {
                    event.preventDefault();
                    $timeout(function() {
                        scope.onEnter();
                    });
                }
            });
        }
    };
}]);