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

import { spawn } from 'node:child_process';
let file = process.argv[2];
let url = process.argv[3];
let ext = process.argv[4];
let vlc = process.argv[5];

let pid;

let lines = [];

console.log(process.pid + ': ' + file);

process.on('message', function(data) {
  if (data.stop) {
    console.log('message received - killing ' + pid);
    let cmd = spawn('kill', ['-9', pid]);
    console.log('Recording finished');
    process.exit();
  }   
});

let vlcParams = [
  '-I',
  'rc',
  url,
  '--sout',
  'file/ts:' + file + ext
]; 

console.log('vlcParams = ' + JSON.stringify(vlcParams));
 
let vlcProc = spawn(vlc, vlcParams);
vlcProc.stderr.on('data', function(data) {
  console.log('stderr: ' + data);
});

console.log('VLC is now recording Internet Radio to file ' + file);
pid = vlcProc.pid;
console.log('VLC process: ' + pid);


