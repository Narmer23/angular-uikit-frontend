import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-interpolation-messageformat';

angular.module('translateModule', ['pascalprecht.translate']).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useMessageFormatInterpolation();
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/locale-',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.registerAvailableLanguageKeys(['it', 'en'], {
        'it_*': 'it',
        'en_*': 'en'
    }).determinePreferredLanguage().fallbackLanguage('en');

}]);