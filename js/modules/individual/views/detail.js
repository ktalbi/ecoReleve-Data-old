define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'radio',
    'utils/datalist',
    'config',
    'text!templates/individual/detail.html'
], function($, _, Backbone, Marionette, Radio, datalist, config, template) {

    'use strict';

    return Marionette.ItemView.extend({
        template: template,

        events: {
            'click #indivDetailsExitImg': 'hideDetail',
        },

        modelEvents: {
            'change': 'render'
        },

        initialize: function() {
            this.model.fetch();
            this.radio = Radio.channel('individual');
            $('body').css('background-color', 'black');
            $('#left-panel').css('color', 'white');
        },

        hideDetail: function() {
            this.radio.trigger('hide-detail');
        },

        onRender: function() {
            var history = new Backbone.Collection(this.model.get('history'));

            var columns = [{
                name: "name",
                label: "Name",
                editable: false,
                cell: 'string'
            }, {
                editable: false,
                name: "value",
                label: "Value",
                cell: "string"
            }, {
                editable: false,
                name: "from",
                label: "From",
                cell: "string"
            }, {
                editable: false,
                name: "to",
                label: "To",
                cell: "string"
            }];

            // Initialize a new Grid instance
            this.grid = new Backgrid.Grid({
                columns: columns,
                collection: history
            });

            this.setSpecieImage(this.model.get('specie'));
            $('#birdSexPic').attr('src','images/sexe_' + this.model.get('sex') + '.png');
            $('#birdOriginPic').attr('src','images/origin_' + this.model.get('origin') + '.png');
            $("#history").append(this.grid.render().el);
        },

        onDestroy: function() {
            $('body').css('background-color', 'white');
        },

        setSpecieImage: function(specie) {
            var file = null;
            switch (specie) {
                case 'Saker Falcon' :
                case 'Peregrine Falcon' :
                case 'Falcon' :
                case 'Gyr Falcon':
                case 'Barbary Falcon':
                case 'Hybrid Gyr_Peregrine Falcon':
                case 'Eurasian Griffon Vulture':
                case 'Desert Eagle Owl':
                    // set image
                    file = 'faucon.png';
                    break;
                case 'Asian Houbara Bustard' :
                case 'North African Houbara Bustard' :
                    file = 'houtarde.png';
                    break;
                case 'Black-bellied Sandgrouse':
                    file = 'Black-bellied Sandgrouse.png';
                    break;
                case 'Crocodile':
                    file = 'crocodile.png';
                    break;
                case 'Horseshoe Snake':
                case 'Mograbin Diadem Snake':
                    file = 'Snake.png';
                    break;
                case 'Pelican':
                    file = 'Pelican.png';
                    break;
                case 'Rat (Atlantoxerus)':
                    file = 'rat.png';
                    break;
                case 'Spur Thighed Tortoise (graeca)':
                    file = 'tortoise.png';
                    break;
               default:
                      file = 'specie.png';
            }
            $('#birdSpecieImg').attr('src','images/'+ file);
        },
    });
});
