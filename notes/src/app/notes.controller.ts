///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../typings/extra.d.ts"/>

// import "ng";

module app {
    'use strict';
    
    interface INotesController {
    
        notes: INote[];
        
        saveChange():void;
        addNote(ev:ng.IAngularEvent, name:string):void;
        renameNoteDialog(ev:ng.IAngularEvent, index:number):void
        confirmDelete(ev:ng.IAngularEvent, index:number):void
    }

    /////////////////////////

    class NotesController implements INotesController {
        
        //------ SETUP ------//

        static $inject = ['$log', 'notesService', '$mdDialog', '$mdToast'];
        
        constructor(public $log, public notesService, public $mdDialog, public $mdToast) {
            this.notes = this.notesService.getNotes();
        }
        
        //------ MEMBERS ------//

        notes: INote[];
        private nameDialogSetup = {
            controller: NameDialogController,
            controllerAs: 'dialog',
            templateUrl: 'parts/namedialog.html',
            clickOutsideToClose: true
        };
        
        //------ INTERFACE IMPLEMENTATION ------//
        
        saveChange():void {
            this.notesService.storeNotes();
        }
        
        addNote(ev:ng.IAngularEvent):void {
            var dialogSetup = angular.merge({}, this.nameDialogSetup,
                {
                    targetEvent: ev,
                    locals: { title: 'Create new note' }
                }
            );
            this.$mdDialog.show(dialogSetup).then(
                function (name) {
                    if (angular.isString(name)) {
                        this.notesService.addNote(name);
                    }
                }.bind(this), 
                function () {}
            );
        }
        
        renameNoteDialog(ev:ng.IAngularEvent, index:number):void {
            var dialogSetup = angular.merge({}, this.nameDialogSetup,
                {
                    targetEvent: ev,
                    locals: { title: 'Rename note' }
                });
            this.$mdDialog.show(dialogSetup).then(
                function (newName) {
                    if (angular.isString(name)) {
                        this.notesService.renameNote(index, newName);
                    }
                }.bind(this), 
                function () {}
            );
        }
        
        confirmDelete(ev:ng.IAngularEvent, index:number):void {
            var confirm:ng.IPromise<void> = this.$mdDialog.confirm()
                .title('Delete note?')
                .content('Are you sure you want to delete this note?')
                .ariaLabel('Delete note')
                .ok('OK')
                .cancel('Cancel')
                .targetEvent(ev);
            this.$mdDialog.show(confirm).then(
                function () {
                    var name:string = this.notes[index].name;
                    this.notesService.deleteNote(index);
                    this.$mdToast.show(
                        this.$mdToast.simple()
                            .content('"'+name+'" deleted')
                            .position('top right')
                            .hideDelay(3000)
                    );
                }.bind(this), 
                function () {}
            );
        }
        
    }
    
    class NameDialogController {
        constructor(public $mdDialog, public title) {}
    }

    /////////////////////////

    angular
        .module('app')
        .controller('app.NotesController', NotesController)
    ;
}
