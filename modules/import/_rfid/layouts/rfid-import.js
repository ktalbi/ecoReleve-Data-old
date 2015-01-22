define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'config',
    'radio',
    'text!modules2/import/_rfid/templates/rfid-import.html',
    'bootstrap_slider',
    'modules2/import/_rfid/views/step2',
    'grid/model-grid',
    'backgrid',
    'modules2/rfid/layouts/rfid-deploy',
    'modules2/rfid/views/rfid-map',
    'sweetAlert'
    
], function($, _, Backbone, Marionette, config, Radio, template, bootstrap_slider, Step2, NSGrid, Backgrid, DeployRFID, Map, swal) {
    'use strict';


    return Marionette.LayoutView.extend({

        template: template,

        regions:{
            step1 : '#step1',
            step2 : '#step2',
            deploy : '#rfid-Modal'
        },

        collection: new Backbone.Collection(),
        className: 'import-container-rfid container',

        events: {
            'click #btn-import': 'importFile',
            'click #input-file': 'clear',
            'focus #input-mod': 'clear',
            'change #input-mod' : 'updateGrid',
            'click #pose_remove' : 'deployRFID',
            'click button.btn-next' : 'nextStep',
            'click button.btn-prev' : 'prevStep',
        },

        ui: {
            progress: '.progress',
            progressBar: '.progress-bar',
            fileHelper: '#help-file',
            fileGroup: '#group-file',
            modHelper: '#help-mod',
            modGroup: '#group-mod',
            modInput: '#input-mod'
        },

        onDestroy: function(){
            $('body').removeClass('home-page');
            $('#main-region').removeClass('full-height obscur');

        },

        initialize: function() {
            this.radio = Radio.channel('rfid_pose');
            this.listenTo(this.collection, 'reset', this.render)
            $.ajax({
                context: this,
                url: config.coreUrl + 'rfid',
            }).done( function(data) {
                this.collection.reset(data);
            });
            this.grid= new NSGrid({
               /* columns: this.cols,*/
                channel: 'rfid_pose',
                url: config.coreUrl + 'rfid/pose/',
                pageSize : 20,
                pagingServerSide : false,
            });

            
        },

        onShow: function(){
            $('.btn-next').attr('disabled', 'disabled');
                   
        },

        onRender: function(){
            $('body').addClass('home-page');
            $('#main-region').addClass('full-height obscur');
            $('#rfid-grid').html(this.grid.displayGrid());
            $('#paginator').prepend(this.grid.displayPaginator());
            
        },


        prevStep: function(){
            var step = $('#importWizard').wizard('selectedItem').step;
            if(step == 1){
                Radio.channel('route').trigger('import');                
            }else{
                $('#importWizard').wizard('previous');
                //Radio.channel('route').command('import:rfid');

            }
        },
        
        nextStep: function(){
            $('#importWizard').wizard('next');
            this.step2.show(new Step2());
        },



        importFile: function(event) {
            event.stopPropagation();
            event.preventDefault();
            this.clear();

            var module = this.ui.modInput.val();

            if( module !== '') {

                var reader = new FileReader();
                var file = $('#input-file').get(0).files[0] || null;
                var url = config.coreUrl + 'rfid/import';
                var data = new FormData();
                console.log($(this.ui.modInput));
                var self = this;

                reader.onprogress = function(data) {
                    if (data.lengthComputable) {
                        var progress = parseInt(data.loaded / data.total * 100).toString();
                        self.ui.progressBar.width(progress + '%');
                       
                    }
                };

                reader.onload = function(e, fileName) {
                    data.append('data', e.target.result);
                    data.append('module', module);
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: data,
                        processData: false,
                        contentType: false
                    }).done(function(data) {
                        $('#btnNext').removeAttr('disabled');
                         
                        self.ui.progressBar.css({'background-color':'green'})
                        
                        Radio.channel('rfid').command('showValidate',{});


                    }).fail( function(data) {
                        
                        console.log(data)
                        $('#btnNext').attr('disabled');
                        if (data.status == 500 || data.status == 510  ) {
                            var type = 'warning';
                            self.ui.progressBar.css({'background-color':'rgb(218, 146, 15)'})
                            var color = 'rgb(218, 146, 15)';
                        }
                        else {
                            var type = 'error';
                            self.ui.progressBar.css({'background-color':'rgb(147, 14, 14)'})
                            var color = 'rgb(147, 14, 14)';

                         }
                        swal(
                            {
                              title: "Warning ",
                              text: data.responseText,
                              type: type,
                              showCancelButton: false,
                              confirmButtonColor: color,
                              confirmButtonText: "OK",
                
                              closeOnConfirm: true,
                             
                            },
                            function(isConfirm){
                                self.ui.progress.hide();
                            }
                        );
                    });
                };

                if(file) {
                    this.clear();
                    this.ui.progress.show();
                    reader.readAsText(file);
                }
                else {
                    this.ui.fileGroup.addClass('has-error');
                    this.ui.fileHelper.text('Required');
                }
            }
            else {
                this.ui.modGroup.addClass('has-error');
                this.ui.modHelper.text('Required');
            }
        },

        clear: function() {
            this.ui.progressBar.width('0%');
            this.ui.progress.hide();
            this.ui.fileHelper.text('');
            this.ui.fileGroup.removeClass('has-error');
            this.ui.modHelper.text('');
            this.ui.modGroup.removeClass('has-error');
        },

        updateGrid: function(){
            console.log($('#input-mod').val());
            var data = new Backbone.Model();
            data.filters = [{'Column':'identifier','Operator':'=','Value':$('#input-mod').val()}];
            this.radio.command('rfid_pose:grid:update',data);

        },

        deployRFID: function(){

            //$('#rfid-Modal').modal('show');
           /* this.deployRFID.onShow();*/
           $('#rfid-Modal').modal('show');
            var deploy_rfid=new DeployRFID();
            this.deploy.show(deploy_rfid);
            $('#map').css({'height':'300px'});
            console.log(deploy_rfid.map);
         
        }
    });
});
