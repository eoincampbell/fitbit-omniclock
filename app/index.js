import clock  from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { user } from "user-profile";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { battery } from "power";

import * as util from "../common/utils";

clock.granularity = "seconds";

const timeData = document.getElementById("time-data");

const dateData = document.getElementById("date-data");

const bpmData = document.getElementById("bpm-data");
const rhrData = document.getElementById("rhr-data");

const stepsData = document.getElementById("steps-data");
const calsData = document.getElementById("cals-data");
const distData = document.getElementById("dist-data");
const flrData = document.getElementById("flr-data");
const actData = document.getElementById("act-data");
const battData = document.getElementById("batt-data");

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//Time & Date
clock.ontick = (evt) => {
  let d = evt.date;
  let h = d.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    h = h % 12 || 12;
  } else {
    // 24h format
    h = util.zeroPad(h);
  }
  let m = util.zeroPad(d.getMinutes());
  let s = util.zeroPad(d.getSeconds());
  timeData.text = `${h}:${m}:${s}`;
  
  let day = dayNames[d.getDay()];
  let date = util.zeroPad(d.getDate());
  let month = monthNames[d.getMonth()];
  
  dateData.text = `${day} ${date} ${month}`;
}

const hrm = new HeartRateSensor({ frequency: 5 });
hrm.addEventListener("reading", () => {
  bpmData.text = hrm.heartRate;
});
hrm.start();

const body = new BodyPresenceSensor();
body.start();

display.addEventListener("change", function() {

  if(display.on) {
    body.start();
  } else {
    body.stop();
  }
  
  if (display.on && body.present) {
    hrm.start();
  } else {
    hrm.stop();
    bpmData.text = "-"
  }
  
})

battery.onchange = (charger, evt) => {
  if(battery.charging) {
    battData.text = "+" + Math.floor(battery.chargeLevel) + "%";
  } else { 
    battData.text = Math.floor(battery.chargeLevel) + "%";
  }
}



function updateDisplay()
{
  stepsData.text = today.adjusted.steps;
  calsData.text = today.adjusted.calories;
  flrData.text = today.adjusted.elevationGain;
  actData.text = today.adjusted.activeMinutes;
  distData.text = `${today.adjusted.distance}m`
  rhrData.text = user.restingHeartRate || "-";
  
  if(battery.charging) {
    battData.text = "+" + Math.floor(battery.chargeLevel) + "%";
  } else { 
    battData.text = Math.floor(battery.chargeLevel) + "%";
  }
}  


setInterval(updateDisplay, 5000);