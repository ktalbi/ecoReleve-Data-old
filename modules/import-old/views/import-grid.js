define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.paginator',
    'backgrid',
    'backgrid.paginator',
    'marionette',
    'moment',
    'radio',
    'text!modules2/import/templates/import-grid.html'
], function($, _, Backbone, PageableCollection, Backgrid, Paginator, Marionette, moment, Radio, template) {
    'use strict';
    return Marionette.ItemView.extend({
        template: template,
        className:'detailsImportPanel',
        events: {
            'click .backgrid-container tbody tr': 'updateMap',
            'click #btnSelectionGrid' : 'clearSelectedRows',
            'click table.backgrid td.editor' : 'cellToEdit'
        },
        cellToEdit : function(e) {
             var input = $(e.target).find('input')[0];
             $(input).attr('list','import-activity');
             
        },
        initialize: function(options) {
            this.radio = Radio.channel('import-gpx');
            this.collection = options.collections;  
            var Locations = PageableCollection.extend({
                //url: config.coreUrl + 'dataGsm/' + this.gsmID + '/unchecked?format=json',
                mode: 'client',
                state:{
                    pageSize: 10
                }
            });
            this.locations = new Locations();
            // add each model of the view collection to the pageableCollection
            var self = this;
            this.collection.each(function(model) {
                self.locations.add(model);
            });  
        },
        clearSelectedRows : function() {
            var importValue = true;
            var btnLabel ='clear selected';
            var self = this;
            var selected = $('#btnSelectionGrid button').attr('selectionVal');
            if (selected =='yes'){
                importValue = false;
                btnLabel ='select all';
                selected = 'no';
            }
            else{
                selected = 'yes';
            }
            this.collection.each(function(model) {
                model.set('import',importValue);
            });
            $('#btnSelectionGrid button').text(btnLabel);
            $('#btnSelectionGrid button').attr('selectionVal',selected);


        },
        updateGrid: function(id) {
            //console.log('detail' + id);
        },

        updateMap: function(evt) {
            if($(evt.target).is("td")) {
                var tr = $(evt.target).parent();
                var id = tr.find('td').first().text();
                var currentModel = this.locations.findWhere({id: Number(id)});
                console.log(currentModel);
                Radio.channel('import-gpx').command('updateMap', currentModel);
                // unselect rows and select clicked row
                $('table.backgrid tr').removeClass('backgrid-selected-row');
                $(tr).addClass('backgrid-selected-row');
            }
        },

        onShow: function() {
            var myCell = Backgrid.NumberCell.extend({
                decimals: 5
            });
            var columns = [{
                name: "id",
                label: "ID",
                editable: false,
                renderable: true,
                cell: "integer"
            }, {
                name: "name",
                label: "Name",
                editable: false,
                cell: "string"
            }, {
                name: "waypointTime",
                label: "Date",
                editable: false,
                cell: Backgrid.DatetimeCell  //"Date"
            }, {
                editable: false,
                name: "latitude",
                label: "LAT",
                cell: myCell
            }, {
                editable: false,
                name: "longitude",
                label: "LON",
                cell: myCell
            }, /* {
                editable: true,
                name: "fieldActivity",
                label: "Field Activity",
                cell: "string"
            },*/
            {
                editable: true,
                name: "import",
                label: "Import",
                cell: "boolean"
            }];

            // Initialize a new Grid instance
            this.grid = new Backgrid.Grid({
                columns: columns,
                collection: this.locations
            });

            this.$el.find("#locations").append(this.grid.render().el);

            // Initialize a new Paginator instance
            this.paginator = new Backgrid.Extension.Paginator({
                collection: this.locations
            });

            this.$el.append(this.paginator.render().el);
            /*var height = $(window).height() -
                $('#header-region').height() - this.paginator.$el.height() -
                $('#info-container').outerHeight();
            this.$el.height(height);*/
            //this.locations.fetch({reset: true});
        },
    });
});