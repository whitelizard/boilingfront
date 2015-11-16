///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../typings/extra.d.ts"/>

module app {
    'use strict';

    interface IFrameworkController {
        appName:string;

        moreOptions($event:ng.IAngularEvent):void;
    }

    /////////////////////////

    class FrameworkController implements IFrameworkController {
        
        //------ SETUP ------//

        static $inject = ['$mdBottomSheet'];

        constructor(public $mdBottomSheet) {}
        
        //------ MEMBERS ------//

        appName:string = 'Notes app';
        
        //------ INTERFACE IMPLEMENTATION ------//

        moreOptions($event:ng.IAngularEvent):void {
            this.$mdBottomSheet.show({
                templateUrl: 'parts/settings-sheet.html',
                controller: 'app.BottomDrawerController',
                controllerAs: 'bottomDrawer'
                targetEvent: $event
            }).then(
                function (ev, operation) {
                    switch (operation.id) {
                        case 'export':
                            exportDialog(ev);
                            break;
                    }
                    operation();
                }
            );
        }

        //------ PRIVATE METHODS ------//

        exportDialog(ev:ng.IAngularEvent):void {
            var dialogSetup = {
                targetEvent: ev,
                locals: { title: 'Export ' }
                controller: NameDialogController,
                controllerAs: 'dialog',
                templateUrl: 'parts/namedialog.html',
                clickOutsideToClose: true
            };
            this.$mdDialog.show(dialogSetup).then(
                function (name) {
                    if (angular.isString(name)) {
                        this.notesService.addNote(name);
                    }
                }.bind(this), 
                function () {}
            );
        }

    }

    class BottomDrawerController {

        //------ SETUP ------//

        static $inject = ['$mdBottomSheet', 'notesService'];

        constructor(public $mdBottomSheet, public notesService) {}
        
        //------ MEMBERS ------//
        
        operations:any[] = [
            {
                id: 'export',
                name: 'Export',
                icon: 'mdi-export',
                func: this.notesService.exportNotes
            }
        ];

        //------ INTERFACE IMPLEMENTATION ------//

        itemClick($event, operation):void {
            this.$mdBottomSheet.hide($event, operation);
        }

    }
    
    /////////////////////////

    angular
        .module('app')
        .controller('app.FrameworkController', FrameworkController)
        .controller('app.BottomDrawerController', BottomDrawerController)
    ;
}
