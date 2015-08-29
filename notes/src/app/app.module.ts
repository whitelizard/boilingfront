///<reference path="../d.ts/angularjs/angular.d.ts"/>

module app {
    'use strict';
    
    angular.module('app', ['ngMaterial', 'ngRoute', 'mdThemeColors']);
    
    angular
        .module('app')
        .config(config)
    ;
    
    config.$inject = ['$routeProvider', '$mdThemingProvider'];
    
    function config($routeProvider, $mdThemingProvider) {
        $routeProvider
            .when('/', {
                controller: 'app.NotesController as notebook',
                templateUrl: 'parts/main.html'
            })
            .otherwise({ redirectTo: '/' });
            
        // Update the theme colors to use themes on font-icons
        $mdThemingProvider.theme('default')
            .primaryPalette('brown')
            .accentPalette('orange')
            .warnPalette('orange');
    }
    
}
