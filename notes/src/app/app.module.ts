///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../typings/extra.d.ts"/>

var angular:ng.IAngularStatic = require('angular');

module app {
    'use strict';
    
    angular.module('app', [require('angular-material'), require('angular-route'), 'mdThemeColors']);
    
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
        
        $mdThemingProvider.theme('default')
            .primaryPalette('brown')
            .accentPalette('orange')
            .warnPalette('orange');
    }
    
}
