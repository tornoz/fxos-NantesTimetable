'use strict';

var PolytechEvent = (function PolytechEventClosure(startDate, endDate, summary, description, location) {
    this.base = Event;
	var self = this;
	//TRIGGER WARNING : very nasty string parsing
	this.type = summary.split("-")[0].trim();
	
	var descDict = {};
	var descLines = description.split("\n");
	for(var i in descLines) {
		
		if(descLines[i].contains(":")) {
			var line = descLines[i].split(":");
			descDict[line[0].trim()] = line[1].trim();
		}
			
		
	}
	var subject = "Matière" in descDict ? descDict["Matière"] : "";
	var group = "Groupe" in descDict ? descDict["Groupe"] : "";
	
	var teacher =  "Groupe" in descDict ? descDict["Personnel"] : "";
	var notes =  "Groupe" in descDict ? descDict["Remarques"] : "";
	this.base(startDate, endDate,this.type, subject, group, teacher, location, notes);
	
	
	PolytechEvent.prototype.getColor = function PolytechEvent_getColor() {
		switch(this.type) {
			case "Projet":
				return "#D3A8FF";
				break;
			case "TD":
				return "#A8A8FF";
				break;
			case "TP":
				return "#FFFFA8";
				break;
			case "Cours magistral":
				return "#FFA8A8";
				break;
			case "Indisponibilité":
				return "#A9FDE2";
				break;
			default:
				return "#FFFFCC";
				
		}
		
	};
    
});
PolytechEvent.prototype = new Event;
