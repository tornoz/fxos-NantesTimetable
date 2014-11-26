'use strict';

var PolytechCalendar = (function PolytechCalendarClosure(url) {
	
    this.url = url;
	var self = this;
	var sdcard = navigator.getDeviceStorage('sdcard');
	this.selfEvents = [];
	this.base = Calendar;
	this.base();
	this.login = "";
	this.password = "";
	
	PolytechCalendar.prototype.setLogin = function(login, password) {
		this.login = login;
		this.password = password;
	};
	PolytechCalendar.prototype.isLocal = function PolytechCalendat_isLocal(ontrue, onfalse) {
		var request = sdcard.get(".implijamzer/polytech/" + this.url);
		request.onsuccess = function () {
			var file = this.result;
			console.log(this.result);
			if(file) {
				ontrue();
			}
			else {
				onfalse();
			}
		}

		request.onerror = function () {
			onfalse();
		}
	}
	PolytechCalendar.prototype.getEvents = function PolytechCalendar_getEvents(onsuccess) {
		var request = sdcard.get(".implijamzer/polytech/" + this.url);
		var self = this;
		request.onsuccess = function () {
			var file = this.result;
			console.log(this.result);
			if(file) {
				var fr = new FileReader();
				fr.onload =function(result) {
					loadData(fr.result);
					onsuccess();
				};
				fr.readAsText(file);
			}
			else {
				self.refresh(self.login, self.password, onsuccess);
			}
		}

		request.onerror = function () {
			console.warn("Unable to get the file: " + ".implijamzer/polytech/" + self.url);
			console.warn(this.error);
			self.refresh(self.login, self.password, onsuccess);
		}
		
	}
	
	
	PolytechCalendar.prototype.refresh = function PolytechCalendar_refresh(login, password, onsuccess) {
		
		var xmlhttp=new XMLHttpRequest({mozSystem: true});
    	
		var fileName = this.url;
    	xmlhttp.onreadystatechange=function() {
      		console.log("sayé : " + xmlhttp.status);
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var file   = new Blob([xmlhttp.responseText], {type: "text/plain"});

				var delRequest = sdcard.delete(".implijamzer/polytech/" + fileName);

				delRequest.onsuccess = function() {
					var request = sdcard.addNamed(file, ".implijamzer/polytech/" + fileName);

					request.onsuccess = function () {
						var name = this.result;
						console.log('File "' + name + '" successfully wrote on the sdcard storage area');
						
					}

					// An error typically occur if a file with the same name already exist OH YEAH BITCH THAT IS TOTALLY FUCKING STUPID
					request.onerror = function () {
						console.warn('Unable to write the file: ' + this.error);
					}
				};
				loadData(xmlhttp.responseText);
				onsuccess();
                
                
            }
    	}
    	console.log("coucou");
    	xmlhttp.open("GET","https://edt.univ-nantes.fr/chantrerie-gavy/" + url,true, login, password);
    	xmlhttp.send();
  
	};
	
	PolytechCalendar.prototype.getDay = function PolytechCalendar_getDay(date, onsuccess) {
		
		openCalendar(self.selfEvents, date, onsuccess);
		
  
	};
	
	
  
	var loadData = function(rawData) {
		var jCalData = ICAL.parse(rawData);
    	self.selfEvents = new ICAL.Component(jCalData);
		
	};
  	var openCalendar = function(calendarData, day, onsuccess) {
    	
    	var finalEvents = [];
    	var now = day;
    	// Fetch the VEVENT part
		var time1 = Date.now();
    	var vevents = calendarData.getAllSubcomponents('vevent');
    	for(var event in vevents) {
      		var dstart = ICAL.Time.fromString(vevents[event].getFirstProperty("dtstart").jCal[3]).toJSDate()
      
      		if(dstart.toDateString() == now.toDateString()) {
        		finalEvents.push(vevents[event]);
      		}
     	}
		var time2 = Date.now();
		console.log("Time for parsing events : " + (time2 - time1));
		var events = [];
		var time3 = Date.now();
		for(var i in finalEvents) {
			var dtstart = ICAL.Time.fromString(finalEvents[i].getFirstProperty("dtstart").jCal[3]).toJSDate()
			var dtend = ICAL.Time.fromString(finalEvents[i].getFirstProperty("dtend").jCal[3]).toJSDate()
			var summary = finalEvents[i].getFirstProperty("summary").jCal[3];
			var description = finalEvents[i].getFirstProperty("description").jCal[3];
			var location = finalEvents[i].getFirstProperty("location").jCal[3];
			
			var event = new PolytechEvent(dtstart, dtend, summary, description, location);
			
			events.push(event);
		}
		var time4 = Date.now();
		console.log("Time for cerating events : " + (time4 - time3));
		onsuccess(events);
    
    
  }
    
});
PolytechCalendar.prototype = new Calendar;