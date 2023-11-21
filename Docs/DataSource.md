[Back to Readme](../README.md#tv-guide-functionality)

## TV Guide functionality: Reading TV info from Data Source #

#### 1. Reading from Data Source [TV Guide functionality]

The app, upon launch, will read the data from the data source and will cache some of it.<br />
The TV data source must provide the following information:

##### 1. DateTime of the TV Station

Utilized to display the TV programs adjusted to the local time of the device which browse the TV Guide.<br />

```json
{
  "tvStationTime": "2023-11-16T20:13:52.000"
}
```
For example, when a certain program is being broadcast at 19:00 Hours (7 PM) by a TV Station
located in a different time zone (Romania), the TV Guide webpage will display
it as staring at 9:00 Hours (9 AM) on a device in Vancouver, Canada
or at 12:00 Hours on a device in New York, USA.


##### 2. TV Channels

Utilized to display the TV channels and, optionally, the channel numbers of the slingBoxes that stream them <br />
In the example below, the TV Guide will display 2 channels, each with a logo, a name and a channel number corresponding to the slingBox "sling_2":.<br />

The attributes of a slingBox are:
- `slingName` - the name of the slingBox
- `number` - the channel number of the slingBox
- `quality` - `true` if the slingBox streaming quality is good, `false` otherwise

**Important:**  the name of the slingBox is provided by the data source, and should be the same as the name of the slingBox in the Slinger Server.<br />


```json
{
  "date": "2020-09-30",
  "channels": [
    {
      "id": "tvr-1",
      "logo": "TVR 1.jpg",
      "name": "TVR 1 National News",
      "attributes": [
        {
          "slingName": "sling_2",
          "number": "0",
          "quality": "true"
        }
      ],
      "channelType": "news"
    },
    {
      "id": "tvr-2",
      "logo": "TVR 2.jpg",
      "name": "TVR 2",
      "attributes": [
        {
          "slingName": "sling_2",
          "number": "1",
          "quality": "true"
        }
      ],
      "channelType": "news"
    }
  
  ]
}
```

NOTE: When creating the channels data source, you will need to provide the images of the
TV Channel logos and store them into the directory `\Channel Logo` in the website.<br />

There can be multiple slingBoxes streaming the same channel.<br />
Here is an example of a channel with 3 slingBoxes:
```json
{
  "id": "tvr-1",
  "logo": "TVR 1.jpg",
  "name": "TVR 1 National News",
  "attributes": [
    {
      "slingName": "sling_1",
      "number": "0",
      "quality": "true"
    },
    {
      "slingName": "sling_2",
      "number": "1",
      "quality": "true"
    },
    {
      "slingName": "sling_3",
      "number": "2",
      "quality": "true"
    }
  ],
  "channelType": "news"
}
```

<p align="center">
<img src="images\demo_mobile_3_slingboxes.jpg" alt="3 slingBoxes" height=350px><br>
Three SlingBoxes / channel
</p>


##### 3. TV Programs
```json
{
    "channels": [
        {
            "id": "tvr-1",
            "programs": [
                {
                    "time": "2020-09-30T00:25:00.00Z",
                    "name": "NEWS"
                },
                {
                    "time": "2020-09-30T01:00:00.00Z",
                    "name": "SPORTS NEWS"
                },
                {
                    "time": "2020-09-30T02:00:00.00Z",
                    "name": "FILM - THE CLASSICS: The Godfather"
                }
   

            ]
        },
        {
            "id": "tvr-2",
            "programs": [
                {
                    "time": "2020-09-30T00:45:00.00Z",
                    "name": "SPORTS NEWS"
                },
                {
                    "time": "2020-09-30T01:30:00.00Z",
                    "name": "FILM"
                },
                {
                    "time": "2020-09-30T02:30:00.00Z",
                    "name": "MUSIC"
                }
       
            ]
        }
    ]
}
```
The date-time of the TV programs corresponds to the local time of the TV Station.<br />
The app will adjust the date-time of the TV programs to the local time of the device which browses the TV Guide.<br />




[Back to Readme](../README.md#tv-guide-functionality)