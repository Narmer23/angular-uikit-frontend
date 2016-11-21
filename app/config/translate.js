angular.module('translateModule', ["pascalprecht.translate"]).config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/locale-',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.registerAvailableLanguageKeys(['it'], {
        'it_*': 'it'
    }).determinePreferredLanguage().fallbackLanguage('it');

});