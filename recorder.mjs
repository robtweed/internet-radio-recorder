/*!

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

//  Note: you must have installed VLC on your MacOS system

//  Standalone test using VLC in OS X:
// /Applications/VLC.app/Contents/MacOS/VLC -I rc http://a.files.bbci.co.uk/media/live/manifesto/audio/simulcast/hls/uk/sbr_high/ak/bbc_radio_three.m3u8 --sout file/ts:vlc-test.mp4


import { open } from 'node:fs/promises';
import {recorder} from './inet-radio-recorder.mjs';

let radio_recorder = function(paramsPath, schedulePath) {

  let schedule = {};

  async function scheduleReader(filePath, extend_time) {
    const file = await open(filePath);

    for await (const line of file.readLines()) {
      let pcs = line.split(' ');

      let start = pcs[1].split(':');
      let mins = (+start[0] * 60) + (+start[1]) - extend_time;
      let hr = Math.floor(mins/60);
      if (hr < 10) hr = '0' + hr;
      let min = mins%60;
      if (min < 10) min = '0' + min;
      start = hr + ':' + min;

      if (pcs[2] === '00:00') pcs[2] = '24:00';
      let end = pcs[2].split(':');
      mins = (+end[0] * 60) + (+end[1]) + extend_time;
      hr = Math.floor(mins/60);
      if (hr < 10) hr = '0' + hr;
      min = mins%60;
      if (min < 10) min = '0' + min;
      end = hr + ':' + min;
      if (hr > 23) end = '23:59';

      let d = pcs[0].split('/');
      let dd = d[0];
      let mm = d[1];
      let yyyy = d[2];
      if (!schedule[yyyy]) {
        schedule[yyyy] = {};
      }
      if (!schedule[yyyy][mm]) {
        schedule[yyyy][mm] = {};
      }
      if (!schedule[yyyy][mm][dd]) {
        schedule[yyyy][mm][dd] = {};
      }
      schedule[yyyy][mm][dd][start] = end;
    }
    await file.close();
  }

  async function fileReader(filePath) {
    let lines = [];
    const file = await open(filePath);
    for await (const line of file.readLines()) {
      lines.push(line);
    }
    await file.close();
    return lines;
  }

  // params.txt content:

  // line 0 = internet radio url
  // line 1 = output root file path
  // line 2 = file extension for audio file (eg .mp4)
  // line 3 = Application path for VLC
  // line 4 = no of minutes to deduct from start time and add to end time (optional, default = 0)
 
  let params = await fileReader(paramsPath);

  console.log('Using URL: ' + params[0]);
  console.log('Output files to ' + params[1]);
  console.log('File extension: ' + params[2]);
  console.log('VLC Application path: ' + params[3]);

  let extend_time = +params[4] || 0;
  console.log('Extend scheduled times by +/- ' + extend_time + ' minutes');

  // schedule content:

  // date start-time end-time
  // 
  // dd/mm/yyyy hh:mm hh:mm
  // 
  // eg:
  // 30/07/2023 19:45 21:00

  await scheduleReader(schedulePath, extend_time);

  console.log('Schedule:');
  console.log(JSON.stringify(schedule, null, 2));

  recorder(schedule, params[0], params[1], params[2], params[3]);

};
export {radio_recorder};
