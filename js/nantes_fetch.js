'use strict';
var MIN_TYPE_IDX = 1;
var MAX_TYPE_IDX = 4;
var NantesFetcher = (function NantesFetcherClosure(baseurl) {

    this.onsuccess = function() {console.err("should be overriden")};
    this.onerror = function() {console.err("should be overriden")};
    this.data = {};
    this.typeComplete = 0;
    this.totalType =  MAX_TYPE_IDX;
    this.login = "";
    this.password = "";
    this.baseurl = baseurl;
    this.calendars = {};
    this.getCalendar = function(schoolname,schoolurl, url, schoolbase = undefined) {
        if(!this.calendars[url]) {
            var bu = this.baseurl;
            if(schoolbase != undefined) {
                bu = schoolbase;
            }
           this.calendars[url] = new NantesCalendar(schoolname, url, bu + "/" + schoolurl+"/" + url);
        }
        return this.calendars[url];
        
    }
    this.setLogin = function(login, password) {
		this.login = login;
		this.password = password;
        
	};
    
    this.fetch = function nantesfetch(schoolurl, schoolbase = undefined) {
        
        var baseUrl = this.baseurl + "/" + schoolurl + "/";
        if(schoolbase != undefined) {
            var baseUrl = schoolbase + "/" + schoolurl + "/";
        }
        var index = "index1.html";
        this.typeComplete = 0;
        this.data = {};
        var xmlhttp=new XMLHttpRequest({mozSystem: true});
        var self = this;
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var result = xmlhttp.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(result, "text/html");
                var options = doc.getElementsByTagName("select")[0].getElementsByTagName("option");
                var typerequests = {};
                var i = MIN_TYPE_IDX;
                self.totalType = options.length -1;
                for(i = 1; i<= options.length-1; i++) {
                    var option= options[i];
                    self.data[option.value] = {};
                    self.data[option.value].name = option.textContent;
                    var type = option.value;
                    typerequests[i] = new XMLHttpRequest({mozSystem: true});
                   
                    typerequests[i].open("GET",baseUrl + option.value,true, self.login, self.password);
                    typerequests[i].index = option.value;
                    typerequests[i].onreadystatechange=function() {
                        if (this.readyState==4 && this.status==200) {
                            var result =this.responseText;
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(result, "text/html");
                            var optionsGroup = doc.getElementsByTagName("select")[0].getElementsByTagName("option");

                            self.data[this.index].groups = {};
                            for(var j = 1;j< optionsGroup.length; j++) {
                                var optionGroup= optionsGroup[j];

                                if(optionGroup.value != undefined) {

                                   var type = self.data[this.index].groups[optionGroup.value] = optionGroup.textContent;
                                }
                            }
                            self.typeComplete = self.typeComplete +1;
                            if(self.typeComplete == self.totalType) {
                               self.onsuccess();
                            }

                       }


                    };
                    typerequests[i].send(null);
                    
                }

            }
            else if (xmlhttp.readyState==4){
                self.onerror(xmlhttp.status);
            }
        }
        xmlhttp.open("GET",baseUrl + index,true, this.login, this.password);
        xmlhttp.send();
    };

    
    
    
});