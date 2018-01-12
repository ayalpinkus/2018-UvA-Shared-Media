
var calendarversion = "calendar006";

var memberversion   = "member003";

var someLocalStorage = null;

function MakeSureStorageExists()
{
  if (someLocalStorage == null)
  {
    someLocalStorage = {};
    someLocalStorage[calendarversion] = {};
    someLocalStorage[memberversion] = {};
  }
}

function GetCalendarLocal()
{
  MakeSureStorageExists();

  if (someLocalStorage[calendarversion] == null)
  {
    someLocalStorage[calendarversion] = {};
  }
  return someLocalStorage[calendarversion];  
}

function GetMemberLocal()
{
  MakeSureStorageExists();
  if (someLocalStorage[memberversion] == null)
  {
    someLocalStorage[memberversion] = {};
  }
  return someLocalStorage[memberversion];
}


function SetCalendarLocal(storage)
{
  if (someLocalStorage == null)
  {
    someLocalStorage = {};
  }
  someLocalStorage[calendarversion] = storage;
}

function SetMemberLocal(storage)
{
  if (someLocalStorage == null)
  {
    someLocalStorage = {};
  }
  someLocalStorage[memberversion] = storage;
}



var demo_appointments = 
[
];

var membercolors = 
[
  "#d88bb1" ,
  "#8bb1d8" ,
  "#b1d88b" ,
  "#b18bd8" ,
  "#8bd8b1" ,
  "#d8b18b" ,
  "#d88bd8" ,
  "#8bd8d8" ,
  "#d8d88b" ,
  "#8b8bd8" ,
  "#8bd88b" ,
  "#d88b8b" ,
];


var currentMember = 0;
function GoMember(step)
{
  currentMember+=step;
  while (currentMember<0)
  {
    currentMember += membercolors.length;
  }
  while (currentMember>=membercolors.length)
  {
    currentMember -= membercolors.length;
  }
  SetCurrentMember();
}

function UpdateMember(text)
{
  GetMemberLocal()[currentMember] = text;
  SetMemberStorage(GetMemberLocal());
//console.log("member name is "+text);
}

function SetCurrentMember()
{
//console.log("currentMember = "+currentMember);

  var element = document.getElementById("currentbullet");
  if (element)
  {
//console.log("Setting color "+membercolors[currentMember]);
    element.style.backgroundColor = membercolors[currentMember];
  }

  element = document.getElementById("currentmember");
  if (element)
  {
//alert(JSON.stringify(GetMemberLocal()));
    element.innerHTML = GetMemberLocal()[currentMember];
  }
//console.log("should work");
}

function AddNewAppointment()
{
  demo_appointments.push(
  {
    "description":"ClickToEditDescription",
    "time":"ClickToEditTime",
    "members":"ClickToAddOtherHouseholdMembers"
  });
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;
  SetCalendarStorage(GetCalendarLocal());
}



function AddNewAppointmentWithText(id, description, time, members)
{
  demo_appointments.push(
  {
    "id":id,
    "description":description,
    "time":time,
    "members":members
  });
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;
  SetCalendarStorage(GetCalendarLocal());
}


function UpdateDescription(row, text)
{
  demo_appointments[row]["description"] = text;
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;
  SetCalendarStorage(GetCalendarLocal());
}

function UpdateMembers(row, text)
{
  demo_appointments[row]["members"] = text;
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;
  SetCalendarStorage(GetCalendarLocal());
}
function UpdateTime(row, text)
{
  demo_appointments[row]["time"] = text;
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;
  SetCalendarStorage(GetCalendarLocal());
}


function AddNewAppointment()
{
  var id = currentMember; // Math.floor(membercolors.length*Math.random());
  AddNewAppointmentWithText(id, "ClickToEditDescription", "ClickToEditTime", "ClickToAddOtherHouseholdMembers");
  RePopulateAppointments();
}


function RePopulateAppointments()
{
  if (demo_appointments.length == 0)
  {
    var element = document.getElementById("appointments");
    if (element)
    {
      element.innerHTML = "<div class='weekdaybig' style='color:#a0a0a0; padding-top:16px;'>(Tap on the plus button below to add an appointment)</div>";
    }


    return;
  }

  var innerHTML = "";
  var i;
  for (i=0;i<demo_appointments.length;i++)
  {
    innerHTML = innerHTML + 
    "  <div class='appointment "+((i&1)? "odd" : "even" )+"'>" + 
    "    <div class='memberbullet' style='background:"+membercolors[demo_appointments[i]["id"] % membercolors.length]+";'> </div>" + 
    "    <a href='javascript:RemoveAppointment("+i+");' onclick='return confirm(\"Are you sure you want to delete this appointment?\");'><img class='trashcan' style='width:16px; margin-right:4px;' src='trashcan.svg' /></a>" +
    "    <div class='appointmenttext'>" + 
    "      <span class='appointmenttitle' contenteditable='true' onkeypress='preventEnter(event)' onkeyup='javascript:UpdateDescription("+i+", this.innerHTML);' >"+demo_appointments[i]["description"]+"</span><br>" + 
    "      <div class='appointmenthousemembers' contenteditable='true' onkeypress='preventEnter(event)' onkeyup='javascript:UpdateMembers("+i+", this.innerHTML);'>"+demo_appointments[i]["members"]+"</div><br>" + 
    "      <div class='appointmenttime' contenteditable='true' onkeypress='preventEnter(event)' onkeyup='javascript:UpdateTime("+i+", this.innerHTML);'>"+demo_appointments[i]["time"]+"</div>" + 
    "    </div>" + 
    "  </div>";
  }
  var element = document.getElementById("appointments");
  if (element)
  {
    element.innerHTML = innerHTML;
  }
}

function RemoveAppointment(row)
{
  demo_appointments.splice(row,1);
  RePopulateAppointments();
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;
  SetCalendarStorage(GetCalendarLocal());
}


function SetDate(date)
{
  currentDate = date;

  var dateuid = DateUidString(currentDate);
  demo_appointments = GetCalendarLocal()[dateuid];
  if (demo_appointments == null)
  {
    demo_appointments = [];
  }

  if (currentDate)
  {
    var element;
    
    element = document.getElementById("monthtitle");
    if (element)
    {
      element.innerHTML = GetMonth(currentDate)+" "+currentDate.getFullYear();
    }
    element = document.getElementById("dayofweek");
    if (element)
    {
      element.innerHTML = GetDayOfWeek(currentDate);
    }
    element = document.getElementById("datestr");
    if (element)
    {
      element.innerHTML = GetDate(currentDate)+" "+GetMonth(currentDate)+" "+GetYear(currentDate);
    }

    var daysinmonth = DaysInMonth(currentDate);
    var previousmonth = GoStepMonth(CloneDate(currentDate), -1);
    var daysinpreviousmonth = DaysInMonth(previousmonth);
    var nextmonth = GoStepMonth(CloneDate(currentDate), +1);
    var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
    var firstdayinweek = firstDay.getDay()-1;
    if (firstdayinweek < 0) firstdayinweek+=7;


    var afterto = (35-daysinmonth-firstdayinweek);
    if (afterto<0)
    {
      afterto+=7;
    }

    RePopulateMonthView([daysinpreviousmonth-firstdayinweek+1, daysinpreviousmonth], [1,daysinmonth], [1,afterto]);


    RePopulateAppointments();
  }
}


var currentDate;

var prev_onload = window.onload;
window.onload = onloadThisScript;
function onloadThisScript()
{
  if (prev_onload)
  {
    prev_onload();
  }
  
  SetCalendarLocal(GetCalendarStorage());
  SetMemberLocal(GetMemberStorage());
  SetDate(TodayDate());
  SetCurrentMember();
}


function GoStepMonth(date, step)
{
  var year  = date.getFullYear();
  var month = (date.getMonth() + step);
  while (month < 0)
  {
    year--;
    month += 12;
  }
  while (month > 11)
  {
    year++;
    month -= 12;
  }

  date.setFullYear(year);
  date.setMonth(month);
  return date;
}


function GoMonth(step)
{
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;

/*
alert("someLocalStorage[calendarversion] = "+JSON.stringify(someLocalStorage[calendarversion]));
alert("someLocalStorage[calendarversion][DateUidString(currentDate)] = "+JSON.stringify(someLocalStorage[calendarversion][DateUidString(currentDate)]));
*/

  SetCalendarStorage(GetCalendarLocal());
  currentDate = GoStepMonth(currentDate, step);
  SetDate(currentDate);
}

function SetDayOfMonth(dayofmonth)
{
  GetCalendarLocal()[DateUidString(currentDate)] = demo_appointments;

/*
alert("someLocalStorage[calendarversion] = "+JSON.stringify(someLocalStorage[calendarversion]));
alert("someLocalStorage[calendarversion][DateUidString(currentDate)] = "+JSON.stringify(someLocalStorage[calendarversion][DateUidString(currentDate)]));
*/

  SetCalendarStorage(GetCalendarLocal());
  currentDate.setDate(dayofmonth);
  SetDate(currentDate);
}


var weekday = 
[
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

var monthName = 
[
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


/*
  Relevant getter methods from date:
    getDate()       day of month (1-31)
    getDay()        day of week (0-6)
    getFullYear()   year
    getMonth()      month 0-11
*/

function GetDayOfWeek(date)
{
  return weekday[date.getDay()];
}

function GetDate(date)
{
  return ""+date.getDate();
}

function GetMonth(date)
{
  return monthName[date.getMonth()];
}

function GetYear(date)
{
  return date.getFullYear();
}

function TodayDate()
{
  return new Date();
}

function CreateDate(year, month, day)
{
  return new Date(year, month, day, 0, 0, 0, 0);
}

function CloneDate(date)
{
  return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
}

function DateUidString(date)
{
  return ""+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
}

function RePopulateMonthView(pre, month, post)
{
  var innerHTML = "";
  var i;

  for (i=pre[0];i<=pre[1];i++)
  {
    innerHTML = innerHTML + "<li class='previousmonth unselectable'>"+i+"</li>";
  }

  var todatDate = GetDate(currentDate);
  for (i=month[0];i<=month[1];i++)
  {
    var activeStr = "";
    if (i == todatDate)
    {
      activeStr = " active ";
    }
    innerHTML = innerHTML + "<li class='thismonth unselectable "+activeStr+"' onclick='javascript:SetDayOfMonth("+i+");'>"+i+"</li>";
  }
  for (i=post[0];i<=post[1];i++)
  {
    innerHTML = innerHTML + "<li class='previousmonth'>"+i+"</li>";
  }

  var element = document.getElementById("days");
  if (element)
  {
    element.innerHTML = innerHTML;
  }
}




function DaysInMonth(date)
{
  var leapyear = ((date.getFullYear() % 4) == 0 ? 1 : 0);
  switch (date.getMonth())
  {
  case  0: return 31; // jan
  case  1: return 28+leapyear; // feb
  case  2: return 31; // mar
  case  3: return 30; // apr
  case  4: return 31; // may
  case  5: return 30; // jun
  case  6: return 31; // jul
  case  7: return 31; // aug
  case  8: return 30; // sep
  case  9: return 31; // oct
  case 10: return 30; // nov
  case 11: return 31; // dec
  }
}


function ResetLocalStorage()
{
  SetCalendarStorage({});
  SetMemberStorage(
[
  "Member1ClickToChange",
  "Member2ClickToChange",
  "Member3ClickToChange",
  "Member4ClickToChange",
  "Member5ClickToChange",
  "Member6ClickToChange",
  "Member7ClickToChange",
  "Member8ClickToChange",
  "Member9ClickToChange",
  "Member10ClickToChange",
  "Member11ClickToChange",
  "Member12ClickToChange",
]
  );
}

function SetCalendarStorage(calendar)
{
  var stringified = JSON.stringify(calendar);
  localStorage.setItem(calendarversion,stringified);
}

function GetCalendarStorage()
{
  var stringified = localStorage.getItem(calendarversion);
  var result = JSON.parse(stringified)
  if (result == null)
  {
    result = {};
  }
  return result;
}


function SetMemberStorage(members)
{
  var stringified = JSON.stringify(members);
  localStorage.setItem(memberversion,stringified);
}

function GetMemberStorage()
{
  var stringified = localStorage.getItem(memberversion);
  var result = JSON.parse(stringified)
  if (result == null)
  {
    result = 
[
  "Member1ClickToChange",
  "Member2ClickToChange",
  "Member3ClickToChange",
  "Member4ClickToChange",
  "Member5ClickToChange",
  "Member6ClickToChange",
  "Member7ClickToChange",
  "Member8ClickToChange",
  "Member9ClickToChange",
  "Member10ClickToChange",
  "Member11ClickToChange",
  "Member12ClickToChange",
];


  }
  return result;
}








function preventEnter(e)
{
  if (e.keyCode === 10 || e.keyCode === 13)
  {
    e.preventDefault();
  }
}





