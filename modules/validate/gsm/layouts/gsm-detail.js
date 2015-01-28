define([
    'marionette',
    'radio',
    'config',
    'backbone',
    'models/individual',
    'modules2/validate/gsm/views/gsm-grid',
    'modules2/validate/gsm/views/gsm-info',
    'modules2/validate/gsm/views/gsm-map2',
    'text!modules2/validate/gsm/templates/gsm.html'
], function(Marionette, Radio, config,Backbone,Individual, Grid, Info,
    Map, template) {

    'use strict';

    return Marionette.LayoutView.extend({
        className: 'container-fluid no-padding full-height',
        template: template,

        regions: {
            grid: '#grid-container',
            info: '#info-container',
            map: '#map-container',
        },

        events: {
            'click #back' : 'back',
        },

        initialize: function(options) {
            var self=this;
            this.radio = Radio.channel('gsm-detail');
            this.gsmID = options.gsmID;
            this.id_ind=options.id_ind;
            console.log(this.id_ind);
        },

        onBeforeDestroy: function() {
            this.radio.reset();
            $('#main-region').removeClass('grey-back').removeClass('no-scroll');
            $('body').removeClass('no-scroll');
            
        },

        onShow: function() {
            $('body').addClass('full-height').addClass('no-scroll');
            $('#main-region').addClass('full-height').addClass('grey-back').addClass('no-scroll');

            var self=this;
            this.info.show(new Info({
                model: new Individual({
                   ptt:self.gsmID,
                   id:self.id_ind,
                   last_observation: null,
                   duration: null,
                   indivNbObs:null
                }),
            }));
            this.grid.show(new Grid({
                gsmID:this.gsmID,
                id_ind:self.id_ind
            }));
            this.map.show(new Map({
                gsmID:this.gsmID,
                id_ind:self.id_ind
            }));
        },

        back: function(){
            Radio.channel('route').command('validate:type', 'gsm');
        },
    });
});
