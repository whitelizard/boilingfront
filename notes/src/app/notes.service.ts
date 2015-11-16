///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../typings/extra.d.ts"/>

module app {
    'use strict';

    export interface INote {
        name: string;
        text: string;
    }
    
    interface INotesService {
    
        localStorageAddress: string;
        
        getNotes():INote[];
        addNote(name:string):void;
        deleteNote(index:number):void;
        renameNote(index:number, name:string):void;
        storeNotes():void;
    }

    /////////////////////////
    
    class NotesService implements INotesService {
        
        //------ SETUP ------//

        static $inject = ['$log', '$timeout'];
        
        constructor(public $log, public $timeout) {
            if (angular.isDefined(localStorage[this.localStorageAddress])) {
                try {
                    var storedNotes = angular.fromJson(localStorage[this.localStorageAddress]);
                } catch (e) {
                    this.$log.debug(e);
                }
                if (angular.isArray(storedNotes) && angular.isObject(storedNotes[0])) {
                    this.notes = storedNotes;
                }
            }
        }
        
        //------ MEMBERS ------//
        
        localStorageAddress:string = 'se.whitelizard.notes';
        private notes:INote[] = [{name: 'Note 1', text: ''}];
        private saving:boolean = false;
        
        //------ METHODS ------//

        getNotes():INote[] {
            return this.notes;
        }

        addNote(name:string):void {
            this.notes.push({name:name, text:''});
            this.$log.debug('Note created');
            this.storeNotes();
        }

        deleteNote(index:number):void {
            this.notes.splice(index, 1);
            this.$log.debug('Note deleted');
            this.storeNotes();
        }

        renameNote(index:number, name:string):void {
            this.notes[index].name = name;
            this.storeNotes();
        }

        storeNotes():void {
            if (this.saving) return;
            this.saving = true;
            this.$timeout(angular.bind(this, function () {  // Delay save to never save more often than every 2s
                localStorage[this.localStorageAddress] = angular.toJson(this.notes);
                this.$log.debug('Notes stored');
                this.saving = false;
            }), 2000, false);
        }

        exportNotes():void {
            console.log('exportNotes');
        }

    }
    
    /////////////////////////

    angular
        .module('app')
        .factory('notesService', factory)
    ;

    factory.$inject = ['$log', '$timeout'];

    function factory($log, $timeout) {
        return new NotesService($log, $timeout);
    }
}
