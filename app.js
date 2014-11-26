window.addEventListener("load", function() {
	var polFetcher = new PolytechFetcher;
	var plannings = {'Polytech':polFetcher};
  	
  
	var curIdx = 0;
  
  	var refreshButton = document.getElementById("refresh");
  
  	var currentDay = new Date();
 	var nextButton = document.getElementById("nextButton");
	var previousButton = document.getElementById("previousButton");
	var calendar = {};
	
	/**
	*** CALENDAR INITIALISATION
	**/
	if(!localStorage.favGroups)
		localStorage.favGroups = "{}";
	
	if(localStorage.login) {
		document.getElementById("login").value = localStorage.login;
		document.getElementById("login").disabled = true;
		document.getElementById("remlogin").checked = true;
		
	}
	if(localStorage.password) {
		document.getElementById("password").value = localStorage.password;
		document.getElementById("password").disabled = true;
		document.getElementById("login").disabled = true;
		document.getElementById("remlogin").checked = true;
		document.getElementById("remlogin").disabled = true;
		document.getElementById("rempassword").checked = true;
	}
	var hideId = function() {
		var id = document.getElementById("identification");
		id.style.display = "none";
	}
	var displayLogin = function(onconfirm) {
		var id = document.getElementById("identification");
		id.style.display = "block";
		
		
		var confirmLogin = document.getElementById("idConnect");
		var confirmClone = confirmLogin.cloneNode(true);
		confirmLogin.parentNode.replaceChild(confirmClone, confirmLogin);
		confirmClone.addEventListener("click", hideId);
		confirmClone.addEventListener("click",onconfirm);
	};
	
	
	/**
	*** PLANNING LIST INIT
	**/
	var planningButton =function() {
		var fetcher = plannings[this.textContent];
		console.log("getting fetcher");
		if(fetcher.loginRequired) {
			
		}
		var planningName = this.textContent;
		
		
		displayLogin( function() {
			var login = document.getElementById("login").value;
			var password = document.getElementById("password").value;
			fetcher.setLogin(login, password);
			
			fetcher.onsuccess = function() {
				console.log("SUCCESS");
				hideId();
				emptyMenu();
				for(var i in this.data) {
					var elem = document.createElement("button");
					elem.textContent = this.data[i].name;
					elem.type="button";
					elem.value=i;
					elem.addEventListener("click", function() {
						emptyMenu();
						for(var j in fetcher.data[this.value].groups) {
							var elem = document.createElement("button");
							elem.textContent = fetcher.data[this.value].groups[j];
							elem.value= j.replace("html", "ics");
							elem.type="button";
							elem.addEventListener("click", function() {
								var groupUrl = this.value;
								var groupName = this.textContent;
								calendar = fetcher.getCalendar(this.value);
								if(fetcher.loginRequired) {
									calendar.setLogin(login, password);
								}
								calendar.getEvents(function(){
									calendar.getDay(new Date(), displayEvents);
									document.getElementById("planningList").style.display = "none";
									var favGrp = {};
									if(localStorage.favGroups != "") {
										
										var favGrp = JSON.parse(localStorage.favGroups);
									}
									
									if(favGrp[planningName] == undefined) {
										favGrp[planningName] = [];
									}
									var groupObj = {};
									groupObj.name = groupName;
									groupObj.url = groupUrl;
									favGrp[planningName].push(groupObj);
									localStorage.favGroups = JSON.stringify(favGrp);
									addToSideFavGroups(planningName, groupObj);
								});
							});
							planningMenu.appendChild(elem);
						}
						addCancelButton();
					});
					planningMenu.appendChild(elem);
				}
				addCancelButton();
			};
			fetcher.fetch();
		});
		
		
	};
	
	
	
	var emptyMenu=function() {
		while(planningMenu.hasChildNodes()) {
			planningMenu.removeChild(planningMenu.firstChild);
		}
	};
	
	var planningMenu = document.getElementById("planningList").getElementsByTagName("menu")[0];
	var addGroup = function() {
		document.getElementById("planningList").style.display = "block";
		emptyMenu();
		for(var i in plannings) {
			var elem = document.createElement("button");
			elem.textContent = i;
			elem.type="button";
			elem.addEventListener("click", planningButton);
			planningMenu.appendChild(elem);
		}
		addCancelButton();
	}
	
	document.getElementById("sideAddGroup").addEventListener("click", addGroup);
	
	var addCancelButton=function() {
		var cancel = document.createElement("button");
		cancel.textContent = "Cancel";
		cancel.type="button";
		planningMenu.appendChild(cancel);
	};
	
	
	/**
	*** FAV GROUP SIDEBAR
	**/
	var emptySideFavGroups = function() {
		var sideNav = document.getElementById("sideNav");
		for(var node in sideNav.children) {
			
			
		}
	}
	
	
	
	
	
	
	/**
	*** NEXT AND PREVIOUS BUTTON ACTION
	**/
	nextButton.addEventListener("click", function() {
		//title.parentElement.removeChild(title);
		/*while (planning.firstChild) {
          		planning.removeChild(planning.firstChild);
      		}*/
		var time1 = Date.now();
		side = true;
		var newdate = new Date(currentDay);
		newdate.setDate(newdate.getDate() +1);
		while(newdate.getDay() == 6 || newdate.getDay() == 0)
			newdate.setDate(newdate.getDate() +1); 
		currentDay = newdate;

		calendar.getDay(newdate, displayEvents);
		var time2 = Date.now();
		console.log("Total time switching : " + (time2 - time1));

	});
	previousButton.addEventListener("click", function() {
		/*while (planning.firstChild) {
				planning.removeChild(planning.firstChild);
		  	}*/
		side = false;
		var newdate = new Date(currentDay);
		newdate.setDate(currentDay.getDate() -1); 
		while(newdate.getDay() == 6 || newdate.getDay() == 0)
			newdate.setDate(newdate.getDate() -1); 
		currentDay = newdate;
		calendar.getDay(newdate, displayEvents);
	});
		
  	
  	var cancelButton = document.getElementById("idCancel");
	cancelButton.addEventListener("click", hideId);
  	/**
	*** UI FUNCTIONS
	**/
	
	
	var side = true;
	var displayEvents = function(events) {
		var planning = document.getElementsByClassName("planning")[0];
		planning.removeChild(document.getElementsByClassName("current")[0]);
		var current = document.getElementsByClassName("current")[0];
		var next = document.createElement("section");
		next.className="current";

		next.addEventListener("swipe", function(){console.log("SWIPE");});
		document.getElementById("dayLabel").textContent = currentDay.toLocaleString().replace(currentDay.toLocaleTimeString(), "");
		var previousEvent = undefined;
		for(var i in events) {

			var div = document.createElement("div");

			var subImg = document.createElement("img");
			subImg.src = "style/img/subject.png";
			var subject = document.createElement("p");
			subject.appendChild(subImg);
			subject.appendChild(document.createTextNode(events[i].subject));

			var grpImg = document.createElement("img");
			grpImg.src = "style/img/group.png";
			var group = document.createElement("p");
			group.appendChild(grpImg);
			group.appendChild(document.createTextNode(events[i].group));

			var teachImg = document.createElement("img");
			teachImg.src = "style/img/teacher.png";
			var teacher = document.createElement("p");
			teacher.appendChild(teachImg);
			teacher.appendChild(document.createTextNode(events[i].teacher));

			var locImg = document.createElement("img");
			locImg.src = "style/img/location.png";
			var location = document.createElement("p");
			location.appendChild(locImg);
			location.appendChild(document.createTextNode(events[i].location));

			var description = document.createElement("p");
			description.textContent = events[i].notes;

			var time = document.createElement("h2");
			time.textContent = events[i].startDate.toLocaleTimeString().substr(0,5) + "-" +  events[i].endDate.toLocaleTimeString().substr(0,5) + " " + events[i].type;

			div.appendChild(time);
			if(events[i].subject != "")
				div.appendChild(subject);
			if(events[i].group != "")
				div.appendChild(group);
			if(events[i].teacher != "")
				div.appendChild(teacher);
			if(events[i].location != "")
				div.appendChild(location);
			div.appendChild(description);
			div.style.backgroundColor = events[i].getColor();
			div.className = "event";

			if(previousEvent != undefined && events[i].startDate - previousEvent.endDate > 1000*60*30) { //>30mn

				var space = document.createElement("div");
				space.style.height = "100px";
				space.className = "event";
				space.style.backgroundColor = "#EEEEEE";
				next.appendChild(space);
			}
			next.appendChild(div);
			previousEvent = events[i];
		}
		planning.appendChild(next);
		if(side) {
			if(current) {
				current.classList.remove("rightToCurrent");
				current.classList.remove("leftToCurrent");
				current.classList.add("currentToLeft");
			}

			next.classList.add("rightToCurrent");
		}
		else {
			if(current) {
				current.classList.remove("rightToCurrent");
				current.classList.remove("leftToCurrent");
				current.classList.add("currentToRight");
			}

			next.classList.add("leftToCurrent");;

		}

	};
	var switchToCal = function(fetcher, url) {
		calendar = fetcher.getCalendar(url);
		var onLocal = function() {
			calendar.getEvents(function(){
				calendar.getDay(new Date(), displayEvents);
			});
		}
		var notLocal = function() {
			displayLogin(function() {
				var login = document.getElementById("login").value;
				var password = document.getElementById("password").value;
				calendar.setLogin(login, password);
				calendar.getEvents(function(){
					calendar.getDay(new Date(), displayEvents);
				});
			});
		}
		calendar.isLocal(onLocal, notLocal);
		
	};
	
	var addToSideFavGroups = function(planning, group) {
		var sideNav = document.getElementById("sideNav");
		var planningTitle = document.getElementById("title" + planning);
		var ul = null;
		if(planningTitle == null) {
			var titleNode = document.createElement("h2");
			titleNode.id="title" + planning;
			titleNode.textContent = planning;
			ul = document.createElement("ul");
			ul.id = "list" + planning;
			sideNav.appendChild(titleNode);
			sideNav.appendChild(ul);
		}
		else {
			ul = document.getElementById("list" + planning);
		}
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.textContent = group.name;
		a.href ="#" + planning + "/" + group.url;
		a.addEventListener("click", function() {
			switchToCal(plannings[planning], group.url);
		});
		li.appendChild(a);
		ul.appendChild(li);
		
			
	};
	var refresh = function() {
		displayLogin(function() {
			var login = document.getElementById("login").value;
			var password = document.getElementById("password").value;
			calendar.setLogin(login, password);
				calendar.getEvents(function(){
					calendar.getDay(new Date(), displayEvents);
				});
		});
	};
	
	var refreshSideFavGroups = function() {
		var sideNav = document.getElementById("sideNav");
		var favGrp = JSON.parse(localStorage.favGroups);
		emptySideFavGroups();
		for(var title in favGrp) {
			for(var item in favGrp[title]) {
				addToSideFavGroups(title, favGrp[title][item]);
			}
			
		}
	}
	refreshSideFavGroups();
	
	refreshButton.addEventListener("click", refresh);
	document.getElementById("idConnect").addEventListener("click", function(){
		var login = document.getElementById("login").value;
		var password = document.getElementById("password").value;
		
	});
	if(localStorage.favGroups == "{}")
		addGroup();
	else {
		var favGrp = JSON.parse(localStorage.favGroups);
		var first = "";
		for(first in favGrp) break;
		var fetcher = plannings[first];
		calendar = fetcher.getCalendar(favGrp[first][0].url);
		console.log(calendar);
		calendar.getEvents(function(){
			calendar.getDay(new Date(), displayEvents);
		});
	}
	
	
	var idCheckBox = document.getElementById("remlogin");
	var passwordCheckBox = document.getElementById("rempassword");
	var remLogin = function() {
		var login = document.getElementById("login");
		console.log(this.checked);
		if(this.checked) {
			login.disabled = true;
			localStorage.login = login.value;
		}
		else {
			login.disabled = false;
			delete localStorage.login;
		}
		
	}
	var remPassword = function() {
		var login = document.getElementById("login");
		var password = document.getElementById("password");
		console.log(this.checked);
		if(this.checked) {
			login.disabled = true;
			password.disabled = true;
			
			idCheckBox.checked = true;
			idCheckBox.disabled = true;
			localStorage.login = login.value;
			localStorage.password = password.value;
		}
		else {
			password.disabled = false;
			idCheckBox.disabled = false;
			delete localStorage.password;
		}
		
	}
	
	idCheckBox.addEventListener("click", remLogin);
	passwordCheckBox.addEventListener("click", remPassword);
});
