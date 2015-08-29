///<reference path="../d.ts/angularjs/angular.d.ts"/>

module app {
    'use strict';

    interface IFrameworkController {
        appName:string;
    }

    /////////////////////////

    class FrameworkController implements IFrameworkController {

        static $inject = [];
        constructor() {}

        appName:string = 'Notes app';

    }
    
    /////////////////////////

    angular
        .module('app')
        .controller('app.FrameworkController', FrameworkController)
    ;
}
