'use strict';

var Event = (function EventClosure(startDate, endDate, type, subject, group, teacher, location, notes) {
	this.startDate = startDate || "";
	this.endDate = endDate || "";
	this.type = type || "";
	this.subject = subject || "";
	this.group = group || "";
	this.teacher = teacher || "";
	this.location = location || "";
	this.notes = notes || "";
	
	
    Event.prototype = {
		

	    getColor: function Event_getColor() {
				throw new NotImplementedException(
				'getHtmlElement() should be implemented in subclass');
			},
		
		
	};
});
