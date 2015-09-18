///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../typings/extra.d.ts"/>

module app {
    'use strict';

    interface IFrameworkController {
        appName:string;
    }

    /////////////////////////

    class FrameworkController implements IFrameworkController {
        
        //------ SETUP ------//

        static $inject = [];
        constructor() {}
        
        //------ MEMBERS ------//

        appName:string = 'Notes app';
        
        //------ METHODS ------//

    }
    
    /////////////////////////

    angular
        .module('app')
        .controller('app.FrameworkController', FrameworkController)
    ;
}
