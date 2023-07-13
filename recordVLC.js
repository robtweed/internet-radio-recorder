let spawn = require('child_process').spawn;
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


