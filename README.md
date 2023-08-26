# internet-radio-recorder: Node.js VLC-Based Internet Radio Recorder for MacOS
 
Rob Tweed <rtweed@mgateway.com>  
13 July 2023, MGateway Ltd [https://www.mgateway.com](https://www.mgateway.com)  

Twitter: @rtweed


## What is internet-radio-recorder?

*internet-radio-recorder* is a Node.js module for unnattended scheduled recording of Internet Radio Streams.

It has been designed specifically for use with the high-quality BBC radio streams, but could be adapted for use with other Internet Radio Streams.

## What are its dependencies?

*internet-radio-recorder* is designed for use with Node.js version 18.11 or later.  You need to have installed Node.js on your MacOS system (I recommend using [NVM](https://github.com/nvm-sh/nvm) to install and update Node.js).

*internet-radio-recorder* has been developed for use on MacOS systems.  It would be relatively straightforward to adapt it for use with other operating systems.

*internet-radio-recorder* requires the [VLC Media Player](https://www.videolan.org/) 
to have been pre-installed on the system, and uses its command-line API to record the stream to a file.

You will need to find the file path in which VLC is installed.  This is typically something like:

        /Applications/VLC.app/


## Can you schedule programmes?

Yes! *internet-radio-recorder* has been designed to work with a simple schedule text file in which you 
specify the programme(s) you want to record.  Once you set the module running, you can leave it
unattended to automatically record scheduled programmes.

I actually wrote and designed *internet-radio-recorder* to record the BBC Proms broadcasts, and you'll find an example
schedule file for the first part of the 2023 BBC Proms season included in the installation repository.  Simply edit this file to your own needs.

You'll see that the schedule is defined by each line of the file specifying three values separated by a space:

- the Date (in dd/mm/yyyy format)
- the Start Time (in hh:mm 24-hour format)
- the End Time (in hh:mm 24-hour format)

eg:

        13/07/2023 19:25 20:55

**Note that this version does not allow for programmes that extend beyond midnight into the next day!**


## Installing internet-radio-recorder

        npm install internet-radio-recorder


## Using internet-radio-recorder to Record from a BBC Radio Internet Stream

The easiest way to use the *internet-radio-recorder* module is to use my pre-built installation repository.

The current version will only run on an Apple Mac computer running MacOS (any version).

Make sure you have the following installed on your computer:

- Node.js version 18.11 or later
- VLC (version 3.x or later)
- git (this is usually included in XCode on a Mac, but other options may be available - check on Google).


Now do the following using the MacOS Terminal window:

- Navigate to the folder of your choice, and then clone my BBC Radio Recorder repository:

        git clone https://github.com/robtweed/bbc-radio-recorder

  You'll now have a new folder named *bbc-radio-recorder* containing everything you need to get started.


- Switch to this folder:

        cd bbc-radio-recorder

- Install the *internet-radio-recorder* module:

        npm install


- You'll see two text files in the *bbc-radio-recorder* folder:

  - schedule.txt

    This is the schedule file.  Use the included copy as a starting point and edit it as needed.  See the earlier section above that describes its format.

  - params.txt

    This allows you to customise the recorder for your own system.  Use the included copy as a starting point and edit it as needed.

    This file consists of 4 or 5 lines:

    - Line 1: the URL for the Internet Radio Stream you want to use

      You can use this 
[list of the most current URLs for every BBC Radio channel](https://gist.github.com/bpsib/67089b959e4fa898af69fea59ad74bc3)

    - Line 2: The file path into which you want *internet-radio-recorder* to create its files.  Note that this folder must already exist before running *internet-radio-recorder*
    - Line 3: The file extension for the files that *internet-radio-recorder* will create.  For the BBC High Quality streams, you should use *.mp4*.
    - Line 4: The file path in which VLC is installed, eg */Applications/VLC*
    - Line 5: This line is optional and allows you to specify a number of minutes that is deducted from each scheduled start time and added to each scheduled end time.  This can be useful to ensure that VLC's recorded stream has properly stabilised and to ensure you don't prematurely cut off the end of the programme.  I'd suggest a value of 2 for this line.

You're now ready to run the recorder.


## Running internet-radio-recorder

Make sure you're in the *bbc-radio-recorder* folder, and then type:

        npm start

The recorder will now start up, first reading and formatting your parameters and schedule into its own internal format.

It takes a minute before it begins to process the schedule, so be patient.

The recorder is designed to be a long-running script (eg running for days or weeks), so you can safely leave it to run on your Mac.  Of course you'll need to leave your Mac running whenever you run the *internet-raddio-recorder*.

When started, or at the start of each new day, it checks the schedule for any programmed events.

Every minute it checks the time to see whether it needs to start a scheduled recording.  If so, it spawns a new VLC process to record the programme.

If a recording is in progress, then at each minute, it also checks to see whether it matches any scheduled end time.  If so it sends a *kill* message to the VLC process which terminates the recording.

## Stopping internet-radio-recorder

Simply stop the recorder process by typing *CTRL & C*.


## Restarting internet-radio-recorder

You can safely restart the recorder by typing:

        npm start

It will ignore any earlier dates and times in the *schedule.txt* file and carry on from the current date and time.  If you've edited the *schedule.txt* file, it will take account of any changes/additions you've made.


## Playing Back Recordings

You'll find your recording files in the folder you specified in the *params.txt* file.  You'll see that the file name is created from the scheduled start time, eg:

        Wed-Jul-12-2023_18-47.mp4

You can now play back these files using a media player such as VLC or any other media player that is capable of supporting *MP4* files.  Note that QuickTime cannot play back these files.

## Editing Recordings

You can edit and transcode the recordings using a suitable audio editor.  I recommend the Free, Open Source 
[Audacity](https://www.audacityteam.org/) editor for this.


Enjoy listening to your BBC Radio Recordings with all their high quality audio sound!!

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


