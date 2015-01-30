'use strict';

var NantesCalendar = (function NantesCalendarClosure(school, url, fullurl) {
	
    this.url = url;
	this.fullurl = fullurl
	var self = this;
	var sdcard = navigator.getDeviceStorage('sdcard');
	this.selfEvents = {};
	this.base = Calendar;
	this.base();
	this.login = "";
	this.password = "";
    this.name = name;
	this.school = school;
	
	NantesCalendar.prototype.setLogin = function(login, password) {
		this.login = login;
		this.password = password;
	};
	NantesCalendar.prototype.isLocal = function NantesCalendar_isLocal(ontrue, onfalse) {
		var request = sdcard.get(".implijamzer/" + this.school + "/" + this.url);
		request.onsuccess = function () {
			var file = this.result;
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
	NantesCalendar.prototype.getEvents = function NantesCalendar_getEvents(onsuccess) {
		var request = sdcard.get(".implijamzer/" + this.school + "/" + this.url);
		var self = this;
		request.onsuccess = function () {
			var file = this.result;
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
			console.warn("Unable to get the file: " + ".implijamzer/" + self.school + "/" + self.url);
			console.warn(this.error);
			self.refresh(self.login, self.password, onsuccess);
		}
		
	}
	
	
	NantesCalendar.prototype.refresh = function NantesCalendar_refresh(login, password, onsuccess) {
		
		var xmlhttp=new XMLHttpRequest({mozSystem: true});
    	
		var fileName = this.url;
		var schoolname = this.school;
    	xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var file   = new Blob([xmlhttp.responseText], {type: "text/plain"});

				var delRequest = sdcard.delete(".implijamzer/" + schoolname + "/" + fileName);

				delRequest.onsuccess = function() {
					var request = sdcard.addNamed(file, ".implijamzer/" + schoolname + "/" + fileName);

					request.onsuccess = function () {
						var name = this.result;
						
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
    	xmlhttp.open("GET",fullurl,true, login, password);
    	xmlhttp.send();
  
	};
	
	NantesCalendar.prototype.getDay = function NantesCalendar_getDay(date, onsuccess) {
		
		openCalendar(self.selfEvents, date, onsuccess);
		
  
	};
	
	
  
	var loadData = function(rawData) {
		var jCalData = ICAL.parse(rawData);
    	var calData = new ICAL.Component(jCalData);
		self.selfEvents = {};
		var vevents = calData.getAllSubcomponents('vevent');
    	for(var event in vevents) {
      		var dstart = ICAL.Time.fromString(vevents[event].getFirstProperty("dtstart").jCal[3]).toJSDate()
      		if(!self.selfEvents[dstart.toDateString()])
				self.selfEvents[dstart.toDateString()] = [];
			self.selfEvents[dstart.toDateString()].push(vevents[event])
     	}
	};
  	var openCalendar = function(calendarData, day, onsuccess) {
    	
		var finalEvents = calendarData[day.toDateString()];
    	var now = day;
    	// Fetch the VEVENT part
		var events = [];
		for(var i in finalEvents) {
			var dtstart = ICAL.Time.fromString(finalEvents[i].getFirstProperty("dtstart").jCal[3]).toJSDate()
			var dtend = ICAL.Time.fromString(finalEvents[i].getFirstProperty("dtend").jCal[3]).toJSDate()
			var summary = finalEvents[i].getFirstProperty("summary").jCal[3];
			var description = finalEvents[i].getFirstProperty("description").jCal[3];
			var location = finalEvents[i].getFirstProperty("location").jCal[3];
			
			var event = new NantesEvent(dtstart, dtend, summary, description, location);
			
			events.push(event);
		}
		onsuccess(events);
    
    
  }
    
});
NantesCalendar.prototype = new Calendar;