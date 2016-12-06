angular.module('app').directive('notAllowArrayDuplicate', function () {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            notAllowArrayDuplicate: "=?",
            callbackUrl: "&?" //TODO
        },
        link: function (scope, element, attrs, ngModelController) {

            ngModelController.$parsers.unshift(function (value) {
                var valid = !scope.notAllowArrayDuplicate.source.some(function (elem) {
                    var existingValue = elem[scope.notAllowArrayDuplicate.attribute];
                    if (existingValue && value)
                        return existingValue.toUpperCase() === value.toUpperCase();
                    return false;
                });

                ngModelController.$setValidity('duplicate', valid);
                return valid ? value : undefined;
            });

            ngModelController.$formatters.unshift(function (value) {
                ngModelController.$setValidity('duplicate', !scope.notAllowArrayDuplicate.source.some(function (elem) {
                    var existingValue = elem[scope.notAllowArrayDuplicate.attribute];
                    if (existingValue && value)
                        return existingValue.toUpperCase() === value.toUpperCase();
                    return false;
                }));
                return value;
            });
        }
    };
});