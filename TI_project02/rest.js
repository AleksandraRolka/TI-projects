var request;
var objJSON;


var indexedDB_request = indexedDB.open("survey_DB");
var db;

session();

indexedDB_request.onupgradeneeded = function(){
	db = indexedDB_request.result;
	var store = db.createObjectStore("survey", { keyPath: "id", autoIncrement: true });
	store.createIndex("age1", "age1");
	store.createIndex("age2", "age2");
	store.createIndex("age3", "age3");
	store.createIndex("age4", "age4");
	store.createIndex("day", "day");
	store.createIndex("night", "night");

};

indexedDB_request.onsuccess = function(){
	db = indexedDB_request.result;
};


function getRequestObject()
{
	if( window.ActiveXObject ){
		return (new ActiveXObject("Microsoft.XMLHTTP"));
	}else if(window.XMLHttpRequest){
		return (new XMLHttpRequest());
	}else{
		return (null) ;
	}
}



function logged_menu()
{
	document.getElementById("menu").innerHTML = `<ul>
						<li><a onclick="log_out()">Wyloguj</a></li>
						<li><a onclick="showSurveyDiv()">Ankieta</a></li>
						<li><a onclick="showResultsDiv()">Histogram</a></li>
					<ul>`;
}

function not_logged_menu()
{
	document.getElementById("menu").innerHTML = `<ul>
						<li><a onclick="showRegDiv()">Rejestracja</a></li>
						<li><a onclick="showLogInDiv()">Logowanie</a></li>
						<li><a onclick="showSurveyDiv()">Ankieta</a></li>
					<ul>`;
}
function completly_offline_menu()
{
	document.getElementById("menu").innerHTML = `<ul>
						<li><a onclick="showSurveyDiv()">Ankieta</a></li>
					<ul>`;
}


function session()
{
	var arr = {};
	var session_id = get_cookies();
	arr.sessionID = session_id;
	txt = JSON.stringify(arr);
	request = getRequestObject();
	request.onreadystatechange = function(){
		if (request.readyState == 4 && (request.status == 200 || request.status == 400))
		{
			objJSON = JSON.parse(request.response);
			if (objJSON['status'] == 'ok')
				logged_menu();
			else
				not_logged_menu();
		}
	};
	request.open("POST", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/session", true);
	request.send(txt);
}


function get_cookies()
{
	var tmp;
	var cookies;
	cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++)
	{
		tmp = cookies[i];
		
		while (tmp.charAt(0) == ' ')
		{
			tmp = tmp.substring(1, tmp.length);
		}
		if (tmp.indexOf("sessionID=") == 0)
		{
			return tmp.substring("sessionID=".length, tmp.length);
		}
	}
	return '';
}

function set_cookies(value)
{
	document.cookie = "sessionID=" + value + "; path=/";
}


function validate_reg(form)
{
	if( form.login.value == "" || form.pass.value == "" ) 
	{
		alert("Wprowadź prawidłowe dane");
		return false;
	}
	if( form.login.value.length < 6 ) 
	{
		alert( "Login musi się składać przynajmniej z 6 znaków" );
		return false;
	}
	if( form.pass.value.length < 6 ) 
	{
		alert( "Hasło musi się składać przynajmniej z 6 znaków" );
		return false;
	}
	return true;
}


function reg_user(form)
{
	if( validate_reg(form) )
	{
		var user = {};
		user.login = form.login.value;
		user.pass = form.pass.value;
		txt = JSON.stringify(user);
		
		request = getRequestObject();
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) 
			{
				objJSON = JSON.parse(request.response);
				if (objJSON['status'] == 'ok') 
				{
					alert("Zostałeś zarejestrowany");
					alert("Kolejno zaloguj się ->");
					showLogInDiv();
				}
				else 
				{
					alert("Wprowadzony login już istnieje w bazie..");
				}
			}
		};
		request.open("POST", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/register", true);
		request.send(txt);
	}
}

function log_user(form)
{
	if (form.login.value == "" || form.pass.value == "") 
	{
		alert("Wprowadź	 poprawne dane!");
		return;
	}
	var user = {};
	user.login = form.login.value;
	user.pass = form.pass.value;
	txt = JSON.stringify(user);
	request = getRequestObject();
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200) 
		{
			objJSON = JSON.parse(request.response);
			if(objJSON['status'] == 'ok') 
			{
				set_cookies(objJSON['sessionID']);
				logged_menu();
				alert("Zalogowano!");
				showSurveyDiv();
			}
			else
				alert("Podano niepoprawne dane!");
		}
	};
	request.open("POST", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/login", true);
	request.send(txt);
}
 
 
function log_out()
{
	var session_id = get_cookies();
	var cookies = {};
	cookies.sessionID = session_id;
	txt = JSON.stringify(cookies);
	request = getRequestObject();
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200)
		{
			objJSON = JSON.parse(request.response);
			if(objJSON['status'] == 'ok')
			{
				set_cookies('');
				alert("Zostałeś wylogowany!");
				not_logged_menu();
				showLogInDiv();
			}
		}
	};
	request.open("POST", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/logout", true);
	request.send(txt);
}


window.addEventListener('offline', function(e) {
	completly_offline_menu();
	alert("Stracono połączenie, pracujesz w trybie off-line");
	showHelloDiv();
	}
);

window.addEventListener('online', function(e) { 
	alert("Połączenie powróciło, pracujesz w trybie on-line");
	log_out();
	not_logged_menu();
	showLogInDiv();
	}
);

function survey_data(form)
{
	var age = form.age.value;
	var time = form.time.value;
	
	if( age==="" || time==="" )
	{
		alert("Udziel odpowiedzi na oba pytania");
	}
	else{
		var data = {};
		if(age=="range1")	data.age1 = 1;		else data.age1 = 0;
		if(age=="range2")	data.age2 = 1;		else data.age2 = 0;
		if(age=="range3")	data.age3 = 1;		else data.age3 = 0;
		if(age=="range4")	data.age4 = 1;		else data.age4 = 0;
		
		if(time=="day")		data.day = 1;		else data.day = 0;
		if(time=="night")	data.night = 1;		else data.night = 0;

	
		if( get_cookies() == "" || !(window.navigator.onLine) )
		{
			txt = JSON.stringify(data);
			var db_tr = db.transaction("survey", "readwrite");
			var obj = db_tr.objectStore("survey");

			if(obj.put(data))
				alert("Dziękuję za wypełnienie ankiety! Dane dodane do lokalnej bazy.");
		}
		else
		{
			txt = JSON.stringify(data);
			request = getRequestObject();
			
			request.onreadystatechange = function(){
				if (request.readyState == 4 && request.status == 200) 
				{
					objJSON = JSON.parse(request.response);
					if (objJSON['status'] == 'ok') 
						alert("Dziękuję za wypełnienie ankiety!");
					else 
						alert("Błąd..spróbuj ponownie");
				}
			};
			request.open("POST", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/survey", true);
			request.send(txt);
		}
	}
}

function updateMongoDB()
{
	var counter = 0;
	var db_tx = db.transaction("survey", "readwrite");
	var obj = db_tx.objectStore("survey");
	obj.openCursor().onsuccess = function (event) {
		var cursor = event.target.result;
		if(cursor)
		{
			var data = {};
			data.age1 = cursor.value.age1;
			data.age2 = cursor.value.age2;
			data.age3 = cursor.value.age3;
			data.age4 = cursor.value.age4;
			data.day = cursor.value.day;
			data.night = cursor.value.night;

			txt = JSON.stringify(data);
			req = getRequestObject();

			req.onreadystatechange = function () {
				if (req.readyState == 4 && req.status == 200)
				{
					objJSON = JSON.parse(req.response);
					if (objJSON['status'] == 'ok')
						alert("Dane z " + counter + " ankiet zostały dodane do bazy (lokalna->MongoDB).");
				}
			}
			req.open("POST", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/survey", true);
			req.send(txt);
			cursor.delete();
			counter += 1;
			cursor.continue();
		}
	};
}

function showResults()
{
	var arr1 = [0, 0, 0, 0];
	var arr2 = [0, 0, 0, 0];
	
	request = getRequestObject() ;
	request.onreadystatechange = function() {
		if (request.readyState == 4)
		{
			objJSON = JSON.parse(request.response);
				
			for (var id in objJSON)
			{
				if(objJSON[id]["day"]==1)
				{
					arr1[0] += objJSON[id]["age1"];
					arr1[1] += objJSON[id]["age2"];
					arr1[2] += objJSON[id]["age3"];
					arr1[3] += objJSON[id]["age4"];
				}
				else
				{
					arr2[0] += objJSON[id]["age1"];
					arr2[1] += objJSON[id]["age2"];
					arr2[2] += objJSON[id]["age3"];
					arr2[3] += objJSON[id]["age4"];
				}
			}
			drawHist(arr1,arr2);
		}
	}
	request.open("GET", "http://pascal.fis.agh.edu.pl/~8rolka/projects/TI_project02/rest/getdata", true);
	request.send(null);
}


function drawHist(day,night)
{
	var sum = day[0] + day[1] + day[2] + day[3] + night[0] + night[1] + night[2] + night[3]; 
	var day_percent =	[(day[0]/sum)* 100, (day[1]/sum)* 100, (day[2]/sum)* 100, (day[3]/sum)* 100];
	var night_percent = [(night[0]/sum)* 100, (night[1]/sum)* 100, (night[2]/sum)* 100, (night[3]/sum)* 100]
	
	var chart = new CanvasJS.Chart("canvasHist", 
		{
			animationEnabled: true,
			title:{
				text: "Pora doby największej produktywności w zależności od wieku",
				fontSize: 22,
				fontFamily: "Montserrat",
				fontColor: "#000e3c",
				padding: {
					top: 20,
					right: 30,
					bottom: 15,
					left: 30
				},
				horizontalAlign: "center"
			},
			theme: "light2",
			axisX: {
				title: "Wiek",
				titleFontSize: 18
			},
			axisY: {
				title: "Ilość ankietowanych",
				titleFontSize: 18,
				margin: 25,
				suffix: "%",
				includeZero: true //,
				//maximum: 100
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				itemWidth: 80,
				markerMargin: 10,
				margin: 15
			},
			data: [{
				type: "column",
				name: "dzień",
				color: "#d4ff45",
				showInLegend: true,
				dataPoints: [
					{ label: "18-25",  y: day_percent[0] },
					{ label: "26-39", y: day_percent[1] },
					{ label: "40-59", y: day_percent[2] },
					{ label: "60-100",	y: day_percent[3] }
				]
			},
			{
				type: "column",
				name: "noc",
				color: "#669aed",
				showInLegend: true,
				dataPoints: [
					{ label: "18-25", y: night_percent[0] },
					{ label: "26-39", y: night_percent[1] },
					{ label: "40-59", y: night_percent[2] },
					{ label: "60-100", y: night_percent[3] }
				]
			}]
		}
	);
	
	chart.render();
}


function showHelloDiv()
{
	document.getElementById("hello").style.display = 'block';
	document.getElementById("registration").style.display = 'none';
	document.getElementById("logIn").style.display = 'none';
	document.getElementById("survey").style.display = 'none';
	document.getElementById("results").style.display = 'none';
}

function showRegDiv()
{
	document.getElementById("hello").style.display = 'none';
	document.getElementById("registration").style.display = 'block';
	document.getElementById("logIn").style.display = 'none';
	document.getElementById("survey").style.display = 'none';
	document.getElementById("results").style.display = 'none';
}

function showLogInDiv()
{
	document.getElementById("hello").style.display = 'none';
	document.getElementById("registration").style.display = 'none';
	document.getElementById("logIn").style.display = 'block';
	document.getElementById("survey").style.display = 'none';
	document.getElementById("results").style.display = 'none';
}

function showSurveyDiv()
{
	document.getElementById("hello").style.display = 'none';
	document.getElementById("registration").style.display = 'none';
	document.getElementById("logIn").style.display = 'none';
	document.getElementById("survey").style.display = 'block';
	document.getElementById("results").style.display = 'none';
}

function showResultsDiv()
{
	updateMongoDB();

	document.getElementById("hello").style.display = 'none';
	document.getElementById("registration").style.display = 'none';
	document.getElementById("logIn").style.display = 'none';
	document.getElementById("survey").style.display = 'none';
	document.getElementById("results").style.display = 'block';
}