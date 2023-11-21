[Back to Readme](../README.md#slingbox-channel-changer-functionality)

## Receiving Data From Server: SlingBox channel changer functionality

To use the app as a channel changer, its URL needs two additional parameters:
1. the Slinger Server URL.
2. the Slinger Server Wrapper URL.


Example:<br />
`http://192.168.1.10/TvGuideWebSite/TvGuide.html?slingServerUrl=http://192.168.1.10:65432&slingRemoteControlUrl=http://192.168.1.10:5196/api/post-to-url`

In the example above, the URL of the web page is `http://192.168.1.10/TvGuideWebSite/TvGuide.html`
1. the URL of the Slinger Server is passed as the parameter `slingServerUrl`: `slingServerUrl=http://192.168.1.10:65432`
2. the URL of the Slinger Server Wrapper is passed as the parameter `slingRemoteControlUrl`: `slingRemoteControlUrl=http://192.168.1.10:5196/api/post-to-url`


Once these two parameters are passed to the web page, the app will be able to change the channels in the SlingBox(es).<br />
It will do this by establishing a SignalR connection with the Slinger Server Wrapper
- to get information about the SlingBoxes activity (status): (`streaming in progress,` `channel changed`, `streaming stopped`, `slingBox bricked`, `remote locked`)
- to send send channel change commands to the Slinger Server Wrapper. This will further send them to the Slinger Server by using the URL received via the `slingServerUrl` parameter.<br />


Reminder: You need to ensure **exact match** between the slingBox name in the data source and the slingBox name in the Slinger Server.<br />


[Back to Readme](../README.md#slingbox-channel-changer-functionality)