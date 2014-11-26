'use strict';
var MIN_TYPE_IDX = 1;
var MAX_TYPE_IDX = 4;
var PolytechFetcher = (function PolytechFetcherClosure() {

    this.loginRequired = true;
    this.onsuccess = function() {};
    this.data = {};
    this.typeComplete = 0;
    this.totalType =  MAX_TYPE_IDX;
    this.login = "";
    this.password = "";
    this.calendars = {};
    this.getCalendar = function(url) {
        if(!this.calendars[url]) {
            console.log("constructing calendar " + url);
           this.calendars[url] = new PolytechCalendar(url);
        }
        return this.calendars[url];
        
    }
    this.setLogin = function(login, password) {
		this.login = login;
		this.password = password;
        
	};
    
    this.fetch = function polyfetch() {
        var baseUrl = "https://edt.univ-nantes.fr/chantrerie-gavy/";
        var index = "index1.html";

        var xmlhttp=new XMLHttpRequest({mozSystem: true});
        console.log("querying " + baseUrl + index);
        var self = this;
        xmlhttp.onreadystatechange=function() {
            console.log("hey " + xmlhttp.status);
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var result = xmlhttp.responseText;
                console.log("FETCH :");
                var parser = new DOMParser();
                var doc = parser.parseFromString(result, "text/html");
                var options = doc.getElementsByTagName("select")[0].getElementsByTagName("option");
                var typerequests = {};
                var i = MIN_TYPE_IDX;
                
                for(i; i<=  MAX_TYPE_IDX; i++) {
                    var option= options[i];
                    self.data[option.value] = {};
                    self.data[option.value].name = option.textContent;
                    var type = option.value;
                    typerequests[i] = new XMLHttpRequest({mozSystem: true});
                   
                    typerequests[i].open("GET",baseUrl + option.value,true, self.login, self.password);
                    typerequests[i].index = option.value;
                    console.log("salut");
                    typerequests[i].onreadystatechange=function() {
                        console.log("yop " + this.status);
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
                            console.log("fetched " + self.typeComplete + " on " + self.typeComplete);
                            if(self.typeComplete == self.totalType) {
                               self.onsuccess();
                            }

                       }


                    };
                    typerequests[i].send(null);
                    
                }

            }
        }
        console.log("coucou");
        xmlhttp.open("GET",baseUrl + index,true, this.login, this.password);
        xmlhttp.send();
    };

    
    
    
});