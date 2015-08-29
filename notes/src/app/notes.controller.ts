///<reference path="../d.ts/angularjs/angular.d.ts"/>
///<reference path="../d.ts/angular-material/angular-material.d.ts"/>

// import "ng";

module app {
    'use strict';
	
	interface INotesController {
    
		notes: INote[];
		newNoteName: string;
		
        saveChange: ()=>void;
        addNote: (ev:ng.IAngularEvent, name:string)=>void;
        deleteNote: (index:number)=>void;
		renameNoteDialog: (ev:ng.IAngularEvent, index:number)=>void
		confirmDelete: (ev:ng.IAngularEvent, index:number)=>void
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
		newNoteName:string;
        
        //------ METHODS ------//
		
		saveChange():void {
			this.notesService.storeNotes();
		}
        
        // addNote(name:string):void {
			// this.notesService.addNote(name);
			// this.newNoteName = '';
		// }
        
        addNote(ev:ng.IAngularEvent):void {
            var nameDialog:ng.IPromise<void> = this.$mdDialog.show({
                // controller: function ($mdDialog, title) { this.$mdDialog = $mdDialog; this.title = title; },
                controller: NameDialogController,
                controllerAs: 'dialog',
                templateUrl: 'parts/namedialog.html',
                // parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: { title: 'Create new note' }
            })
            .then(function (name) {
                this.notesService.addNote(name);
            }.bind(this), function () {});
		}
        
        deleteNote(index:number):void {
			this.notesService.deleteNote();
		}
        
        renameNoteDialog(ev:ng.IAngularEvent, index:number):void {
            var nameDialog:ng.IPromise<void> = this.$mdDialog.show({
                // controller: function ($mdDialog, title) { this.$mdDialog = $mdDialog; this.title = title; },
                controller: NameDialogController,
                controllerAs: 'dialog',
                templateUrl: 'parts/namedialog.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: { title: 'Rename note' }
            })
            .then(function (newName) {
                this.notesService.renameNote(index, newName);
            }.bind(this), function () {});
        }
        
        confirmDelete(ev:ng.IAngularEvent, index:number):void {
            var confirm:ng.IPromise<void> = this.$mdDialog.confirm()
                .title('Delete note?')
                .content('Are you sure you want to delete this note?')
                .ariaLabel('Delete note')
                .ok('OK')
                .cancel('Cancel')
                .targetEvent(ev);
            this.$mdDialog.show(confirm).then(function () {
                var name:string = this.notes[index].name;
                this.notesService.deleteNote(index);
                this.$mdToast.show(
                    this.$mdToast.simple()
                        .content('"'+name+'" deleted')
                        .position('top right')
                        .hideDelay(3000)
                );
            }.bind(this), function () {});
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
