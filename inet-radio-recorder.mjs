/*

 --------------------------------------------------------------------------------
 | internet-radio-recorder: Node.js and VLC-based MacOS Internet Radio recorder |
 |                                                                              |
 | Copyright (c) 2016-23 MGateway Ltd,                                          |
 | Redhill, Surrey UK.                                                          |
 | All rights reserved.                                                         |
 |                                                                              |
 | http://www.mgateway.com                                                      |
 | Email: rtweed@mgateway.com                                                   |
 |                                                                              |
 |                                                                              |
 | Licensed under the Apache License, Version 2.0 (the "License");              |
 | you may not use this file except in compliance with the License.             |
 | You may obtain a copy of the License at                                      |
 |                                                                              |
 |     http://www.apache.org/licenses/LICENSE-2.0                               |
 |                                                                              |
 | Unless required by applicable law or agreed to in writing, software          |
 | distributed under the License is distributed on an "AS IS" BASIS,            |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     |
 | See the License for the specific language governing permissions and          |
 |  limitations under the License.                                              |
 --------------------------------------------------------------------------------

*/

import { fork } from 'node:child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = {};
let startTimes = {};
let endTimes = {};
let timetable = {};
let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

let recorder = function(schedule, url, filePath, ext, vlcPath) {

  if (vlcPath.slice(-1) !== '/') vlcPath = vlcPath + '/';
  vlcPath = vlcPath + 'Contents/MacOS/VLC';

  let started = true;

  // check every minute
  setInterval(function() {
    let now = new Date();
    let minute = parseInt(now.getMinutes());
    if (minute < 10) minute = '0' + minute;
    let hour = parseInt(now.getHours());
    if (hour < 10) hour = '0' + hour;
    let day = parseInt(now.getDate());
    let daylc = days[now.getDay()];
    let month = parseInt(now.getMonth()) + 1;
    let year = parseInt(now.getFullYear());
  
    let time = hour + ':' + minute;
    let today;

    console.log('checking: ' + hour + ':' + minute + ' ' + day + '-' + month + '-' + year);

    // build today's schedule if just started or 1 min past midnight...

    if (started || (hour === '00' && minute === '01')) {
      started = false;
      // load today's schedule if it exists
      startTimes = {};
      endTimes = {};
      if (schedule[year] && schedule[year][month] && schedule[year][month][day]) {
        today = schedule[year][month][day];
        for (let startTime in today) {
          startTimes[startTime] = true;
          endTimes[today[startTime]] = startTime;
        }
      }

      if (schedule.every && schedule.every[daylc]) {
        today = schedule.every[daylc];
        //console.log('today = ' + JSON.stringify(today));
        for (let startTime in today) {
          startTimes[startTime] = true;
          endTimes[today[startTime]] = startTime;
        }
      }
      console.log("today's schedule:");
      console.log('startTimes: ' + JSON.stringify(startTimes));
      console.log('endTimes: ' + JSON.stringify(endTimes));
    }

    if (startTimes[time]) {  
      console.log('start time found');
      let date = now.toDateString();
      date = date.replace(/\s/g, "-");

      if (filePath.slice(-1) !== '/') filePath = filePath + '/';

      let file = filePath + date + '_' + hour + '-' + minute;
      var params = [file, url, ext, vlcPath];
      console.log('forking worker');
      tasks[time] = fork(__dirname + '/recordVLC.mjs', params);
    }
  
    if (endTimes[time]) {
      var startTime = endTimes[time];
      console.log('sending stop');
      if (tasks[startTime]) tasks[startTime].send({stop: true});
      delete startTimes[startTime];
      delete endTimes[time];
      setTimeout(function() {
        delete tasks[startTime];
      }, 5000);
    }  
  }, 60000); //every minute
};

export {recorder};

