define([
	'jquery',
	'underscore',
	'backbone',
    'marionette',
    'radio',
    'models/export_filter',
        'text!modules2/export/templates/export.html',
    'modules2/export/views/step1',

    'modules2/export/views/step2',
    'modules2/export/views/step2-map',

    'modules2/export/views/step3',
    'modules2/export/views/step3-preview',

    'modules2/export/views/step4',



], function($, _, Backbone, Marionette, Radio, model, template, Step1, Step2_Filters, Step2_Map, Step3_Columns, Step3_Preview, Step4) {

    'use strict';

    return Marionette.LayoutView.extend({
        template: template,

        regions: {
            step_1_Container: '#step1',

            step_2_Filters_Container: '#step2-filters',
            step_2_Map_Container: '#step2-map',

            step_3_Columns_Container: '#step3-columns',
            step_3_Preview_Container: '#step3-preview',

            step_4_Container: '#step4',
        },

        events: {
            'click button.btn-next' : 'nextStep',
            'click button.btn-prev' : 'prevStep',
        },

        viewName:'',
        query:'',

        initialize: function(){
        	this.radio = Radio.channel('exp');

        	this.radio.comply('filters', this.initFilters, this);
            this.radio.comply('columns', this.initColumns, this);
            this.radio.comply('box', this.initBox, this);
            this.radio.comply('viewName', this.initViewName, this);

            this.filters_coll;
            this.columns, this.box;

            $('body').addClass('export-layout');

            //this.initSteps();

            //Stepper.prototype.initialize.call(this);
        },

        initSteps: function(){
            this.step1 = new Step1();

            this.step2_filters = new Step2_Filters();
            this.step2_map = new Step2_Map();

            this.step3_Columns = new Step3_Columns();
            this.step3_Preview = new Step3_Preview();

            this.step4 = new Step4();

            /*Regions*/
            this.step_1_Container.show( this.step1 );

            this.step_2_Filters_Container.show( this.step2_filters );
            this.step_2_Map_Container.show( this.step2_map );

            this.step_3_Columns_Container.show( this.step3_Columns );
            this.step_3_Preview_Container.show( this.step3_Preview );

            this.step_4_Container.show( this.step4 );
            console.log('views and regions initialized');
        },

        /*
        resetRadio: function(){
    		this.radio = Radio.channel('exp');

    		this.radio.comply('filters', this.initFilters, this);
    	    this.radio.comply('columns', this.initColumns, this);
    	    this.radio.comply('box', this.initBox, this);
    	    this.radio.comply('viewName', this.initViewName, this);

        },

        */
        initViewName: function(args){
        	this.viewName=args.viewName;
        	console.log(this.viewName);
        },
        initFilters: function(args){
            this.filters_coll=args.filters;
            console.log(this.filters_coll);
        },
        initColumns: function(args){
            this.columnCriteria=args.columns;
            console.log(this.columnCriteria);
        },
        initBox: function(args){
            this.boxCriteria=args.box;
            console.log(this.boxCriteria);
        },

        onBeforeDestroy: function() {
            this.radio.reset();
            $('body').removeClass('export-layout');
        },

        onShow: function() {
        	$('.btn-next').attr('disabled', 'disabled');
            var step1= new Step1();
            var passed='passed2';
            this.step_1_Container.show( step1 );
            step1.alerte(passed);

            //$('.btn-next').attr('disabled', 'disabled');
        },

        alerte: function(args){
            alert(args);
        },

        prevStep: function(){
            $('#importWizard').wizard('previous');
        },

        nextStep: function(){
            $('#importWizard').wizard('next');
            var step = $('#importWizard').wizard('selectedItem').step;
            $('.btn-next').attr('disabled', 'disabled');

            if(step == 2){
                this.step_2_Filters_Container.show( new Step2_Filters(
                	{
                		viewName:this.viewName,
                	}
                ));
                this.step_2_Map_Container.show( new  Step2_Map({
                    viewName:this.viewName,
                }));
            }
            if(step == 3){
                //this.filters = $("#filterForView").val();
                this.step_3_Columns_Container.show( new Step3_Columns({
                    viewName:this.viewName,
                    filters: this.filters_coll,
                    
                }));
                this.step_3_Preview_Container.show( new Step3_Preview({
                	viewName:this.viewName,
                    filterCriteria: this.filters_coll,
                    boxCriteria: this.boxCriteria,
                }));
            }
            if(step == 4){
                this.step_4_Container.show( new Step4({
                    viewName:this.viewName,
                    filterCriteria: this.filters_coll,
                    boxCriteria: this.boxCriteria,
                    columnCriteria: this.columnCriteria
                }));

            }
        },

        displayStep: function(){

        },

    });

});
