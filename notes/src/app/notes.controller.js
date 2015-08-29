///<reference path="../d.ts/angularjs/angular.d.ts"/>
///<reference path="../d.ts/angular-material/angular-material.d.ts"/>
require("ng");
var app;
(function (app) {
    'use strict';
    var NotesController = (function () {
        function NotesController($log, notesService, $mdDialog, $mdToast) {
            this.$log = $log;
            this.notesService = notesService;
            this.$mdDialog = $mdDialog;
            this.$mdToast = $mdToast;
            this.addNote = this.notesService.addNote;
            this.deleteNote = this.notesService.deleteNote;
            this.renameNoteDialog = this._renameNoteDialog;
            this.confirmDelete = this._confirmDelete;
            this.notes = this.notesService.getNotes();
        }
        /////////////////////
        NotesController.prototype._renameNoteDialog = function (ev, index) {
            var nameDialog = this.$mdDialog.show({
                controller: function ($mdDialog) { this.$mdDialog = $mdDialog; },
                controllerAs: 'dialog',
                templateUrl: 'parts/namedialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (newName) {
                this.notesService.renameNote(index, newName);
            }.bind(this), function () { });
        };
        NotesController.prototype._confirmDelete = function (ev, index) {
            var confirm = this.$mdDialog.confirm()
                .title('Delete note?')
                .content('Are you sure you want to delete this note?')
                .ariaLabel('Delete note')
                .ok('OK')
                .cancel('Cancel')
                .targetEvent(ev);
            this.$mdDialog.show(confirm).then(function () {
                var name = this.notes[index].name;
                this.notesService.deleteNote(index);
                this.$mdToast.show(this.$mdToast.simple()
                    .content('"' + name + '" deleted')
                    .position('top right')
                    .hideDelay(3000));
            }.bind(this), function () { });
        };
        /////////////////////
        NotesController.$inject = ['$log', 'notesService', '$mdDialog', '$mdToast'];
        return NotesController;
    })();
    /////////////////////////
    angular
        .module('app')
        .controller('app.NotesController', NotesController);
})(app || (app = {}));
