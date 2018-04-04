

var CLIENT_ID,
    API_KEY,
    genericURL = "https://www.googleapis.com/calendar/v3/calendars/",
    calendarId="paulpeterson4321@gmail.com",
    watchURL = "https://www.googleapis.com/calendar/v3/calendars/"+calendarId+"/events/watch",
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

$.getJSON("json/client.json", function(data){
  CLIENT_ID = data["client_id"];
  API_KEY = data["api_key"];
});

console.log(watchURL);
$.post(
  watchURL,
  function(data){
  alert("New event added");
  updateEvents();
  });

var authorizeButton = document.getElementById('authorize-button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    //signoutButton.onclick = handleSignoutClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    //signoutButton.style.display = 'block';
    updateEvents();
  } else {
    authorizeButton.style.display = 'block';
    //signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function createLi(data){
  console.log("LI");
  var b = document.createElement('b');
  b.setAttribute('class', 'li-date');
  b.appendChild(document.createTextNode(data["when"]));

  var li= document.createElement('li');
  li.appendChild(b);
  li.appendChild(document.createTextNode(data["summary"]));
  return li;
}

function appendMonth(data){
  var event_list = document.getElementById('event-list');
  var p = document.createElement('p');
  p.setAttribute('class', 'name');
  p.appendChild(document.createTextNode(data["name"]));

  var ul= document.createElement('ul');
  data["events"].forEach(function(value) {
    var li = createLi(value);
    console.log(li);
    ul.appendChild(li);
  });

    var div = document.createElement('div');
    div.setAttribute('class', 'month');
    div.appendChild(p);
    div.appendChild(ul);

    event_list.appendChild(div);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(indate, outdate) {
  //var date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
  gapi.client.calendar.events.list({
    'calendarId': calendarId,
    'timeMin': indate.toISOString(),
    'timeMax': outdate.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    console.log("EVENTS");
    console.log(events);

    var month = {};
    month.name =  monthNames[indate.getMonth()];
    month.events = [];
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
        details = {};
        details.summary = event.summary;

        details.when = Number(when.split("T")[0].split("-")[2]);
        month.events.push(details);

      }
    }
    appendMonth(month);
  });
}


function updateEvents(){
  $('#event-list').empty();
  var currentMonth_firstDay=new Date,
      y = currentMonth_firstDay.getFullYear(),
      m = currentMonth_firstDay.getMonth();
  console.log("calling list update()");


    var currentMonth_lastDay = new Date(y, m + 1, 0);
    listUpcomingEvents(currentMonth_firstDay,currentMonth_lastDay);
    var nextMonth_firstDay = new Date(y, m + 1, 1);
    var nextMonth_lastDay = new Date(y, m + 2, 0);
    setTimeout(function() {
      listUpcomingEvents(nextMonth_firstDay,nextMonth_lastDay);
    }, 500);


  }
