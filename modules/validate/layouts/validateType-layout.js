define([
    'jquery',
    'underscore',
    'marionette',
    'radio',
    'config',
    'text!modules2/validate/templates/tpl-validateType.html'
], function($, _, Marionette, Radio, config, template) {

    'use strict';

    return Marionette.LayoutView.extend({
        className: 'container no-padding',
        template: template,

        events: {
            'click table.backgrid tbody tr': 'showDetail'
        },

        initialize: function(options) {
            this.type=options.type;


            var Data = Backbone.Collection.extend({
                url: config.coreUrl + 'dataGsm/unchecked/list',
            });

            var data = new Data();

            var columns = [{
                name: 'platform_',
                label: 'GSM ID',
                editable: false,
                cell: Backgrid.IntegerCell.extend({
                    orderSeparator: ''
                })
            }, {
                name: 'ind_id',
                label: 'Individual ID',
                editable: false,
                formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                    fromRaw: function (rawValue, model) {
                            if (rawValue==null) rawValue='WARNING ==> No Individual attached !';
                         return rawValue;
                      }
                }),
                cell: 'string'
            }, {
                name: 'nb',
                label: 'Number of unchecked locations',
                editable: false,
                cell: Backgrid.IntegerCell.extend({
                    orderSeparator: ''
                })
            }];

            // Initialize a new Grid instance
            this.grid = new Backgrid.Grid({
                columns: columns,
                collection: data
            });

            data.fetch({reset: true});
        },

        onShow: function(){
            this.$el.find('#list').append(this.grid.render().el);
        },

        showDetail: function(evt) {
            var id = $(evt.target).parent().find('td').first().text();
            var NbObs= $(evt.target).parent().find('td').last().text();
            console.log('type');
            Radio.channel('route').command('validate_type_id',  {id:id,NbObs:NbObs,type:this.type});
        },




    });
});