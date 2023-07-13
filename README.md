# internet-radio-recorder: Node.js VLC-Based Internet Radio Recorder for MacOS
 
Rob Tweed <rtweed@mgateway.com>  
13 July 2023, MGateway Ltd [https://www.mgateway.com](https://www.mgateway.com)  

Twitter: @rtweed


## What is internet-radio-recorder?

*internet-radio-recorder* is a Node.js module for recording Internet Radio Streams.

It has been designed specifically for use with the high-quality BBC radio streams, but could be adapted for use with other Internet Radio Streams.

## What are its dependencies?

*internet-radio-recorder* is designed for use with Node.js version 18 or later.  You need to have installed Node.js on your MacOS system (I recommend using [NVM](https://github.com/nvm-sh/nvm) to install and update Node.js).

*internet-radio-recorder* has been developed for use on MacOS systems.  It would be relatively straightforward to adapt it for use with other operating systems.

*internet-radio-recorder* requires the [VLC Media Player](https://www.videolan.org/) 
to have been pre-installed on the system, and uses its command-line API to record the stream to a file.

You will need to find the file path in which VLC is installed.  This is typically something like:

        /Applications/VLC.app/


## Can you schedule programmes?

Yes! *internet-radio-recorder* has been designed to work with a simple schedule text file in which you 
specify the programme(s) you want to record.

I actually wrote and designed *internet-radio-recorder* to record the BBC Proms broadcasts, and you'll find an example
schedule file for the first part of the 2023 BBC Proms season included in the repository.  Simply edit this file to your own needs.

You'll see that the schedule is defined by each line of the file specifying three values separated by a space:

- the Date (in dd/mm/yyyy format)
- the Start Time (in hh:mm 24-hour format)
- the End Time (in hh:mm 24-hour format)

eg:

        13/07/2023 19:25 20:55

**Note that this version does not allow for programmes that extend beyond midnight into the next day!**


## Installing internet-radio-recorder




## Configuring internet-radio-recorder

- Create a folder on your MacOS system for your *internet-radio-recorder* system, eg:

         /Users/xxxxx/recorder

- Switch to this folder:

        cd /Users/xxxxx/recorder

- Install *internet-radio-recorder*

        npm install internet-radio-recorder


- You now need to create two text files in this folder:

- schedule.txt

  This is the schedule file.  Use the included copy as a starting point and edit it as needed.  See the earlier section above that describes its format.

- params.txt

  This allows you to customise *internet-radio-recorder* for your own system.  Use the included copy as a starting point and edit it as needed.

  This file consists of 4 or 5 lines:

  - Line 1: the URL for the Internet Radio Stream you want to use
  - Line 2: The file path into which you want *internet-radio-recorder* to create its files.  Note that this folder must already exist before running *internet-radio-recorder*
  - Line 3: The file extension for the files that *internet-radio-recorder* will create.  For the BBC High Quality streams, you should use *.mp4*.
  - Line 4: The file path in which VLC is installed, eg */Applications/VLC*
  - Line 5: This line is optional and allows you to specify a number of minutes that is deducted from each scheduled start time and added to each scheduled end time.  This can be useful to ensure that VLC's recorded stream has properly stabilised and to ensure you don't prematurely cut off the end of the programme.  I'd suggest a value of 2 for this line.

## Running internet-radio-recorder

Make sure you're in the folder where you've created the two text files (schedule.txt and params.txt).  Then type:

        nvm start

The recorder is designed to be a long-running script (eg running for days or weeks).

When started, or at the start of each new day, it checks the schedule for any programmed events.

Every minute it checks the time to see whether it needs to start a scheduled recording.  If so, it spawns a new VLC process to record the programme.

If a recording is in progress, then at each minute, it also checks to see whether it matches any scheduled end time.  If so it sends a *kill* message to the VLC process which terminates the recording.

## Stopping internet-radio-recorder

Simply stop the recorder process by typing *CTRL & C*.


## Playing Back Recordings

You'll find your recording files in the folder you specified in the *params.txt* file.  You'll see that the file name is created from the scheduled start time, eg:

        Wed-Jul-12-2023_18-47.mp4

You can now play back these files using a media player such as VLC or any other media player that is capable of supporting *MP4* files.  Note that QuickTime cannot play back these files.

## Editing Recordings

You can edit and transcode the recordings using a suitable audio editor.  I recommend the Free, Open Source 
[Audacity](https://www.audacityteam.org/) editor for this.


## License

 Copyright (c) 2023 MGateway Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  https://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.  


