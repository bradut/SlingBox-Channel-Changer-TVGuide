﻿# SlingBox Channel-Changer TvGuide #

Web app with a TV Guide and means to change the channels in your SlingBox&trade; devices.

It can work as a TV Guide, as a channel changer or as both, integrated with the [Slinger Player](https://github.com/GerryDazoo/SlingerPlayer) or independently of it.


<p align="center">
<img src="./Docs/images/demo_mobile_mic_02.gif" alt="TvGuide integrated with Slinger Player for Android" height="400"/>
<img src="./Docs/images/demo_desktop_mic_021.gif" alt="TvGuide integrated with Slinger Player for Windows" height="400"/><br />
TvGuide integrated with Slinger Player for Android and for Windows
</p>


## Table of Contents

- [Overview](#overview)
    * [TV Guide](#tv-guide)
    * [SlingBox channel changer](#slingbox-channel-changer)
 - [Configuration](#configuration)
 - [Functionality](#functionality)
   * [TV Guide functionality](#tv-guide-functionality)
   * [SlingBox channel changer functionality](#slingbox-channel-changer-functionality)
- [Getting Started](#getting-started)
- [Obtaining TV Guide data](#obtaining-tv-guide-data)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Disclaimer](#disclaimer)

## Overview

This app offers a convenient way to view programs info and select channels on your SlingBox&trade; devices.<br />
Such functionality, also referred as [interactive electronic program guide (IPG)](https://en.wikipedia.org/wiki/Electronic_program_guide) 
was originally provided by the SlingPlayer&trade; app (only for digital channels in USA and Canada) but the [service has been discontinued](https://www.slingbox.com/) as of 9 Nov.2022.<br />

It started as a TV Guide in 2020, and then, in 2023, it was extended to include the channel changer functionality.<br />

The channel changer functionality is possible due to Gerry Dazoo's [open source project Slinger Server](https://github.com/GerryDazoo/Slinger/tree/main/CustomRemotes) which currently 
is the most complete and robust solution to use SlingBoxes, and provides complex remote controls.<br />
Therefore this app is not meant to replace but to complement these remote controls with [IPG](https://en.wikipedia.org/wiki/Electronic_program_guide) capability.<br />


Requirements:
- a data source that provides information about TV channels and programs
- a Slinger Server Wrapper that controls the SlingBoxes.

These three components (TvGuide Web App, TvGuide Data Source and the SlingBox Server) 
can be located in the same machine or in different machines: in the same network or across the Internet.

[//]: # (<p style="text-align: center;">)
<p align="center">
<img src="./Docs/images/Diagram - TvGuideWebPage - only.jpg" alt="TvGuide Overview" height="229"><br />
System Architecture - TvGuide Web App, TvGuide Data Source and SlingBox Server
</p>

<br />

### TV Guide
As a **TV Guide**, the app requires a data source that provides information about channels and programs. <br />
Such data source can be a WebAPI service  (_not provided here_)<br />

In this app, the TV Guide and the SlingBoxes channel changer functionalities are independent of each other, 
but when provided with channel numbers the TV Guide will display them as inactive/disabled buttons.

<br />

### SlingBox channel changer
As a **channel changer**, the data source can be:
- a WebAPI service with channels and programs data,
- static JSON files with channels data and (empty) programs data.

In order to work:
 - It must have access my [Slinger Server Wrapper](https://github.com/bradut/SlingBox-Channel-Changer-Server) which, in turn, talks to Slinger Server
which controls the SlingBoxes.<br />
- It can be integrated with the [Slinger Player](https://github.com/GerryDazoo/SlingerPlayer) app 
that is used to display the video stream.<br />
- It can be launched independently of Slinger Player, directly in a browser, 
usually when being used as a remote control for Smart TVs which stream from SlingBoxes via [VLC](https://www.videolan.org/). (Please see the images below)<br />

<p align="center">
<img src="./Docs/images/demo_mobile_solo_mic_600.gif" alt="TvGuide used as a remote control for TVs" height="450"/><br />
TV Guide and channel changer used as a standalone webpage for remote controlling Smart TVs
</p>

<p align="center">
<img src="./Docs/images/demo_tv_remote.gif" alt="TvGuide used as a remote control for TVs" height="500"/><br />
Utilizing QR Codes: Extracting TV Guide URL for Seamless Remote Control of Smart TVs with VLC Player
</p>
<br />
<br />

## Configuration
Configure the app by modifying the files in the `config\` sub-directory.<br />

-   Indicate the environment type (`development`, `production`, etc.) in the file `config\environment.json`.<br />
-   As a result the app will set its data source for that environment type.<br />
For example, here is how we set the environment type as `mockdata_1_sling`:
```json
 {
   "environment": "mockdata_1_sling",
   "_suggested_values": "development, mockdata_3_slings, mockdata_2_slings, mockdata_1_sling, mockdata_0_slings, mock_CA_BC_TLS, staging, production"
  }
 ```
In the example above where the environment is `mockdata_1_slings`, the webpage
will first read the default settings from file `config\appsettings.json`,
and then the URLs to the data source from file `config\appsettings.mockdata_1_slings.json`.<br />

(See the explanations in the [Configuration](./Docs/Configuration.md) file.)

The app comes pre-loaded with a few mock data sources that can be used for testing purposes or instead of a real data source.<br />
- mockdata_0_slings: 0 SlingBoxes, 6 channels, 3 programs
- mockdata_1_sling: 1 SlingBox, 6 channels, 3 programs
- mockdata_2_slings: 2 SlingBoxes, 6 channels, 3 programs
- mockdata_3_slings: 3 SlingBoxes, 6 channels, 3 programs
- mock_CA_BC_TLS: 1 SlingBox, 10 channels, 0 programs
(simulates a cable provider in British Columbia, Canada)

IMPORTANT: To use these mock data sources to change channels, you have to modify the SlingBox names in the file `data\tvchannel_[...].json` 
to match the names of your SlingBoxes declared in the Slinger project on your computer, in the file `config.ini` or `unified_config.ini`.<br />
(The SlingBox names in the config.ini can be different from the names of the SlingBox devices).<br />

<p align="center">
<img src="./Docs/images/demo_desktop_digital_full-1.gif" alt="static data" height=500><br>
Using static data to enable channel changing (channels are hard-coded)
</p>

Therefore, by using mock data instead of a real-time data source, you can still 
use the app as a channel changer.


See more details in the [Configuration](./Docs/Configuration.md) file.

Note: when changing the configuration files, you need to **restart the app** from the menu in order to apply the changes:<br /> 
<p align="center">
<img src="./Docs/images/refresh_page.jpg" alt="refreshing the page" height=300><br/>
"Refresh page" is restarting the app to apply the changes

</p>

## Functionality
The app reads TV Guide info from data source via the URLs indicated in the configuration file.<br />
When its URL contains certain parameters which indicate the presence of Slinger Server Wrapper, 
the app will use them to change the channels in the SlingBox(es).<br />


### TV Guide functionality

The app, upon launch, will read TV info from its data source and will cache some of it.<br />
The TV Guide data source must provide the following information:

* **1.1. Local Date & Time of the TV Station**<br />
  Utilized to display the TV programs adjusted to the local time of the device which browse the TV Guide.<br />


* **1.2. TV Channels**<br />
  Utilized to display the TV channels and, optionally, the channel numbers of the slingBoxes that stream them <br />
**Important:**  the name of the slingBox is provided by the data source, and should be the same as the name of the slingBox in the Slinger Server.<br /> 


* **1.3. TV Programs**<br />
  The date-time of the TV programs corresponds to the local time of the TV Station.<br />
  The app will adjust the date-time of the TV programs to the local time of the device which browses the TV Guide.<br />

See more details in the [DataSource](./Docs/DataSource.md) file.

<br />

### SlingBox channel changer functionality

Channel changer functionality is provided by the Slinger Server Wrapper:<br />
1. The Server pushes notifications to this app about the following streaming events of the SlingBoxes
   - `streaming in progress` 
   - `streaming stopped` 
   - `channel changed` 
   - `slingbox bricked`
   - `remote locked` <br />
2. The app reacts to these notifications by updating the UI accordingly.<br />
3. The app queries periodically the Server to receive an updated Server Status.<br />

To use the app as a channel changer, its URL needs two additional parameters:
1. the Slinger Server URL.
2. the Slinger Server Wrapper URL. 

**What are the Slinger Server and the Slinger Server Wrapper?**<br />
- The **Slinger Server**, as mentioned already, is the server that controls the SlingBoxes. 
  It is created by Gerry Dazoo and is available on GitHub at the address indicated above.<br />
- The **Slinger Server Wrapper** is a bridge between the Slinger Server and the web page of the TvGuide app.<br />
  It "wraps" the Slinger Server and provides
  - a REST API to it:
    - to send to the Slinger Server the channel change commands received from TV Guide app 
    - to send to the app information about the SlingBoxes status
  - a **SignalR** connection to the web page of the TvGuide app, which notifies the web page  
about changes in SlingBoxes' status.<br />

See more details in the [SignalR_Data_Notifications](./Docs/SignalR_Data_Notifications.md) file.

Reminder: You need to ensure **exact match** between the slingBox name in the data source and the slingBox name in the Slinger Server.<br />
<br />  

#### 2.1. How does the app work as a channel changer?

The Wrapper server notifies the web page whenever a SlingBox status changes.<br />
 - If the SlingBox is streaming, the web page will display:
   - the channel numbers as selectable/clickable buttons, 
   - the selected channel highlighted.
 <br />


 - If the SlingBox stops streaming, the Wrapper server should send a `streaming stopped` notification 
to the web page, which, in turn, will display the channel numbers as inactive buttons.<br />

When the user clicks on a channel number, the web page will send a channel change command to the Slinger Server Wrapper.<br />

# Getting Started
1. Create a website (IIS, Apache, etc.) on a web server and copy there the files from this GitHub repo.<br />
   (As web server you may use the same machine as the SlingBox Server or a different one.)<br />
   When the website is located on the Internet, make sure that the SlingBox server can be accessed via an IPV4 address or a DNS.<br />

2. Configure the app by modifying the files in the `config\` sub-directory.<br />
   See more details above in the [Configuration](#configuration) paragraph.

3. Configure the Slinger Server Wrapper.<br />
   See more details in its GitHub repo Slinger Server Wrapper.

4. Launch the app: 
   - directly in a browser by using its URL.<br />
   - from a Slinger Player app, after its modifying remote control web page to reference the URL of the app.<br />



# Obtaining TV Guide data
Without a TV data source, the app isn't as enjoyable to use.<br />

There are mainly two options to obtain TV data:
- Using a WebAPI service that provides TV data
- Scraping TV providers' websites

## Using a WebAPI service that provides TV data
Issue: Only a very few free TV data sources are available.<br />
One option is [TVmaze](https://www.tvmaze.com/api), but you will need to adapt its data format to match this app.<br />
Keep in mind that some paid APIs can be [expensive](https://developer.tvmedia.ca/pricing-plans) for home users.<br />

## Scraping a TV data website
Issue: Most, if not all, TV data websites explicitly forbid scraping.<br />
For example, SlingPlayer used TV Guide data from [Zap2it](https://tvlistings.zap2it.com/), which, 
until a few years ago, provided an API but currently [forbids scraping](https://feedback.zap2it.com/terms-of-use/).

However, there are some TV data websites that don't _seem_ to forbid scraping, such as [TV Passport](https://www.tvpassport.com/tv-listings)
## Tv Guide data format
The TV Guide data source adheres to an open-source, community-driven standard known as
[XMLTV](https://wiki.xmltv.org/index.php/XMLTVFormat), widely utilized by various tools and **scrapers**.<br />

According to the XMLTV website:
>_An XMLTV file has 2 types of records:<br />
&bull; 'channel' records, store information about channels<br />
&bull; 'program' records, store information about individual episodes_

Likewise, this app's TV Guide incorporates the same two types of records. Therefore, XMLTV may be adapted to this app.<br />


# Contributing
Contributions are welcome!<br />

If you want to contribute, please contact me first to discuss the changes.<br />

I prefer to keep this code as simple as possible, JavaScript only (no transpilers - React, Angular, etc.)
so that it can be easily understood and modified.<br />

BTW: **I am not a JavaScript developer**, so I am open to suggestions on how to improve the code.<br />

This is a personal project, and I don't have a lot of time to work on it.<br />

# License
This project is licensed under the MIT License - see the [LICENSE](./Docs/License.md) file for details

# Credits
- [Slingbox by Sling Media](https://en.wikipedia.org/wiki/Slingbox) - the device that streams TV channels over the Internet<br />
"Slingbox" is a trademarked term associated with products and services provided by Sling Media, 
a subsidiary of DISH Network Corporation.<br />
The Slingbox is a line of devices that allow users to remotely view and control their cable 
or satellite television.<br />

 
- [Slinger Server](https://github.com/GerryDazoo/Slinger) - open source server that controls the SlingBoxes, created by **Gerry Dazoo**
- [Slinger Player](https://github.com/GerryDazoo/SlingerPlayer) - video player that streams from the Slinger, created by **Gerry Dazoo**


- [ChatGPT3 by OpenAI](https://chat.openai.com/) - used to generate code, documentation and proofreading.


- [CloudConvert](https://cloudconvert.com/mp4-to-gif) - used to create animated GIFs from videos.
- [Online video cutter](https://online-video-cutter.com/crop-video) - used to crop videos
- [Draw.io](https://app.diagrams.net/) - used to create diagrams

# Disclaimer
All trademarks, logos and brand names are the property of their respective owners.<br /> 
All company, product and service names used in this app and documentation are for identification purposes only.