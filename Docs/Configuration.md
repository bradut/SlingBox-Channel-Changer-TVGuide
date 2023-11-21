[Back to Readme](../README.md#configuration)

# Configuration 

For example, when the environment is `mockdata_1_slings`, the webpage
will read the default settings in the file `config\appsettings.json`,
and then the the URLs to the data source in file `config\appsettings.mockdata_1_slings.json`.<br />
<br />
<br />

#### The content of the default configuration file `config\appsettings.json`:<br />
Here are the default values which are common to most situations, and which can be overriden
when declared later in the particular configuration files.<br />
For example, in this file the default value for `debug` is `false`,
but in the file `config\appsettings.mockdata_1_slings.json` it is set to `true` and will override the current value.

```json
{
  "hoursOfProgramsFetchedFromDb": 26,
  "cacheSettings": {
    "slingCacheSettings": {
      "slingStatusExpirationTimeMs": 30000,
      "slingChannelChangeExpirationTimeMs": 60000
    }
  },
  "debug": false,
  "pageTitleTemplate": "HtmlTemplates/TitleTemplate.html",
  
  "refreshRates": {
    "webPageRefreshRates": {
      "loadPageTimeOutMs": 30000,
      "checkCanDisableChannelButtonsTimeOutMs": 30000,
      "checkSignalRConnectionTimeoutMs": 30000
    }
  }
}
```
**The configuration values in the file  `config\appsettings.json` have the following meanings:**
- `"hoursOfProgramsFetchedFromDb": 26 `- the number of hours of programs that are fetched from the data source.<br />
  The TV Guide will read and cache TV programs for the next 26 hours and will display them without having to access periodically the data source.
- `"cacheSettings":` - settings section for the cache
- `"slingCacheSettings":` - settings section for the cache of SlingBox data
    - `"slingStatusExpirationTimeMs": 30000` - the time in milliseconds that the SlingBox status is cached.<br />
      The app reads the SlingBox status from the SlingBox server and then caches it for 30 seconds.
      Thus the SlingBox status is not read from the SlingBox server every time the app needs it.<br />
      The SlingBox server displays that it is alive and streaming every 90 seconds for each SlingBox, so 30 seconds is a good value for this setting,
      especially when there are many SlingBoxes streaming simultaneously.
    - `"slingChannelChangeExpirationTimeMs": 60000 `- the time in milliseconds that the SlingBox channel is cached.
      Used to avoid sending the same channel change command to the SlingBox server more than once within a short time.
- `"debug": false `- when set to true, it will display the debug information in the console.
- `"pageTitleTemplate": "HtmlTemplates/TitleTemplate.html" `- the HTML template for the page title.
- `"refreshRates":` - settings section for the refresh rates
    - `"webPageRefreshRates":` - settings section for the refresh rates of the web page
        - `"loadPageTimeOutMs": 30000 `- the time in milliseconds that the web page is refreshed. Useful when the data source includes TV program data (from a WebAPI service).
        - `"checkCanDisableChannelButtonsTimeOutMs": 30000 `- the time in milliseconds that the app checks if the channel buttons can be disabled.<br />
          Used to implement an workaround to check faster when the SlingBox has stopped streaming, instead of waiting for the (~90 seconds) timeout.
        - `"checkSignalRConnectionTimeoutMs": 30000` - the time in milliseconds that the app checks if the SignalR connection is alive.
          <br />
          <br />
#### The content of the configuration file with environment-specific values `config\appsettings.mockdata_1_slings.json`:<br />
```json
{
    "apiUrls": {
        "channelUiCollectionUrl": "data/tvchannel_collection1.json",
		"programCollectionUrl":"data/tvprogram_collection.json",
		"dateServiceApiUrl": "data/tvstation_datetime.json"
    },

  "debug": true,
  "pageTitleTemplate": "HtmlTemplates/TitleTemplate_mock_1_sling.html",
  
  "refreshRates": {
    "webPageRefreshRates": {
      "loadPageTimeOutMs": 30000,
      "checkCanDisableChannelButtonsTimeOutMs": 30000,
      "checkSignalRConnectionTimeoutMs": 30000
    }
  }
}
```
**The configuration values in the file  `config\appsettings.mockdata_1_slings.json` have the following meanings:**
- `"apiUrls":` - settings section for the URLs to the data source
    - `"channelUiCollectionUrl": "data/tvchannel_collection1.json"` - the URL to the file with the channels data.
    - `"programCollectionUrl":"data/tvprogram_collection.json"` - the URL to the file with the programs data.
    - `"dateServiceApiUrl": "data/tvstation_datetime.json"` - the URL to the file with the date and time of the TV Station.<br />
      When using a JSON file as data source, the date and time of the TV Station will be the same as the device local time regardless of the content of the JSON file.
- `"debug": true` - when set to true, it will display the debug information in the console.
- `"pageTitleTemplate": "HtmlTemplates/TitleTemplate_mock_1_sling.html"` - the HTML template for the page title.
- `"refreshRates":` - settings section for the refresh rates
    - `"webPageRefreshRates":` - settings section for the refresh rates of the web page
        - `"loadPageTimeOutMs": 60000` - the time in milliseconds that the web page is refreshed.<br />
          Note that this value overrides the value in the default configuration file and is higher because
          we are using mock data which doesn't have programs info.

[Back to Readme](../README.md#configuration)