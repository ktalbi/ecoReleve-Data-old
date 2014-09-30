define([
    "jquery",
    "underscore",
    "backbone",
    'marionette',
    'radio',
    'utils/datalist',
    'utils/forms',
    'config',
    'text!modules2/individual/templates/individual-filter.html'
], function($, _, Backbone, Marionette, Radio, datalist, forms, config, template) {

    "use strict";

    return Marionette.ItemView.extend({
        template: template,

        events: {
            'click #clear-btn' : 'clear',
            'change :text': 'update',
            'focus :text': 'fill',
            'submit': 'catch',
            'click #save-btn' : 'saveCriterias',
            'click #export-btn' : 'export',
            'click #indivSavedSearch .indiv-search-label' : 'selectSavedFilter',
            'click .glyphicon-remove' : 'deleteSavedFilter',
            'click input[type=checkbox]' : 'setNull'
        },

        initialize: function(options) {
            this.radio = Radio.channel('individual');

            // Saved filters
            var storedCriterias = localStorage.getItem('indivFilterStoredCriterias') || "";
            if (!storedCriterias){
                this.criterias =  [];
            } else {
                this.criterias = JSON.parse(storedCriterias);
            }

            // Current filter
            this.filter = options.currentFilter || {};
        },

        catch: function(evt) {
            evt.preventDefault();
        },

        export: function(evt) {
            $.ajax({
                url: config.coreUrl + 'individuals/search/export',
                data: JSON.stringify({criteria:this.filter}),
                contentType:'application/json',
                type:'POST'
            }).done(function(data) {
                var url = URL.createObjectURL(new Blob([data], {'type':'text/csv'}));
                var link = document.createElement('a');
                link.href = url;
                link.download = 'individual_search_export.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link)
            });
        },

        clear: function(evt) {
            evt.preventDefault();
            $("form").trigger("reset");
            this.filter = {};
            sessionStorage.clear('individual:currentFilter');
            this.radio.command('update', {filter:{}});
            $('body').animate({scrollTop: 0}, 400);
        },

        fill: function(evt) {
            var id = evt.target.id;
            var list = $('#'+id+'_list');
            if( list.children().length === 0 && id !== 'id') {
                var source = {
                    url: config.coreUrl + 'individuals/search/values',
                    data: {}
                };
                source.data.field_name = id;
                datalist.fill(source, list);
            }
        },

        setInputTextFromFilter: function(filter) {
            for (var name in filter) {
                this.$el.find('input#'+name).val(filter[name]);
            }
        },

        onShow: function(evt) {
            if(!$.isEmptyObject(this.filter)) {
                this.setInputTextFromFilter(this.filter);
            }
            $('#left-panel').css('padding-right', '0');
        },

        onDestroy: function(evt) {
            $('#left-panel').css('padding-right', '15');
        },

        onRender: function() {
            this.updateSaved();
        },

        updateSaved: function() {
            if (this.criterias.length === 0 ) {
                this.$el.find("#indivSavedSearch").html("<p class='text-center'>No saved criterias</p>");
            } else {
                var html = "<ul class='unstyled'>";
                for(var i=0; i < this.criterias.length;i++) {
                    html += "<li id='" + i + "'><span class='indiv-search-label'>" +
                    this.criterias[i].name +
                    "</span><span class='indiv-search-icon glyphicon glyphicon-remove'/></li>";
                }
                html += "</ul>";
                this.$el.find("#indivSavedSearch").html(html);
            }
        },

        update: function(evt) {
            var crit = evt.target.id;
            var val = evt.target.value;
            this.filter[crit] = val;
            sessionStorage.setItem('individual:currentFilter', JSON.stringify(this.filter));
            this.radio.command('update', {filter:this.filter});
            $('body').animate({scrollTop: 0}, 400);
        },

        getParams : function(){
            var inputs = $("input");
            var criteria  = {};
            inputs.each(function(){
                var name  = this.id;
                var value = $(this).val();
                if (value){
                    criteria[name] = parseInt(Number(value)) || value;
                }
            });
            return criteria;
        },

        setNull: function(evt) {
            var id = evt.target.id.split('-')[1];
            var checked = $(evt.target).is(':checked');
            var input = $('input#' + id);
            forms.resetInput(input);
            input.attr('disabled', checked);
            if(checked){
                this.setFilter(id, null);
            }
            else {
                this.removeFilter(id);
            }
        },

        setFilter: function(key, value) {
            this.filter[key] = value;
            sessionStorage.setItem('individual:currentFilter', JSON.stringify(this.filter));
            this.radio.command('update', {filter:this.filter});
            $('body').animate({scrollTop: 0}, 400);
        },

        removeFilter: function(key) {
            delete this.filter[key];
            sessionStorage.setItem('individual:currentFilter', JSON.stringify(this.filter));
            this.radio.command('update', {filter:this.filter});
            $('body').animate({scrollTop: 0}, 400);
        },

        saveCriterias : function() {
            var params = this.getParams();
            if (!jQuery.isEmptyObject(params)){
                this.addModalWindow(params);
            } else {
                alert("Please input criterias to save.");
            }
        },

        addModalWindow : function(params){
            var searchName = prompt("Please input serach name : ", "");
            if(searchName){
                var searchItem = {};
                searchItem.name = searchName;
                // id searchItem = ln + 1
                searchItem.query = JSON.stringify(params);
                this.criterias.push(searchItem);
                localStorage.setItem('indivFilterStoredCriterias',JSON.stringify(this.criterias));
                alert("Search criterias saved.");
                this.updateSaved();
            }
        },

        selectSavedFilter : function(e) {
            var selectedElement = e.target;
            var liElement = selectedElement.parentNode;
            var id = parseInt($(liElement).attr('id'));
            var crit = JSON.parse(this.criterias[id].query);
            this.filter = crit;
            sessionStorage.setItem('individual:currentFilter', JSON.stringify(this.filter));
            this.radio.command('update', {filter:this.filter});
        },

        deleteSavedFilter : function(e) {
            var selectedElement = e.target;
            var liElement = selectedElement.parentNode.parentNode;
            // get li id  => id of filter object
            var idx = parseInt($(liElement).attr('id'));
            // delete object from criterias list and update displayed list
            this.criterias.splice(idx,1);
            localStorage.setItem('indivFilterStoredCriterias',JSON.stringify(this.criterias));
            this.updateSaved();
        },
    });
});
