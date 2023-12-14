// noinspection SpellCheckingInspection,UnnecessaryLocalVariableJS

"use strict";


// /$$$$$$                       /$$$$$$  /$$                                          /$$     /$$
// /$$__  $$                     /$$__  $$|__/                                         | $$    |__/
// | $$  \__/  /$$$$$$  /$$$$$$$ | $$  \__/ /$$  /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$
// | $$       /$$__  $$| $$__  $$| $$$$    | $$ /$$__  $$| $$  | $$ /$$__  $$|____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
// | $$      | $$  \ $$| $$  \ $$| $$_/    | $$| $$  \ $$| $$  | $$| $$  \__/ /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
// | $$    $$| $$  | $$| $$  | $$| $$      | $$| $$  | $$| $$  | $$| $$      /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
// |  $$$$$$/|  $$$$$$/| $$  | $$| $$      | $$|  $$$$$$$|  $$$$$$/| $$     |  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
//  \______/  \______/ |__/  |__/|__/      |__/ \____  $$ \______/ |__/      \_______/   \___/  |__/ \______/ |__/  |__/
//                                              /$$  \ $$                                                               
//                                              |  $$$$$$/                                                               
//                                              \______/
// Logo generated with // http://patorjk.com/software/taag/#p=testall&f=Graffiti&t=Models%0A
// Font Name: Big Money-ne

class Configuration {

    // Version can be displayed in UI
    static tvGuideVersion = "1.0.0";

    static #isConfigurationLoaded = false;
    static get isConfigurationLoaded() {
        return this.#isConfigurationLoaded;
    }

    static async setUp() {
        console.log(`${TimeService.timeStamp} Configuration.setUp(): started`);

        Configuration.setSlingBoxApiEndpointsFromQueryString();

        return Configuration.loadConfigurationFromFilesAsync().then(() => {
            this.checkInBackgroundIfSlingboxIsStreaming();
            Configuration.storeSlingBoxesNames();
            console.info(`${TimeService.timeStamp} Configuration.debug: ${this.debug} `);

            if (Configuration.debug) console.log(`${TimeService.timeStamp} Configuration.setUp(): Completed`);
        });


    }


    static checkInBackgroundIfSlingboxIsStreaming() {
        if (Configuration.webPageRefreshRates.checkCanDisableChannelButtonsTimeOutMs > 0) {
            setInterval(
                SlingServices.checkCanDisableChannelButtonsHack,
                Configuration.webPageRefreshRates.checkCanDisableChannelButtonsTimeOutMs);
        }
    }

    static async loadConfigurationFromFilesAsync() {
        try {
            const envConfig = await this.#loadEnvironment();
            const environment = ('environment' in envConfig)
                ? envConfig.environment
                : "";

            this.environment = environment; // will trigger a page reload if the environment has changed

            console.info(`${TimeService.timeStamp} Environment: ${this.environment}`);

            let appConfiguration = await this.#loadConfig();
            this.updateConfiguration(appConfiguration);

            appConfiguration = await this.#loadConfig(environment);
            this.updateConfiguration(appConfiguration);

            this.#isConfigurationLoaded = true;

        } catch (error) {
            console.error(error);
        }
    }

    static #loadEnvironment() {
        const url = HtmlUtils.appendTimeStampToUrl('config/environment.json');
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load environment configuration');
                }
                return response.json();
            });
    }

    static #loadConfig(environment) {
        const url = environment
            ? `config/appsettings.${environment}.json`
            : 'config/appsettings.json';
        const urlWithTimeStamp = HtmlUtils.appendTimeStampToUrl(url);

        return fetch(urlWithTimeStamp)
            .then((response) => {
                if (!response.ok) {
                    HtmlServices.displayMessage("Cannot load configuration", HtmlServices.messageTypeError);

                    const errMsg = `Failed to load config for ${environment}, file: ${url}`;
                    console.error(errMsg);

                    throw new Error(errMsg);
                }
                return response.json();
            });
    }

    static updateConfiguration(appConfig) {

        if ('apiUrls' in appConfig && 'dateServiceApiUrl' in appConfig.apiUrls) {
            Configuration.dataApiUrls.channelUiCollectionUrl = appConfig.apiUrls.channelUiCollectionUrl;
            Configuration.dataApiUrls.programCollectionUrl = appConfig.apiUrls.programCollectionUrl;
            Configuration.dataApiUrls.dateServiceApiUrl = appConfig.apiUrls.dateServiceApiUrl;
        } else {
            //use default values;
        }

        if ('cacheSettings' in appConfig) {
            if ('slingCacheSettings' in appConfig.cacheSettings) {
                Configuration.slingCacheSettings.slingStatusExpirationTimeMs = appConfig.cacheSettings.slingCacheSettings.slingStatusExpirationTimeMs;
                Configuration.slingCacheSettings.slingChannelChangeExpirationTimeMs = appConfig.cacheSettings.slingCacheSettings.slingChannelChangeExpirationTimeMs;
            }
        }

        if ('refreshRates' in appConfig) {
            if ('webPageRefreshRates' in appConfig.refreshRates) {
                Configuration.webPageRefreshRates.loadPageTimeOutMs = appConfig.refreshRates.webPageRefreshRates.loadPageTimeOutMs;
                Configuration.webPageRefreshRates.checkCanDisableChannelButtonsTimeOutMs = appConfig.refreshRates.webPageRefreshRates.checkCanDisableChannelButtonsTimeOutMs;
                Configuration.webPageRefreshRates.checkSignalRConnectionTimeoutMs = appConfig.refreshRates.webPageRefreshRates.checkSignalRConnectionTimeoutMs;
            }
        }

        if ('hoursOfProgramsFetchedFromDb' in appConfig) {
            Configuration.hoursOfProgramsFetchedFromDb = appConfig.hoursOfProgramsFetchedFromDb;
        }

        if ('debug' in appConfig) {
            Configuration.debug = appConfig.debug;
        }

        if ('pageTitleTemplate' in appConfig) {
            Configuration.pageTitleTemplateUrl = appConfig.pageTitleTemplate;
        }
    }

    static webPageRefreshRates = class WebPageRefreshRates {
        static loadPageTimeOutMs = 30000;
        static checkCanDisableChannelButtonsTimeOutMs = 30000;
        static checkSignalRConnectionTimeoutMs = 30000;
    }

    static css = class Css {
        static cssMainDiv = "container-fluid grid-striped";
        static cssChannelRow = "row align-items-center text-center";
        //static  cssLogo = "col-md-1 col-sm-1 col-2 img-fluid img-thumbnail";
        //static  cssChannelName = "col-md-3 col-sm-3 col-4 text-left";
        //const cssChannelNumber = "col-md-1 col-sm-1 col-2";
        //static  cssChannelType = "col-md-1 col-sm-1 col-2";
        static cssProgramTable = "table-responsive p-0";

        static dataAttributeSlingBoxName = "data-slingbox-name";
        static dataAttributeChannelType = "data-channel-type";
        static spanChannelNumber = "span-channel-number";

        // SlingBox = Clickable TV Guide
        static divChannelNumberAsButton = "div-channel-number-as-button";
        static divChannelNumberSelected = "div-channel-number-selected";
        static divChannelNumberError = "div-channel-number-error";
        static spanChannelNumberSelected = "span-channel-number-selected";
        static spanChannelNumberPoorQuality = "span-channel-number-poor-quality";

        static divChannelNumberHighlighted = "div-channel-number-highlighted"
    }

    static tvChannelsLogoLocation = 'Channel Logo/';
    static rowTemplateNameUrl = 'HtmlTemplates/TvGuideRowTemplate.html';


    static #maxProgramsToDisplayInARow = 3;
    static get maxProgramsToDisplayInARow() {
        return this.#maxProgramsToDisplayInARow;
    }

    static #environment = "";
    static get environment() {
        return this.#environment;
    }

    static set environment(value) {
        this.#environment = value;
        const previousEnvironment = LocalStorageServices.getDataFromLocalStorage("environment");

        if (this.#environment !== previousEnvironment) {
            LocalStorageServices.resetLocalStorage();
            LocalStorageServices.saveDataToLocalStorage("environment", this.#environment);
            window.location.reload();
            HtmlServices.displayMessage(`Environment changed to: ${this.#environment}`, HtmlServices.messageTypeWarning);
        }
    }

    static #debug = true;
    static get debug() {
        return this.#debug;
    }

    static set debug(value) {
        this.#debug = value;
    }


    static #pageTitleTemplate = "";

    static get pageTitleTemplateUrl() {
        return this.#pageTitleTemplate;
    }

    static set pageTitleTemplateUrl(value) {
        this.#pageTitleTemplate = value;
    }


    // TV Guide Data API URLs 
    static dataApiUrls = class DataApiUrls {
        static #channelUiCollectionUrl = "";
        static #programCollectionUrl = "";
        static #dateServiceApiUrl = "";

        static get channelUiCollectionUrl() {
            return this.#channelUiCollectionUrl;
        }

        static set channelUiCollectionUrl(url) {
            this.#channelUiCollectionUrl = url;
        }

        static get programCollectionUrl() {
            return this.#programCollectionUrl;
        }

        static set programCollectionUrl(url) {
            this.#programCollectionUrl = url
        }


        static get dateServiceApiUrl() {
            return this.#dateServiceApiUrl;
        }

        static set dateServiceApiUrl(url) {
            this.#dateServiceApiUrl = url;
        }
    }

    static #hoursOfProgramsFetchedFromDb = 26
    static get hoursOfProgramsFetchedFromDb() {
        return this.#hoursOfProgramsFetchedFromDb;
    }

    static set hoursOfProgramsFetchedFromDb(hours) {
        if (typeof hours !== 'number') {
            throw new Error('hours must be a number');
        }
        this.#hoursOfProgramsFetchedFromDb = hours;
    }


    /* ***[region]**********************************************************************************
     *  Time difference between Device and TV Station
     * ********************************************************************************************/

    // LocalTime - DeviceTime
    static #timeDifferenceHours = 1000000;

    static get timeDifferenceBetweenDeviceAndTvStationHours() {

        // 1. Try getting the value from memory
        if (Math.abs(Configuration.#timeDifferenceHours) <= 24) {
            return this.#timeDifferenceHours;
        }
        const localStorageKey = 'timeDiffHours';
        const localStorageExpirationMs = 3 * 24 * 60 * 60 * 1000; // 3 days

        // 2. Try getting the value from local storage
        const timeDifferenceHours = LocalStorageServices.getDataFromLocalStorage(localStorageKey);
        if (timeDifferenceHours !== null && !isNaN(parseInt(timeDifferenceHours))) {
            this.#timeDifferenceHours = parseInt(timeDifferenceHours);

            // Start a backround process to update the time difference from Api, as the cached data may be stale when the user travels to another time zone
            this.updateTimeDiffInBackground(localStorageKey, localStorageExpirationMs).then(() => "done");

            return this.#timeDifferenceHours;
        }

        // 3. Try getting the value from the API
        const deviceTimeNow = new Date();
        const tvStationTimeNow = this.getTvStationLocalTimeFromApi();

        this.#timeDifferenceHours = TimeService.getTimeDifferenceInHours(deviceTimeNow, tvStationTimeNow);
        LocalStorageServices.saveDataToLocalStorage(localStorageKey, this.#timeDifferenceHours, localStorageExpirationMs);

        return this.#timeDifferenceHours;
    }


    static getTvStationLocalTimeFromApi() {
        const deviceTimeNow = new Date();
        let tvStationTimeJson = "";

        if (this.dataApiUrls.dateServiceApiUrl.endsWith(".json")) { // using mock data
            return deviceTimeNow;
        }

        tvStationTimeJson = DataAccess.getJsonString(this.dataApiUrls.dateServiceApiUrl);

        if (typeof tvStationTimeJson === 'string') {
            tvStationTimeJson = JSON.parse(tvStationTimeJson);
        }

        if (Utils.isNullOrUndefined(tvStationTimeJson)) {
            const errMsg = `${TimeService.timeStamp} Could not get TV station's DATE from: ${this.dataApiUrls.dateServiceApiUrl}`;
            console.error(`${TimeService.timeStamp} {errMsg}`);


            HtmlServices.displayMessage("Data Connection error", HtmlServices.messageTypeError);
            throw errMsg; // return null;
        }

        let tvStationTime = Configuration.#getTvStationTimeFromString(tvStationTimeJson)

        return tvStationTime;
    }

    static #getTvStationTimeFromString(timeJson) {
        let timeObj = null;

        if (typeof timeJson === 'string') {
            timeJson = timeJson.replace('Z', '').replace(/["\\]/g, '');
            timeObj = new Date(timeJson);
        } else if (timeJson.hasOwnProperty(`tvStationTime`)) {
            const dateAsString = timeJson["tvStationTime"].toString().replace(/["\\]/g, '');
            timeObj = new Date(dateAsString);
        }

        return timeObj;
    }

    static async updateTimeDiffInBackground(localStorageKey, localStorageExpirationMs) {
        if (Configuration.debug) console.log(`${TimeService.timeStamp} updateTimeDiffInBackgroundAsync(): started`);

        const timeDiffIntervalId = setInterval(updateTimeDiffWithFreshDataFromApi, 3000);

        async function updateTimeDiffWithFreshDataFromApi() {
            const functionName = "updateTimeDiffWithFreshDataFromApi()";

            try {
                let tvStationTimeJson = Configuration.dataApiUrls.dateServiceApiUrl.endsWith(".json")
                    ? TimeService.getDateTimeFormatted(new Date(), "yyyy-MM-ddTHH:mm:ss")
                    : await fetchTvStationDateFromApi();

                let tvStationTime = Configuration.#getTvStationTimeFromString(tvStationTimeJson);

                const deviceTimeNow = new Date();
                const timeDifferenceHours = TimeService.getTimeDifferenceInHours(deviceTimeNow, tvStationTime);

                if (Math.abs(timeDifferenceHours - Configuration.#timeDifferenceHours) > 1) {
                    Configuration.#timeDifferenceHours = timeDifferenceHours;
                    LocalStorageServices.saveDataToLocalStorage(localStorageKey, timeDifferenceHours, localStorageExpirationMs);
                }

                clearInterval(timeDiffIntervalId);
                if (Configuration.debug) console.log(`${TimeService.timeStamp} ${functionName}: completed`);
            } catch (error) {
                console.error(`${TimeService.timeStamp} ${functionName}: error: ${error}`);
                clearInterval(timeDiffIntervalId);
            }
        }

        async function fetchTvStationDateFromApi() {
            try {
                let url = Configuration.dataApiUrls.dateServiceApiUrl;
                url = HtmlUtils.appendTimeStampToUrl(url);

                const response = await fetch(url);
                const data = await response.json();

                return data;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }


    /* ***[region]**********************************************************************************
     *  SlingBox Server settings
     * ********************************************************************************************/

    // Slingbox_Server & RemoteControlService URLs = passed via the querystring
    static setSlingBoxApiEndpointsFromQueryString() {
        if (Utils.isNullOrUndefined(Configuration.slingApiUrls.slingServerUrl)) {
            Configuration.slingApiUrls.slingServerUrl = decodeURIComponent(HtmlUtils.getQueryParameterByKey("slingServerUrl"));
            Configuration.slingApiUrls.slingRemoteControlUrl = decodeURIComponent(HtmlUtils.getQueryParameterByKey("slingRemoteControlUrl"));
            Configuration.slingApiUrls.slingServerSignalRHubUrl = HtmlUtils.getBaseUrl(Configuration.slingApiUrls.slingRemoteControlUrl) + "/auctionhub";
            Configuration.slingApiUrls.slingServerStreamingStatusUrl = HtmlUtils.getBaseUrl(Configuration.slingApiUrls.slingRemoteControlUrl) + "/api/streamingstatus";
        }
    }

    static slingApiUrls = class SlingApiEndPoints {
        static slingServerUrl = "";
        static slingRemoteControlUrl = "";
        static slingServerSignalRHubUrl = "";
        static slingServerStreamingStatusUrl = "";
    }

    static get isPageLaunchedFromSlingBoxServer() {
        return !Utils.isNullOrUndefined(this.slingApiUrls.slingServerUrl);
    }

    static slingCacheSettings = class SlingCacheSettings {
        static slingStatusExpirationTimeMs = 30000;
        static slingChannelChangeExpirationTimeMs = 5000;
    }


    // SlingBoxes that are using this web page. 
    // ToDo: allow aliases for guests who are using different SlingBoxes names
    static #slingBoxesNames = [];
    static get slingBoxesNames() {
        return this.#slingBoxesNames;
    }

    static #addSlingBoxName(value) {
        if (this.#slingBoxesNames.includes(value.trim())) {
            return;
        }
        this.#slingBoxesNames.push(value.trim());
    }

    static storeSlingBoxesNames() {
        this.#slingBoxesNames = [];

        const channelsUiCollection = DataServices.getTvChannelUiCollectionAsJson();
        if (Utils.isNullOrUndefined(channelsUiCollection) || channelsUiCollection.channels.length === 0) {
            return;
        }

        const uiChannelData = channelsUiCollection.channels[0]
        uiChannelData.attributes.forEach(uiAttribute => {
            const slingBoxName = uiAttribute["slingName"];
            this.#addSlingBoxName(slingBoxName);
        });
    }
}


// /$$      /$$                 /$$           /$$          
// | $$$    /$$$                | $$          | $$          
// | $$$$  /$$$$  /$$$$$$   /$$$$$$$  /$$$$$$ | $$  /$$$$$$$
// | $$ $$/$$ $$ /$$__  $$ /$$__  $$ /$$__  $$| $$ /$$_____/
// | $$  $$$| $$| $$  \ $$| $$  | $$| $$$$$$$$| $$|  $$$$$$ 
// | $$\  $ | $$| $$  | $$| $$  | $$| $$_____/| $$ \____  $$
// | $$ \/  | $$|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$ /$$$$$$$/
// |__/     |__/ \______/  \_______/ \_______/|__/|_______/ 

// Logo generated with // http://patorjk.com/software/taag/#p=testall&f=Graffiti&t=Models%0A
// Font Name: Big Money-ne

/* *******************************************************************************************
 // TV Program Model.
 // A collection of instances of this model is contained into a TvChannelModel object
 // Contains:  startTime, name, durationMinutes, isFirstRow, endTime, isPlayingNow(), toString()
 // Example: time=01:45, name=Terminator-2
 * ********************************************************************************************/
class TvProgramModel {
    // The hashtag '#' prepends PRIVATE members (variables, functions, and methods)
    #_startDateTime = new Date();
    #_name = null;
    #_durationMinutes = 0;
    #_isFirstRow = false;

    constructor(strDateTime, name) {
        this.#_startDateTime = TimeService.createDateFromString(strDateTime);
        this.#_name = name;
    }

    set name(value) {
        this.#_name = value;
    }

    get name() {
        return this.#_name;
    }

    get startTime() {
        return this.#_startDateTime;
    }

    set startTime(value) {
        if (!(value instanceof Date)) throw "startTime() : Invalid input, not a Date() object";
        this.#_startDateTime = value;
    }

    get startTimeHm() {
        return TimeService.getTimeFormattedAsHHmm(this.#_startDateTime);
    }

    set durationMinutes(value) {
        this.#_durationMinutes = parseInt(value)
    };

    get durationMinutes() {
        return this.#_durationMinutes
    };

    get endTime() {
        return TimeService.incrementDateTime(this.#_startDateTime, 0, this.durationMinutes, 0)
    };

    // noinspection JSUnusedGlobalSymbols
    set isFirstRow(value) {
        this.#_isFirstRow = value
    };

    get isFirstRow() {
        return this.#_isFirstRow;
    }


    isPlayingNow(currentDateTime) {
        const startTimeMs = this.startTime.getTime();
        const endTimeMs = this.endTime.getTime();
        const currentDateTimeMs = currentDateTime.getTime();

        return TvProgramModel.#isPlayingThisTvProgram(startTimeMs, currentDateTimeMs, endTimeMs, this.isFirstRow);
    }

    static #isPlayingThisTvProgram(startTimeMs, currentDateTimeMs, endTimeMs, isFirstRow) {
        switch (currentDateTimeMs) {
            case endTimeMs:
                return true;
            case startTimeMs:
                return isFirstRow;
            default:
                return Utils.isBetween(startTimeMs, currentDateTimeMs, endTimeMs);
        }
    }

    toString() {
        return "time: " + TimeService.getDateTimeFormatted(this.#_startDateTime, "yyyy-MM-dd HH:mm:ss") + ", " + "name: " + this.#_name;
    }
}


/********************************************************************************************
 // TV Channel Model.
 //  // A collection of instances of this model is contained into a TvGuideModel object
 // Contains:  channel Id, TvPrograms[] = array of TvProgramRow objects
 // Example: id = 'tvr-1', TVPrograms[] = {'9:00 Sport', '9:45 Film', ....'22:50 Football'}
 *********************************************************************************************/
class TvChannelModel {
    #_id = "";
    #_tvPrograms = []; // Array of TvProgramRow objects

    constructor(id, programs) {
        this.#_id = id;
        if (Array.isArray(programs)) {
            this.#_tvPrograms = programs;
        } else {
            this.#_tvPrograms = [];
        }
    }

    get Id() {
        return this.#_id; // example: tvr-1
    }

    get programs() {
        return this.#_tvPrograms; // useful for debugging
    }

    // Out of the many programs stored in array, return the ones relevant for the given time range (startTimeRange, endTimeRange)
    getTvProgramsByTimeRange(startTimeRange, endTimeRange, currentTime) {

        if (Utils.isNullOrUndefined(startTimeRange)) throw `Null value for 'from' time`;
        if (Utils.isNullOrUndefined(endTimeRange)) throw `Null value for 'to' time`;
        if (Utils.isNullOrUndefined(currentTime)) throw `Null value for current time`;

        if (!(startTimeRange instanceof Date)) throw `'startTimeRange' is not a valid date: ${startTimeRange} `;
        if (!(endTimeRange instanceof Date)) throw `'endTimeRange' is not a valid date: ${endTimeRange}`;
        if (startTimeRange.getTime() > endTimeRange.getTime()) throw ("Invalid range: 'from' time " + startTimeRange + " is bigger that 'to' time " + endTimeRange);

        let maxProgramsToDisplay = TimeService.dateDifferenceInHours(endTimeRange, startTimeRange) < 5
            ? Configuration.maxProgramsToDisplayInARow // display some records in a Row
            : 999; // display all records in a Modal Popup

        let startTimeRangeMs = startTimeRange.getTime();
        let endTimeRangeMs = endTimeRange.getTime();

        const selectedTvPrograms = [];

        for (let i = 0; i < this.#_tvPrograms.length; i++) {
            const currentProgram = this.#_tvPrograms[i];

            const currentProgStartTimeMs = currentProgram.startTime.getTime();
            const currentProgramEndTimeMs = TimeService.incrementDateTime(currentProgram.startTime, 0, currentProgram.durationMinutes).getTime();

            // filter-out records outside my interval
            if (currentProgramEndTimeMs < startTimeRangeMs) {
                continue;
            }

            // append current program. 
            if (currentProgramEndTimeMs >= startTimeRangeMs ||
                Utils.isBetween(startTimeRangeMs, currentProgStartTimeMs, endTimeRangeMs)
            ) {
                selectedTvPrograms.push(currentProgram);
            }

            // exit loop. Exception: append a additional programs if too few are displayed
            if (!(canAddMorePrograms(currentProgStartTimeMs)) &&
                (currentProgStartTimeMs > endTimeRangeMs || selectedTvPrograms.length >= maxProgramsToDisplay)) {
                break;
            }
        }


        // logic for: if there are too few programs to display, add more even if they start after the end of the TimeRange
        function canAddMorePrograms(currentProgStartTimeMs) {
            return selectedTvPrograms.length > 0 &&
                selectedTvPrograms.length < maxProgramsToDisplay &&
                currentProgStartTimeMs > endTimeRangeMs;
        }

        // sort the collection, just in case
        // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        function compare(programA, programB) {
            if (programA.startTime.getTime() < programB.startTime.getTime()) {
                return -1;
            }
            if (programA.startTime.getTime() > programB.startTime.getTime()) {
                return 1;
            }
            return 0;
        }

        selectedTvPrograms.sort(compare);

        return selectedTvPrograms;
    }

    toString() {
        let programs = "";
        if (Array.isArray(this.#_tvPrograms)) {
            this.#_tvPrograms.forEach(program => {
                programs += program + "\n";
            });
        }

        return "id: " + this.#_id + ", programs: \n" + programs;
    }
}


/********************************************************************************************
 // TV Guide data model
 // DateYmd, TvChannels[] = array of TvChannel objects
 // Example:
 *********************************************************************************************/
class TvGuideModel {

    #_dateYmd;
    #_tvChannels;

    constructor(dateYmd, channels) {
        if (TimeService.isValidDateY_m_d(dateYmd)) {
            this.#_dateYmd = dateYmd;
        } else {
            throw ("The date: " + dateYmd + " is not formatted as: yyyy-MM-dd");
        }

        if (Array.isArray(channels)) {
            this.#_tvChannels = channels;
        } else {
            this.#_tvChannels = [];
        }
    }

    getTvChannelById(tvChannelId) {
        return this.#_tvChannels.find(channel => channel.Id === tvChannelId);
    }

    getAllTvChannelIds() {
        return this.#_tvChannels.map(channel => channel.Id);
    }

    hasChannels() {
        return this.#_tvChannels.length > 0;
    }

    toString() {
        let channels = "";
        this.#_tvChannels.forEach(tvChannel => {
            channels += tvChannel + "\n\n";
        });

        return this.#_dateYmd + ", \n" + channels;
    }
}


// /$$$$$$$$ /$$                                /$$$$$$                                 /$$                              
// |__  $$__/|__/                               /$$__  $$                               |__/                              
//    | $$    /$$ /$$$$$$/$$$$   /$$$$$$       | $$  \__/  /$$$$$$   /$$$$$$  /$$    /$$ /$$  /$$$$$$$  /$$$$$$   /$$$$$$$
//    | $$   | $$| $$_  $$_  $$ /$$__  $$      |  $$$$$$  /$$__  $$ /$$__  $$|  $$  /$$/| $$ /$$_____/ /$$__  $$ /$$_____/
//    | $$   | $$| $$ \ $$ \ $$| $$$$$$$$       \____  $$| $$$$$$$$| $$  \__/ \  $$/$$/ | $$| $$      | $$$$$$$$|  $$$$$$ 
//    | $$   | $$| $$ | $$ | $$| $$_____/       /$$  \ $$| $$_____/| $$        \  $$$/  | $$| $$      | $$_____/ \____  $$
//    | $$   | $$| $$ | $$ | $$|  $$$$$$$      |  $$$$$$/|  $$$$$$$| $$         \  $/   | $$|  $$$$$$$|  $$$$$$$ /$$$$$$$/
//    |__/   |__/|__/ |__/ |__/ \_______/       \______/  \_______/|__/          \_/    |__/ \_______/ \_______/|_______/ 


class TimeService {
    // mostly for debugging:
    //static #deviceDateTime = new Date(); //new Date(2020, 10, 2, 22, 5, 0, 0); //new Date(2020, 8, 29, 14, 5, 0, 0); // Month is ZERO based: January = 0
    static #millisecondsPerMinute = 60000; // 60*1000;

    // date time returned by the device: 2020-09-01 1:30:00
    static getDeviceDateTime() {
        return new Date(); //this.#deviceDateTime;
    }

    // static getTvStationLocalDateTime() {
    //     return this.addHoursMinutesSecondsToTime(this.#deviceDateTime, Configuration.timeDifferenceBetweenDeviceAndTvStationHours);
    // }

    // for debug purposes
    // static addMinutesToDeviceDateTime(minutes) {
    //     const millisecondsSince1970_01_01 = this.#deviceDateTime.getTime();
    //     this.#deviceDateTime = new Date(millisecondsSince1970_01_01 + parseInt(minutes) * this.#millisecondsPerMinute);
    // }

    static getTimeDifferenceInMinutes(startDate, endDate) {
        this.validateInputIsDate(startDate, endDate);
        return this.#getTimeDifferenceInMinutes(startDate, endDate)
    }

    static getTimeDifferenceInHours(startDate, endDate) {
        this.validateInputIsDate(startDate, endDate);
        return this.#getTimeDifferenceInHours(startDate, endDate)
    }

    static validateInputIsDate(startDate, endDate) {
        if (Utils.isNullOrUndefined(startDate)) throw "InvalidNullParameters: startDate";
        if (Utils.isNullOrUndefined(endDate)) throw "InvalidNullParameters: endDate";
        if (!(startDate instanceof Date && endDate instanceof Date)) throw "'startDate' or 'endDate' are not of type Date()"
    }

    static #getTimeDifferenceInMinutes(startDate, endDate) {
        const startDateMillisecondsSince1970_01_01 = startDate.getTime();
        const endDateMillisecondsSince1970_01_01 = endDate.getTime();

        return (endDateMillisecondsSince1970_01_01 - startDateMillisecondsSince1970_01_01) / this.#millisecondsPerMinute;
    }

    static #getTimeDifferenceInHours(startDate, endDate) {
        const timeDifferenceInMinutes = this.#getTimeDifferenceInMinutes(startDate, endDate)
        const timeDifferenceInHours = Math.round(timeDifferenceInMinutes / 60);

        return timeDifferenceInHours;
    }


    // return "HH:mm" formatted time from a Date object 
    static getTimeFormattedAsHHmm(date) {
        const dateObj = new Date(date); //sometimes 'date' param is a string rather than a date object
        const hours = Utils.addLeadingZeroes(dateObj.getHours());
        const minutes = Utils.addLeadingZeroes(dateObj.getMinutes());

        return hours + ":" + minutes;
    }

    // return a date  formatted as "yyyy-MM-dd"
    static getDateFormattedAsYmd(date) {
        const [yyyy, MM, dd] = this.#getDateTimeAsStringArrayWithMonthIndexOneBased(date);
        return `${yyyy}-${MM}-${dd}`
    }


    // returns a Date formatted according to the given pattern: dd.MMM.yyyy HH:mm:ss, yyyy-MM-dd HH:mm:ss, etc.
    // alternately, could have used 'momentjs ': https://stackoverflow.com/questions/31439067/issue-with-passing-datetime-fromdate-todate-in-url 
    static getDeviceDateTimeFormatted(dateTimeFormat) {
        if (Utils.isNullOrUndefined(dateTimeFormat)) throw "Date time format not provided";

        return this.getDateTimeFormatted(this.getDeviceDateTime(), dateTimeFormat);
    }

    static getDateTimeFormatted(date, dateTimeFormat) {
        const [yyyy, MM, dd, HH, mm, ss, ms] = this.#getDateTimeAsStringArrayWithMonthIndexOneBased(date);

        let monthName = (dateTimeFormat.includes('MMM')) //'yyy'
            ? this.#getMonthNameByNumber(date.getMonth())
            : "";
        let dayOfWeekName = (dateTimeFormat.includes('ddd'))
            ? this.#getDayOfWeekNameByNumber(date.getDay())
            : "";

        return dateTimeFormat
            .replace("yyyy", yyyy)
            .replace("yy", yyyy.toString().substring(2, 2))

            .replace("MMM*", monthName)
            .replace("MMM", monthName.substring(0, 3))
            .replace("MM", MM)

            .replace("ddd*", dayOfWeekName)
            .replace("ddd", dayOfWeekName.substring(0, 3))
            .replace("dd", dd)

            .replace("HH", HH)
            .replace("mm", mm)
            .replace("ss", ss)
            .replace("fff", ms)
            .replace("ff", ms.toString().substring(0, 2))
            .replace("f", ms.toString().substring(0, 1));

        //Note: substring(startIndex, endIndex), unlike deprecated substr(start, length) 
    }

    static #getMonthNameByNumber(monthNumber) {
        if (!Utils.isBetween(0, monthNumber, 11)) throw `Month number should be 0...11 bus was ${monthNumber}`;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return monthNames[monthNumber];
    }

    static #getDayOfWeekNameByNumber(dayOfWeekNumber) {
        if (!Utils.isBetween(1, dayOfWeekNumber, 7)) throw `Day od week number should be 1...7 bus was ${dayOfWeekNumber}`;
        const dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return dayOfWeekNames[dayOfWeekNumber - 1];
    }

    // static getTimeHmInMinutes(timeHm) {
    //     const [hh, mm] = this.#getHoursAndMinutesFromTimeHm(timeHm);
    //     return hh * 60 + mm;
    // }

    // // returns an array[]: 'hh' and 'mm' as integers
    // static #getHoursAndMinutesFromTimeHm(timeHm) {
    //     if (Utils.isNullOrUndefined(timeHm)) throw "Variable timeHm is null or undefined";
    //
    //     const arrayHm = timeHm.toString().split(":");
    //     if (arrayHm.length !== 2) throw ("Time value " + timeHm + "is not in expected format HH:mm");
    //
    //     const hh = parseInt(arrayHm[0], 10);
    //     const mm = parseInt(arrayHm[1], 10);
    //
    //     if (hh > 23) throw ("Invalid hour: " + timeHm);
    //     if (mm > 59) throw ("Invalid minutes: " + timeHm);
    //
    //     return [hh, mm];
    // }

    // call this only from an instane of this class
    static get timeStamp() {
        return this.getDateTimeFormatted(Date.now(), "[HH:mm:ss.fff]").toString();
    }

    static incrementDateTime(dateTime, hours, minutes, seconds) {
        const dateObj = new Date(dateTime); //sometimes 'date' param is a string rather than a date object
        if (Utils.isNullOrUndefined(minutes)) minutes = 0;
        if (Utils.isNullOrUndefined(seconds)) seconds = 0;

        const dateTimeMillisecondsSince1970_01_01 = dateObj.getTime();
        const timeToAddMilliseconds = hours * 60 * this.#millisecondsPerMinute + minutes * this.#millisecondsPerMinute + seconds * 1000;

        // noinspection UnnecessaryLocalVariableJS
        const newDateTime = new Date(dateTimeMillisecondsSince1970_01_01 + timeToAddMilliseconds);

        return newDateTime;
    }


    // Validate that date is in format yyyy-MM-dd and it is correct date
    // dateYmd example: '2020-09-30'
    static isValidDateY_m_d(dateYmd) {
        const ymd = dateYmd.split("-");
        if (ymd.length !== 3) {
            console.error("ymd.length !== 3: " + ymd + ", input value: " + dateYmd);
            return false;
        }

        const baseDecimal = 10;
        const year = ymd[0];
        const month = ymd[1];
        const day = ymd[2];

        // if (ymd[0].length !== 4) return false;
        //
        // if (ymd[1].length !== 2) return false;
        // if (ymd[1] < 1 || ymd[1] > 12) return false;
        //
        // if (ymd[2].length !== 2) return false;
        // // noinspection RedundantIfStatementJS
        // if (ymd[2] < 1 || ymd[2] > 31) return false;

        if (year.toString().length !== 4) {
            console.error("year.toString().length !== 4: " + year + ", input value: " + dateYmd);
            return false;
        }

        if (month.toString().length !== 2) {
            console.error("month.toString().length !== 2: " + month + ", input value: " + dateYmd);
            return false;
        }

        if (parseInt(month, baseDecimal) < 1 || parseInt(month, baseDecimal) > 12) {
            console.error("month < 1 || month > 12: " + month + ", input value: " + dateYmd);
            return false;
        }

        if (day.toString().length !== 2) {
            console.error("day.toString().length !== 2: " + day + ", input value: " + dateYmd);
            return false;
        }

        // noinspection RedundantIfStatementJS
        if (parseInt(day, baseDecimal) < 1 || parseInt(day, baseDecimal) > 31) {
            console.error("day < 1 || day > 31: " + day + ", input value: " + dateYmd);
            return false;
        }

        return true;
    }

    static isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }

    static getDateTimeAtFirstHourOfTheDay(date) {
        const [year, month, day] = this.#getDateTimeAsIntArray(date);

        return new Date(year, month, day, 0, 0, 0);
    }

    // static getDateTimeAtLastHourOfTheDay(date) {
    //     const [year, month, day] = this.#getDateTimeAsIntArray(date);
    //
    //     return new Date(year, month, day, 23, 59, 0);
    // }

    static #getDateTimeAsIntArray(date) {
        date = new Date(date); //sometimes 'date' param is a string rather than a date object

        const year = date.getFullYear();
        const month = date.getMonth(); // Month is ZERO based: January = 0
        const day = date.getDate();

        const hh = date.getHours();
        const mm = date.getMinutes();
        let ss = date.getSeconds();
        let ms = date.getMilliseconds();
        if (ss.toString().includes(".")) {
            ss = ss.toString().split(".")[0]; // ignore milliseconds from seconds and TimeZone info
            ss = parseInt(ss);
        }

        return [year, month, day, hh, mm, ss, ms];
    }

    // return string[] values for being displayed, w/ leading zeroes and month index starting at 1
    static #getDateTimeAsStringArrayWithMonthIndexOneBased(date) {
        const [year, month, day, hh, mm, ss, ms] = this.#getDateTimeAsIntArray(date);

        return [
            year.toString(),
            Utils.addLeadingZeroes(month + 1),
            Utils.addLeadingZeroes(day),
            Utils.addLeadingZeroes(hh),
            Utils.addLeadingZeroes(mm),
            Utils.addLeadingZeroes(ss),
            Utils.addLeadingZeroes(ms, 3)
        ];
    }


    // https://weblog.west-wind.com/posts/2014/jan/06/javascript-json-date-parsing-and-real-dates
    // Create a Date object that is not affected by device's local time, otherwise, when using JavaScript "new Date(dateTime)""
    //  "2020-09-30T00:25:00.000Z" becomes "Tue Sep 29 2020 17:25:00 GMT-0700 (Pacific Daylight Time)" in Pacific (Time UTC-7)
    // input: string date with format: yyyy-MM-ddTHH:mm:ss.millis+Z 
    static createDateFromString(dateTimeString) {

        if (!dateTimeString) {
            console.error(`${TimeService.timeStamp} createDateFromString(): null input value`);
            return null;
        }

        // replace both double quotes (") and backslashes (\) 
        dateTimeString = dateTimeString.replace(/["\\]/g, '');

        const date_time_separators = [' ', 'T']; //date may be separated from time by space or by "T"
        const date_time_array = dateTimeString.split(new RegExp(date_time_separators.join('|'), 'g'));

        if (Utils.isNullOrUndefined(date_time_array)) throw `Could not split the date-time string ${dateTimeString}`;
        if (date_time_array.length < 2) throw "Invalid separator btw date and time, expected yyyy-MM-ddTHH:mm:ss.milisZ";

        const date_array = date_time_array[0].split("-");
        const time_array = date_time_array[1].split(":");
        const mm = parseInt(date_array[1]) - 1;

        return new Date(date_array[0], mm, date_array[2], time_array[0], time_array[1], 0, 0);
    }


    // The subtraction returns the difference between the two dates in milliseconds. 
    // '36e5' is the scientific notation for '60*60*1000', 
    // dividing by which converts the milliseconds difference into hours.
    static dateDifferenceInHours(date1, date2) {
        return Math.abs(date1 - date2) / 36e5;
    }

    static async waitAsync(ms) {
        return new Promise(resolve => setTimeout(resolve, ms)).then(() => "");
    }

    // This function does NOT block the UI thread.
    // static wait(timeOutMs) {
    //     setTimeout(function () {
    //     }, timeOutMs);
    // }

}


// /$$$$$$$              /$$                      /$$$$$$                                 /$$
// | $$__  $$            | $$                     /$$__  $$                               |__/
// | $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$       | $$  \__/  /$$$$$$   /$$$$$$  /$$    /$$ /$$  /$$$$$$$  /$$$$$$   /$$$$$$$
// | $$  | $$ |____  $$|_  $$_/   |____  $$      |  $$$$$$  /$$__  $$ /$$__  $$|  $$  /$$/| $$ /$$_____/ /$$__  $$ /$$_____/
// | $$  | $$  /$$$$$$$  | $$      /$$$$$$$       \____  $$| $$$$$$$$| $$  \__/ \  $$/$$/ | $$| $$      | $$$$$$$$|  $$$$$$
// | $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$       /$$  \ $$| $$_____/| $$        \  $$$/  | $$| $$      | $$_____/ \____  $$
// | $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$      |  $$$$$$/|  $$$$$$$| $$         \  $/   | $$|  $$$$$$$|  $$$$$$$ /$$$$$$$/
// |_______/  \_______/   \___/   \_______/       \______/  \_______/|__/          \_/    |__/ \_______/ \_______/|_______/
//http://patorjk.com/software/taag/#p=display&f=Big%20Money-ne&t=Data%20Access


/* *******************************************************************************************
// This is a Repository :)
** *******************************************************************************************/

class DataServices {

    //https://dev.to/romainlanz/create-a-simple-cache-system-47om
    static #cache = new Map();
    static #cacheKeyRootValue_TVGuide = 'tvGuide_';

    //'#' => 'private'
    programs; // field for 'jsonChannel.programs' below

    // Converts Json[] => TvProgramRows[]{time,name} objects
    static #getTvProgramsFromJson(jsonChannel) {
        const tvProgramRows = jsonChannel.programs.map(jsonProgram => new TvProgramModel(jsonProgram.time, HtmlUtils.decodeHtml(jsonProgram.name)));

        // add duration to each program
        for (let i = 0; i < tvProgramRows.length; i++) {
            if (tvProgramRows.length > i + 1) {
                tvProgramRows[i].durationMinutes = TimeService.getTimeDifferenceInMinutes(
                    tvProgramRows[i].startTime,
                    tvProgramRows[i + 1].startTime);
            } else {
                tvProgramRows[i].durationMinutes = 60;
            }
        }

        return tvProgramRows;
    }


    // Converts Json[] => TvChennel[] objects = id, tvPrograms[]
    static #getTvChannelsFromJson(jsonChannels) {
        const tvChannels = [];

        if (Utils.isNullOrUndefined(jsonChannels)) {
            HtmlServices.displayMessage("Cannot read tv channels from server", HtmlServices.messageTypeWarning);
            return;
        }

        // cannot used directly the json object "channel.programs":
        // b/c it will not create the programs as TvPrograms objects
        jsonChannels.forEach(jasonChannel => {
            let tvPrograms = DataServices.#getTvProgramsFromJson(jasonChannel);
            let tvChannel = new TvChannelModel(jasonChannel.id, tvPrograms);
            if (Configuration.timeDifferenceBetweenDeviceAndTvStationHours !== 0) {
                this.#changeTvProgramsTimeToDeviceTime(tvPrograms);
            }

            tvChannels.push(tvChannel);
        });

        return tvChannels;
    }

    static #changeTvProgramsTimeToDeviceTime(tvPrograms) {
        tvPrograms.forEach(tvProgram => {
            tvProgram.startTime = TimeService.incrementDateTime(tvProgram.startTime, -1 * Configuration.timeDifferenceBetweenDeviceAndTvStationHours);
        });
    }


    // creates an instance of TvGuide(dateYmd, tvChannels[])
    static createTvGuide(date) {
        const functionName = `${DataServices.createTvGuide.name}(date)`;

        if (!date) {
            console.error(`${TimeService.timeStamp} ${functionName}: date is null or undefined`);
            throw `date is null or undefined`;
        }

        if (!TimeService.isValidDate(date)) {
            console.error(`${TimeService.timeStamp} ${functionName}: invalid date: ${date}`);
            throw `Invalid date: ${date}`
        }

        // Update tvGuide on every new day. Example of cacheKey : 'tvGuide_2020-10-01'
        const cacheKey = `${this.#cacheKeyRootValue_TVGuide}${TimeService.getDateFormattedAsYmd(date)}`;
        let tvGuideInstance = this.getCache(cacheKey);

        if (!Utils.isNullOrUndefined(tvGuideInstance) && tvGuideInstance.hasChannels()) {
            return tvGuideInstance;
        }

        const tvStationDateTime = TimeService.incrementDateTime(date, Configuration.timeDifferenceBetweenDeviceAndTvStationHours, 0, 0);
        const jsonTvChannelsWithPrograms = DataAccess.getTvChannelsWithProgramsAsJson(tvStationDateTime);

        if (!this.#isValidJson(jsonTvChannelsWithPrograms)) {
            console.error(`${TimeService.timeStamp} ${functionName}: invalid JSON data: ${jsonTvChannelsWithPrograms}`);
            return null;
        }

        const dateYmd = TimeService.getDateFormattedAsYmd(date);
        const tvChannels = DataServices.#getTvChannelsFromJson(jsonTvChannelsWithPrograms.channels);

        tvGuideInstance = new TvGuideModel(dateYmd, tvChannels);

        this.clearCache(this.#cacheKeyRootValue_TVGuide);
        this.#cache.set(cacheKey, tvGuideInstance);

        return tvGuideInstance;
    }

    static setCache(cacheKey, cacheValue) {
        this.#cache.set(cacheKey, cacheValue);
    }

    static getCache(cacheKey) {
        return this.#cache.has(cacheKey)
            ? this.#cache.get(cacheKey)
            : null;
    }

    static clearCache(rootKey) {
        for (let cacheKey of this.#cache.keys()) {
            if (cacheKey.startsWith(rootKey)) {
                this.#cache.delete(cacheKey);
            }
        }
    }

    static getTvChannelUiCollectionAsJson() {
        const cacheKey = 'tvChannelsUi';

        let tvChannelsUi = this.getCache(cacheKey);
        if (!Utils.isNullOrUndefined(tvChannelsUi))
            return tvChannelsUi

        tvChannelsUi = DataAccess.getTvChannelsUCollectionAsJson();
        this.setCache(cacheKey, tvChannelsUi);

        return tvChannelsUi;
    }

    static #isValidJson(jsonTvGuide) {

        if (Utils.isNullOrUndefined(jsonTvGuide)) {
            let errMsg = "The json string is null. Could not read TV Guide json data. Check your configuration files."
            HtmlServices.displayMessage(errMsg, HtmlServices.messageTypeError);

            errMsg = `${TimeService.timeStamp} #isValidJson(): ${errMsg}`;
            console.error(errMsg);

            return false;
        }

        return Utils.isJsonObject(jsonTvGuide);
    }
}


// /$$$$$$$              /$$                      /$$$$$$
// | $$__  $$            | $$                     /$$__  $$
// | $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$       | $$  \ $$  /$$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$ /$$$$$$$
// | $$  | $$ |____  $$|_  $$_/   |____  $$      | $$$$$$$$ /$$_____/ /$$_____/ /$$__  $$ /$$_____//$$_____/
// | $$  | $$  /$$$$$$$  | $$      /$$$$$$$      | $$__  $$| $$      | $$      | $$$$$$$$|  $$$$$$|  $$$$$$
// | $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$      | $$  | $$| $$      | $$      | $$_____/ \____  $$\____  $$
// | $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$      | $$  | $$|  $$$$$$$|  $$$$$$$|  $$$$$$$ /$$$$$$$//$$$$$$$/
// |_______/  \_______/   \___/   \_______/      |__/  |__/ \_______/ \_______/ \_______/|_______/|_______/


/* *******************************************************************************************
// Get data from datasource [WebAPI, etc.] 
// Should be a private class
** *******************************************************************************************/
class DataAccess {
    static get #channelUiDataUrl() {
        return Configuration.dataApiUrls.channelUiCollectionUrl;
    }

    static get #programsDataUrl() {
        return Configuration.dataApiUrls.programCollectionUrl;
    }

    // Get program data
    static getTvChannelsWithProgramsAsJson(date) {
        const dateCompactFormat = TimeService.getDateTimeFormatted(date, "yyyyMMddHHmmss");
        const hoursOfPrograms = Configuration.hoursOfProgramsFetchedFromDb; // hours of programs extracted from database to be displayed on the UI's popup
        const isMockData = this.#programsDataUrl.endsWith('.json');

        let webApiUrl = isMockData
            ? this.#programsDataUrl
            : this.#programsDataUrl + dateCompactFormat + "/" + hoursOfPrograms;
        let jsonString = DataAccess.getJsonString(webApiUrl);

        if (isMockData) {
            jsonString = DataAccess.updateDateInSimulatedData(date, jsonString);
            HtmlServices.displayMessage(`This is simulated data`, HtmlServices.messageTypeWarning);
        }

        return this.#getJsonObject(jsonString);
    }

    static updateDateInSimulatedData(date, jsonString) {
        const today = TimeService.getDateTimeFormatted(date, "yyyy-MM-dd");
        const tomorrow = TimeService.getDateTimeFormatted(TimeService.incrementDateTime(date, 24, 0, 0), "yyyy-MM-dd");
        jsonString = JSON.stringify(jsonString);

        return jsonString.replace(/2020-09-30/g, today).replace(/2020-10-01/g, tomorrow);
    }

    static #getJsonObject(jsonString) {
        if (Utils.isJsonObject(jsonString)) {
            return jsonString;
        }

        try {
            return JSON.parse(jsonString);
        } catch (err) {
            console.log(`${TimeService.timeStamp} Error: getJsonString(): Could not parse JSON string: ${jsonString}, error: ${err.toString()}`);
            return null;
        }
    }

    // Get channels UI-data     
    static getTvChannelsUCollectionAsJson() {
        let jsonString = DataAccess.getJsonString(this.#channelUiDataUrl);

        return this.#getJsonObject(jsonString);
    }


    // Load JSON text from server hosted file and return JSON parsed object
    static getJsonString(filePath) {
        if (Utils.isNullOrUndefined(filePath)) {
            console.error(`${TimeService.timeStamp} Error: getJsonString(): filePath is null or undefined`);
            return null;
        }
        const jsonString = DataAccess.loadDataFromWebApiAjax(filePath, "application/json");

        return this.#getJsonObject(jsonString);
    }

    // Load text with Ajax synchronously: takes path to file and optional MIME type
    // https://stackoverflow.com/questions/4116992/how-to-include-json-data-in-javascript-synchronously-without-parsing
    // [Synchronous XMLHttpRequest on the main thread = deprecated]
    static loadDataFromWebApiAjax(url, mimeType) {
        const httpRequest = new XMLHttpRequest();
        //httpRequest.withCredentials = false; //indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, 
        // authorization headers or TLS client certificate

        const isAsync = false;
        url = HtmlUtils.appendTimeStampToUrl(url);
        httpRequest.open("GET", url, isAsync);

        if (mimeType != null) {
            if (httpRequest.overrideMimeType) {
                httpRequest.overrideMimeType(mimeType);
            }
        }

        try {
            httpRequest.send();
        } catch (error) {
            console.error(`${TimeService.timeStamp} Data Connection Error. AJAX error: 
            url= ${url}, 
            errMsg= ` + error);
            HtmlServices.displayMessage("Data Connection Error", HtmlServices.messageTypeError);

            return null;
        }

        if (httpRequest.status === 200) {
            return httpRequest.responseText;
        } else {
            // TODO Throw exception
            console.log(`${TimeService.timeStamp} Data Retrieving Error. AJAX error: 
            url= ${url}, 
            errMsg= ` + httpRequest.statusText);
            HtmlServices.displayMessage("Data Retrieving Error", HtmlServices.messageTypeError);

            return null;
        }
    }
}


class LocalStorageServices {
    static saveDataToLocalStorage(key, value, expirationTimeMs) {
        if (!key) {
            throw new Error(`${TimeService.timeStamp} saveDataToLocalStorage(): InvalidNullParameters: key`);
        }

        const dataAsString = typeof value === 'string' ? value : JSON.stringify(value);
        const expirationMs = expirationTimeMs
            ? new Date().getTime() + expirationTimeMs
            : null;

        localStorage.setItem(key, JSON.stringify({dataAsString, expiration: expirationMs}));
        if (Configuration.debug) console.log(`${TimeService.timeStamp} saveDataToLocalStorage(): Data saved to localStorage: Key ${key}`);
    }

    static getDataFromLocalStorage(key) {
        if (!key) {
            throw new Error(`${TimeService.timeStamp} getDataFromLocalStorage(): InvalidNullParameters: key`);
        }

        const storedData = JSON.parse(localStorage.getItem(key));
        const currentTimeMs = new Date().getTime();

        if (storedData) {
            const {dataAsString, expiration: expirationMs} = storedData;

            if (expirationMs === null || currentTimeMs < expirationMs) {
                // Data is not expired, use it
                return typeof dataAsString === 'string'
                    ? dataAsString
                    : JSON.parse(dataAsString);
            } else {
                // Data is expired - clean database
                localStorage.removeItem(key);
            }
        }

        // Data is expired or not found, handle accordingly
        if (Configuration.debug) console.log(`${TimeService.timeStamp} getDataFromLocalStorage(): Data is expired or not found`);
        return null;
    }


    static resetLocalStorage() {
        localStorage.clear();
    }
}


// /$$   /$$         /$$           /$$       /$$                      
// | $$  | $$        | $$          |__/      | $$                      
// | $$  | $$       /$$$$$$         /$$      | $$        /$$$$$$$      
// | $$  | $$      |_  $$_/        | $$      | $$       /$$_____/      
// | $$  | $$        | $$          | $$      | $$      |  $$$$$$       
// | $$  | $$        | $$ /$$      | $$      | $$       \____  $$      
// |  $$$$$$/        |  $$$$/      | $$      | $$       /$$$$$$$/      
//  \______/          \___/        |__/      |__/      |_______/       


class Utils {
    static isBetween(leftNumber, someNumber, rightNumber) {
        if (leftNumber < rightNumber) {
            return (someNumber >= leftNumber && someNumber <= rightNumber);
        } else {
            return (someNumber >= rightNumber && someNumber <= leftNumber);
        }
    }

    // JSON encoded resource is not an object. It is a string. 
    // Only after you decode it or in Javascript JSON.parse() it does the JSON resource become an object. 
    // Therefore if you test a resource coming from a server to see if it is JSON, it is best to check first for String, then if is a not a <empty string> and then after parsing if it is an object. – 
    // Hmerman6006, Jun 3, 2020 at 12:28
    // https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json
    static isJsonObject(obj) {
        if (this.isNullOrUndefined(obj))
            return false;

        const type = typeof obj;
        return ['boolean', 'number', 'string', 'symbol', 'function'].indexOf(type) === -1;
    }

    static isNullOrUndefined(someObject) {
        return someObject === null || someObject === undefined || someObject.toString().trim().length === 0;
    }

    static addLeadingZeroes(someNumber, minDigits = 2) {
        if (typeof someNumber !== 'number') {
            throw new Error('argument must be a number');
        }

        if (minDigits < 1) {
            throw new Error('minDigits must be at least 1');
        }

        const numberString = someNumber.toString();

        if (numberString.length >= minDigits) {
            return numberString;
        }

        const leadingZeros = '0'.repeat(minDigits - numberString.length);
        return leadingZeros + numberString;
    }

    static clearLocalStorageAndRefreshPage() {
        LocalStorageServices.resetLocalStorage();
        location.reload();
    }

}


// /$$   /$$ /$$$$$$$$ /$$      /$$ /$$              /$$$$$$                                 /$$
// | $$  | $$|__  $$__/| $$$    /$$$| $$             /$$__  $$                               |__/
// | $$  | $$   | $$   | $$$$  /$$$$| $$            | $$  \__/  /$$$$$$   /$$$$$$  /$$    /$$ /$$  /$$$$$$$  /$$$$$$   /$$$$$$$
// | $$$$$$$$   | $$   | $$ $$/$$ $$| $$            |  $$$$$$  /$$__  $$ /$$__  $$|  $$  /$$/| $$ /$$_____/ /$$__  $$ /$$_____/
// | $$__  $$   | $$   | $$  $$$| $$| $$             \____  $$| $$$$$$$$| $$  \__/ \  $$/$$/ | $$| $$      | $$$$$$$$|  $$$$$$
// | $$  | $$   | $$   | $$\  $ | $$| $$             /$$  \ $$| $$_____/| $$        \  $$$/  | $$| $$      | $$_____/ \____  $$
// | $$  | $$   | $$   | $$ \/  | $$| $$$$$$$$      |  $$$$$$/|  $$$$$$$| $$         \  $/   | $$|  $$$$$$$|  $$$$$$$ /$$$$$$$/
// |__/  |__/   |__/   |__/     |__/|________/       \______/  \_______/|__/          \_/    |__/ \_______/ \_______/|_______/
//
class HtmlServices {

    // some test rows may not have IDs and will be ignored
    createChannelRowsIfNeeded(channelsUiCollection) {
        if (this.#hasChannelRows()) {
            return;
        }

        this.#createChannelRowsAsync(channelsUiCollection, this);
    }


    #hasChannelRows() {
        let currentChannelRows = document.getElementsByClassName(Configuration.css.cssChannelRow);
        if (Utils.isNullOrUndefined(currentChannelRows) || currentChannelRows.length === 0) {
            return false;
        }

        currentChannelRows = this.#getChannelRowsWithIds(currentChannelRows);
        if (!(Utils.isNullOrUndefined(currentChannelRows) || currentChannelRows.length === 0)) {
            return true;
        }
    }

    #getChannelRowsWithIds(currentChannelRows) {
        const rows = [];
        for (let i = 0; i < currentChannelRows.length; i++) {
            if (!Utils.isNullOrUndefined(currentChannelRows[i].getAttribute("id"))) {
                rows.push(currentChannelRows[i]);
            }
        }
        return rows;
    }

    #createChannelRowsAsync(channelsUiData, outerThis) {

        // 1. Read the html template file async using new JS fetch()
        // https://gomakethings.com/getting-html-with-fetch-in-vanilla-js/
        const promiseGetTemplate = fetch(Configuration.rowTemplateNameUrl)
            .then(function (response) {
                // The API call was successful!
                // convert the response body into a text string so that
                // the subsequent .then in the promise chain will receive the response body as text.
                return response.text();
            })
            .then(function (htmlString) {
                // This is the HTML from our response as a text string
                outerThis.templateElement = htmlString;
                outerThis.templateElement = HtmlUtils.removeComments(outerThis.templateElement);

            })
            .catch(function (err) {
                // There was an error
                console.error(`${TimeService.timeStamp} HtmlServices.#createChannelRowsAsync: Could not read template file: ${Configuration.rowTemplateNameUrl}`, err);
            });


        // 2. Create BootStrap rows for every channel after the template reading is complete:
        // https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/
        // One interesting thing about Promise.all is that the order of the promises is maintained.
        Promise.all([promiseGetTemplate]).then(() => {
            const htmlChannelRows = this.#createChannelRowsFromTemplate(outerThis.templateElement, channelsUiData);

            if (Utils.isNullOrUndefined(htmlChannelRows)) {
                console.error(`${TimeService.timeStamp} HtmlServices.#createChannelRowsAsyn(): htmlChannelRows = null or undefined`)
                return;
            }

            for (let i = 0; i < htmlChannelRows.length; i++) {
                const htmlChannelRow = htmlChannelRows[i];
                this.appendChannelRowElementToMainDiv(htmlChannelRow);
            }
        });
    }


    // add info to a given HTML template
    // if main div has no children yet, this will throw an exception:
    // Cannot read properties of undefined (reading 'length')
    #createChannelRowsFromTemplate(htmlTemplate, channelsUiData) {

        if (Utils.isNullOrUndefined(channelsUiData)) {
            console.log(`${TimeService.timeStamp} HtmlServices.#createChannelRowsFromTemplate(): channelsUiData = null or undefined`)
            return;
        }
        if (Utils.isNullOrUndefined(channelsUiData.channels)) {
            console.log(`${TimeService.timeStamp} HtmlServices.#createChannelRowsFromTemplate(): channelsUiData.channels = null or undefined`)
            return;
        }

        const htmlRows = [];
        // channelsUiData IS NOT AN ARRAY. It is HTMLCollection and it does not have forEach method. 
        // Must to convert it to the array first.

        const parser = new DOMParser();

        for (let i = 0; i < channelsUiData.channels.length; i++) {

            //Convert the HTML string read from the template html file into a document object
            const htmlTemplateDocument = parser.parseFromString(htmlTemplate, 'text/html');

            const uiChannelData = channelsUiData.channels[i]; //id, logo, name, attributes[slingName, number, quality], channelType
            uiChannelData.logo = channelsUiData.channels[i].logo;
            uiChannelData.channelType = channelsUiData.channels[i].channelType;

            // id
            const uiRow = HtmlUtils.getFirstElementByClassName(htmlTemplateDocument, Configuration.css.cssChannelRow);
            uiRow.setAttribute("id", uiChannelData.id);

            // logo
            const logoElement = htmlTemplateDocument.getElementsByTagName("img")[0]; //HtmlUtils.getFirstElementByClassName(doc, Configuration.css.cssLogo);
            logoElement.setAttribute("src", decodeURIComponent(Configuration.tvChannelsLogoLocation + uiChannelData.logo));
            logoElement.setAttribute("alt", Configuration.tvChannelsLogoLocation + uiChannelData.name);

            // name
            const divChannelNameElement = htmlTemplateDocument.getElementsByTagName("div")[0]; //HtmlUtils.getFirstElementByClassName(doc, Configuration.css.cssChannelName);
            const spanNameElement = divChannelNameElement.getElementsByTagName("span")[0];
            spanNameElement.innerHTML = uiChannelData.name;

            //const divChannelNumbersBySlingNameElement = htmlTemplateDocument.querySelectorAll("[data-channel-name]")[0];
            const divChannelNumbersBySlingNameElement = HtmlUtils.getFirstElementByClassName(htmlTemplateDocument, 'button-container');


            let slingNumber = 0;
            const isJustOneSling = Configuration.slingBoxesNames.length === 1;
            // number and quality - for each slingName
            // The template has two divs with "data-slingbox-name='A'" and "data-slingbox-name='M'", corresponding to my two slingNames 'A' and 'M'
            // 'uiChannelData' attributes are sorted by slingName order:
            // 0 : {slingName: 'M', number: '0', quality: true}
            // 1 : {slingName: 'A', number: '0', quality: true}
            uiChannelData.attributes.forEach(uiAttribute => {
                    const divChannelNumberElement =
                        this.#createChannelNumberButton(uiAttribute["slingName"], uiAttribute["number"], uiAttribute["quality"], uiChannelData.id, slingNumber, isJustOneSling);
                    if (divChannelNumberElement && divChannelNumbersBySlingNameElement) {
                        divChannelNumbersBySlingNameElement.prepend(divChannelNumberElement);
                    }
                    slingNumber++;
                }
            );


            // type / description
            const channelTypeDescription = htmlTemplateDocument.querySelector("[" + Configuration.css.dataAttributeChannelType + "]");
            if (!Utils.isNullOrUndefined(channelTypeDescription)) {
                channelTypeDescription.innerHTML = uiChannelData.channelType;
            }

            // Append the HTML to the UI. (Convert document to HTML)
            // - doc.documentElement.innerHTML = creates a head and a wraps my content in a body
            // - doc.body.innerHTML = get only my content, 
            htmlRows.push(htmlTemplateDocument.body.innerHTML);
        }

        return htmlRows;
    }


    #createChannelNumberButton(slingName, channelNumber, isHighQuality, channelId, slingNumber, isJustOneSling) {

        if (Utils.isNullOrUndefined(slingName)) {
            console.error(`${TimeService.timeStamp} createChannelNumberButton(): SlingBox name is empty for channel Id: ${channelId}`);

            return null;
        }

        // Create a new div element
        const divElement = document.createElement('div');
        divElement.className = "col-md-2 col-sm-3 col-3 col-xs-3 div-channel-number button-child";
        if (isJustOneSling === true) {
            divElement.style.right = "40%";
        }
        divElement.setAttribute("data-slingbox-name", slingName);

        const spanElement = document.createElement('span');
        spanElement.className = "span-channel-number";

        const color = getColorForNumber(slingNumber)
        spanElement.style.color = color;

        const intNumber = parseInt(channelNumber, 10);
        if (!isNaN(intNumber)) {
            spanElement.textContent = channelNumber;
        }

        if (isHighQuality === false) {
            spanElement.classList.add(Configuration.css.spanChannelNumberPoorQuality);
        }

        divElement.appendChild(spanElement);

        return divElement;


        function getColorForNumber(number) {
            const colors = ["blue", "red", "green"];
            const colorIndex = number % 3;
            return colors[colorIndex];
        }
    }

    appendChannelRowElementToMainDiv(htmlContent) {
        const mainDiv = HtmlUtils.getFirstElementByClassName(document, Configuration.css.cssMainDiv);
        if (Utils.isNullOrUndefined(mainDiv)) {
            console.log(`${TimeService.timeStamp} ${this.appendChannelRowElementToMainDiv.name}(): main div is null or undefined`);

            return;
        }

        mainDiv.insertAdjacentHTML('beforeend', htmlContent);
    }

    // returns true if has tv programs 
    populateChannelRowsWithTvPrograms(tvGuide, deviceDateTime) {
        const parentElement = document.getElementById('tvGuide'); // HtmlUtils.getFirstElementByClassName(document, Configuration.css.cssMainDiv);

        if (Utils.isNullOrUndefined(parentElement)) {
            console.log(`${TimeService.timeStamp} populateChannelRowsWithTvPrograms(): main div is null or undefined`);

            return false;
        }

        if (parentElement.childElementCount === 0) {
            console.log(`${TimeService.timeStamp} populateChannelRowsWithTvPrograms(): main div has no children yet`);

            return false;
        }

        const allChannelIds = tvGuide.getAllTvChannelIds();
        const fromTime = TimeService.incrementDateTime(deviceDateTime, 0, -5, 0);
        const toTime = TimeService.incrementDateTime(deviceDateTime, 2, 0, 0);

        allChannelIds.forEach(tvChannelId => {
            this.#insertTvProgramsInChannelRowElement(tvGuide, tvChannelId, fromTime, toTime, deviceDateTime,
                Configuration.maxProgramsToDisplayInARow);
        });

        return true;
    }


    // insert the TV Programs in a given channel (Bootstrap) row element   
    #insertTvProgramsInChannelRowElement(tvGuide, tvChannelId, fromTime, toTime, deviceDateTime, maxProgramsToDisplay) {
        const rowElement = document.getElementById(tvChannelId);
        if (Utils.isNullOrUndefined(rowElement)) {
            console.log(`${TimeService.timeStamp} insertTvProgramsInChannelRowElement(): Did not find a row element with id: ${tvChannelId}`);

            return;
        }

        const divElement = HtmlUtils.getFirstElementByClassName(rowElement, Configuration.css.cssProgramTable);
        if (Utils.isNullOrUndefined(divElement)) {
            console.log(`${TimeService.timeStamp} insertTvProgramsInChannelRowElement(): Did not find element with classes ${Configuration.css.cssProgramTable} for row id: ${tvChannelId}`);

            return;
        }

        const tvChannel = tvGuide.getTvChannelById(tvChannelId);
        const selectedPrograms = tvChannel.getTvProgramsByTimeRange(fromTime, toTime, deviceDateTime);
        if (Utils.isNullOrUndefined(selectedPrograms)) {
            //console.error("createTvProgramsTableElement(): 'selectedPrograms' is null");
            return;
        }

        const table = this.createTvProgramsTableElement(selectedPrograms, maxProgramsToDisplay, deviceDateTime);

        if (Utils.isNullOrUndefined(table)) {
            let programsCount = 0
            if (!Utils.isNullOrUndefined(selectedPrograms) && Array.isArray(selectedPrograms)) {
                programsCount = selectedPrograms.length;
            }
            const errMsg = `${TimeService.timeStamp} insertTvProgramsInChannelRowElement(): 'table' is null. TvChannelId: '${tvChannelId}' selectedPrograms[] count: ${programsCount}`;
            console.error(errMsg);

            return;
        }

        divElement.innerHTML = table.outerHTML;
    }


    createTvProgramsTableElement(selectedPrograms, maxProgramsToDisplay, deviceDateTime) {

        if (Utils.isNullOrUndefined(selectedPrograms)) {
            console.error("createTvProgramsTableElement(): 'selectedPrograms' is null");
            return;
        }

        const tableElement = document.createElement('table');
        const tableCss = "table table-striped table-hover table-bordered mb-0 p-0 table_program";
        const tableCssArray = tableCss.split(" ");
        tableCssArray.forEach(cssElement => {
            tableElement.classList.add(cssElement);
        });

        this.addTvProgramsRows(tableElement, selectedPrograms, deviceDateTime, maxProgramsToDisplay);

        return tableElement;
    }

    addTvProgramsRows(tableElement, selectedPrograms, deviceDateTime, maxProgramsToDisplay) {
        if (maxProgramsToDisplay === null || maxProgramsToDisplay === undefined) maxProgramsToDisplay = 99;

        for (let i = 0; i < selectedPrograms.length; i++) {
            const row = tableElement.insertRow(i);

            const cellStartTime = row.insertCell(0);
            const cellProgramName = row.insertCell(1);

            cellStartTime.classList.add("ora");
            cellProgramName.classList.add("emisiune");

            const tvProgram = selectedPrograms[i];
            if (Utils.isNullOrUndefined(tvProgram)) {
                console.log(`${TimeService.timeStamp} undefined record in 'selectedPrograms', index: ${i} `);
                continue;
            }

            cellStartTime.innerHTML = tvProgram.startTimeHm;

            tvProgram.isFirstRow = i === 0;

            cellProgramName.innerHTML = this.createTvProgramNameElement(tvProgram, deviceDateTime);

            if (tvProgram.isPlayingNow(deviceDateTime)) {
                row.classList.add("table-primary");
            }

            if (i >= maxProgramsToDisplay - 1) break;
        }
    }

    createTvProgramNameElement(tvProgram, currentTime) {

        if (tvProgram.isPlayingNow(currentTime)) {
            const progressElement = this.createProgressBar(
                tvProgram.startTime.getTime(),
                currentTime.getTime(),
                tvProgram.endTime.getTime(),
                HtmlUtils.unEscapeHTML(tvProgram.name)
            );
            return progressElement.outerHTML;
        } else {
            return HtmlUtils.unEscapeHTML(tvProgram.name);
        }
    }

    createProgressBar(startTimeMinutes, currentTimeMinutes, endTimeMinutes, programName) {

        if (startTimeMinutes > endTimeMinutes) throw ("Wrong inputs, start " + startTimeMinutes + "is after end" + endTimeMinutes);
        if (!Utils.isBetween(startTimeMinutes, currentTimeMinutes, endTimeMinutes))
            throw ("Wrong inputs, current time " + currentTimeMinutes + " is not between start and end");

        const durationMinutes = endTimeMinutes - startTimeMinutes;
        const percentage = ((currentTimeMinutes - startTimeMinutes) / durationMinutes) * 100;

        const divProgressElement = document.createElement('div');
        divProgressElement.classList.add("progress");

        const divProgressBarElement = document.createElement('div');
        divProgressBarElement.classList.add("progress-bar");
        divProgressBarElement.setAttribute("role", "progressbar");
        divProgressBarElement.setAttribute("style", "width: " + percentage + "%");
        divProgressBarElement.setAttribute("aria-valuenow", +'"' + percentage + '"');
        divProgressBarElement.setAttribute("aria-valuemin", "0");
        divProgressBarElement.setAttribute("aria-valuemax", "100");

        const spanForName = document.createElement("span");
        spanForName.classList.add("progress-type");
        spanForName.innerHTML = programName;

        // Apply the truncation style to the span
        spanForName.classList.add("truncated");

        divProgressBarElement.appendChild(spanForName);
        divProgressElement.appendChild(divProgressBarElement);

        return divProgressElement;
    }


    // HTML MODAL POPUP
    static globalModalTvChannelId; // Hack to fix displaying the modal popup the same TvChannel
    static outerThisModalPopup = this;

    static populateModalPopup(event) {

        const button = window.$(event.relatedTarget); // element that triggered the modal
        const modalElement = window.$(this);

        HtmlServices.outerThisModalPopup = this;

        //let tvChannelId = button.attr("id");
        let tvChannelId = event.relatedTarget.parentElement.attributes['id'].value

        if (Utils.isNullOrUndefined(tvChannelId)) {
            tvChannelId = button.data('channel-id'); // Extract info from data-* attributes = only for testing
        }
        HtmlServices.globalModalTvChannelId = tvChannelId;

        // Populate the modal popup with the list of programs
        let tvChannelName;

        if (Utils.isNullOrUndefined(tvChannelId)) {
            tvChannelName = "Channel ID not found";
            modalElement.find('.modal-title').text(tvChannelName);
            return;
        }

        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        HtmlServices.updateDateTimeInModalPopup(this);
        HtmlServices.updateProgramTableInModalPopup(this, tvChannelId);

        setInterval(HtmlServices.updateDateTimeInModalPopup, 30000, this);

        // ToDo: FIX BUG: this currently displays programs from previously seen channels
        setInterval(HtmlServices.updateProgramTableInModalPopup, 30000, this, null);

        const channelUiCollectionAsJson = DataServices.getTvChannelUiCollectionAsJson();
        tvChannelName = channelUiCollectionAsJson.channels.filter(channel => {
            return channel.id === tvChannelId
        })[0].name;

        modalElement.find('.modal-title').text(tvChannelName);
    }

    static disposeModalPopup() {
        clearInterval(HtmlServices.updateDateTimeInModalPopup);
        clearInterval(HtmlServices.updateProgramTableInModalPopup);

        // remove the dynamically added table
        //const divElement = HtmlServices.outerThisModalPopup.querySelector("#divTvProgramModal");
        const divElement = document.querySelector("#divTvProgramModal");
        divElement.querySelectorAll('*').forEach(childNode => childNode.remove());

        // Destroy modal (= the jQuery instance of the Bootstrap's Modal component): 
        // NOT WORKING: after modal('dispose') the modal popup can no longer be closed
        //$('#displayProgramsModal').modal("dispose");
    }

    static updateDateTimeInModalPopup(modalElement) {
        modalElement.querySelector("#divDateTimeModal").innerHTML = TimeService.getDeviceDateTimeFormatted("dd.MMM.yyyy HH:mm");
    }

    static updateProgramTableInModalPopup(modalElement, tvChannelId) {
        // Hack: need global variable otherwise, when using setInterval(), this function receives, 
        // one after another, the previous values of the tvChannelId which have been opened in popup
        // So, passing a null to 'tvChannelId' will get its value from the global context:
        if (Utils.isNullOrUndefined(tvChannelId)) tvChannelId = HtmlServices.globalModalTvChannelId;

        const deviceDateTime = TimeService.getDeviceDateTime();
        const tvGuide = DataServices.createTvGuide(deviceDateTime);
        const tvChannel = tvGuide.getTvChannelById(tvChannelId);
        if (Utils.isNullOrUndefined(tvChannel)) {
            // Not an error, I may not get records on purpose (when testing, etc.)
            console.log(`${TimeService.timeStamp} Channel Id ${tvChannelId} not found in TvGuide`);
            return;
        }

        let firstHour = TimeService.getDateTimeAtFirstHourOfTheDay(deviceDateTime);
        const lastHour = TimeService.incrementDateTime(deviceDateTime, 12);

        // Display on-going programs, started 2 hours ago       
        if (TimeService.dateDifferenceInHours(deviceDateTime, firstHour) < 2) {
            firstHour = TimeService.incrementDateTime(firstHour, -2);
        }

        // Display more that 3 rows (when the interval > 5 hours)
        if (TimeService.dateDifferenceInHours(lastHour, firstHour) < 5) {
            firstHour = TimeService.incrementDateTime(firstHour, -5);
        }

        const selectedPrograms = tvChannel.getTvProgramsByTimeRange(firstHour, lastHour, deviceDateTime);

        if (Utils.isNullOrUndefined(selectedPrograms)) {
            const errMsg = "updateProgramTableInModalPopup(): 'selectedPrograms' is null. TvChannelId: " + tvChannelId;
            console.error(errMsg);

            return;
        }

        const htmlServices = new HtmlServices();
        const table = htmlServices.createTvProgramsTableElement(selectedPrograms, 99, deviceDateTime);
        table.setAttribute("padding-left", "2px");

        const divElement = modalElement.querySelector("#divTvProgramModal");
        divElement.innerHTML = table.outerHTML;
    }


    static messageTypeError = "error";
    static messageTypeWarning = "warning";


    /* ***********************************************************************
    *  Display a message in the bar at the top of the page.
    * If the message is an error, it will be displayed in red.
    * ************************************************************************/
    static displayMessage(message, messageType) {
        const divElement = document.querySelector("#divMessage");

        if (divElement.innerHTML.trim() === message.trim()) {
            return;
        }
        if (HtmlServices.isErrorMessageDisplayed(divElement) && messageType !== HtmlServices.messageTypeError) {
            return; // do not overwrite the error message
        }

        divElement.innerHTML = message;
        switch (messageType) {
            case "error":
                divElement.style.color = "red";
                break;
            case "warning":
                divElement.style.color = "blue";
                break;
            default:
                divElement.style.color = "black";
                break;
        }
        setInterval(HtmlServices.#hideMessage, 30000);
    }

    static #hideMessage() {
        const divElement = document.querySelector("#divMessage");
        divElement.innerHTML = "";
        divElement.color = "black";
    }

    static isErrorMessageDisplayed(divElement) {
        return divElement.style.color === "red";
    }
}


// /$$   /$$ /$$$$$$$$ /$$      /$$ /$$             /$$   /$$   /$$     /$$ /$$
// | $$  | $$|__  $$__/| $$$    /$$$| $$            | $$  | $$  | $$    |__/| $$
// | $$  | $$   | $$   | $$$$  /$$$$| $$            | $$  | $$ /$$$$$$   /$$| $$  /$$$$$$$
// | $$$$$$$$   | $$   | $$ $$/$$ $$| $$            | $$  | $$|_  $$_/  | $$| $$ /$$_____/
// | $$__  $$   | $$   | $$  $$$| $$| $$            | $$  | $$  | $$    | $$| $$|  $$$$$$
// | $$  | $$   | $$   | $$\  $ | $$| $$            | $$  | $$  | $$ /$$| $$| $$ \____  $$
// | $$  | $$   | $$   | $$ \/  | $$| $$$$$$$$      |  $$$$$$/  |  $$$$/| $$| $$ /$$$$$$$/
// |__/  |__/   |__/   |__/     |__/|________/       \______/    \___/  |__/|__/|_______/

class HtmlUtils {
    static decodeHtml(html) {
        const htmlTextAreaElement = document.createElement("textarea");
        htmlTextAreaElement.innerHTML = html;

        return htmlTextAreaElement.value;
    }

    // a 'querySelector' that accepts classname(s) without the prepending "." like the ones stored in Configuration class.
    // param 'className' shall be in the form of "cssClass1 cssClass2" - with spaces and without dots
    static getFirstElementByClassName(rootElement, className) {
        const search = ' ';
        const replaceWith = '.';

        if (Utils.isNullOrUndefined(rootElement)) throw "rootElement parameter is null or undefined";
        if (Utils.isNullOrUndefined(className)) throw "className parameter is null or undefined";
        if (className.includes(replaceWith)) throw "className parameter should not contain" + replaceWith;

        // sanitize the input: replace multiple white spaces with just one
        className = className.replace(/  +/g, ' ');

        // transform the input in the format required by the querySelector()
        let classNamesWithoutSpaces = className.split(search).join(replaceWith);
        classNamesWithoutSpaces = "." + classNamesWithoutSpaces;

        return rootElement.querySelector(classNamesWithoutSpaces);
    }

    //https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript/39243641#39243641
    static unEscapeHTML(str) {

        const htmlEntities = {
            nbsp: ' ',
            cent: '¢',
            pound: '£',
            yen: '¥',
            euro: '€',
            copy: '©',
            reg: '®',
            lt: '<',
            gt: '>',
            quot: '"',
            amp: '&',
            apos: '\''
        };

        return str.replace(/&([^;]+);/g, function (entity, entityCode) {
            let match = [''];

            if (entityCode in htmlEntities) {
                return htmlEntities[entityCode];
                /*eslint no-cond-assign: 0*/
            } else if (match === entityCode.match(/^#x([\da-fA-F]+)$/)) {
                return String.fromCharCode(parseInt(match[1], 16));
                /*eslint no-cond-assign: 0*/
            } else if (match === entityCode.match(/^#(\d+)$/)) {
                return String.fromCharCode(~~match[1]);
            } else {
                return entity;
            }
        });
    };

    static getQueryParameterByKey(keyParam) {
        if (Utils.isNullOrUndefined(keyParam)) {
            return "";
        }
        let searchParams = new URLSearchParams(document.location.search);
        let paramValue = searchParams.get(keyParam);
        if (Utils.isNullOrUndefined(paramValue)) {
            paramValue = "";
        }

        return paramValue;
    }


    static getBaseUrl = url => url.split('/').slice(0, 3).join('/');


    // Add a time stamp will prevent caching
    static appendTimeStampToUrl(url) {
        if (Utils.isNullOrUndefined(url)) {
            return "";
        }

        return url.includes("?")
            ? `${url}&timeStamp=${Date.now()}`
            : `${url}?timeStamp=${Date.now()}`;
    }


    static removeComments(htmlString) {
        if (!htmlString)
            return htmlString;

        return htmlString.replace(/<!--[\s\S]*?-->/g, '')
    }

    // allow displaying unicode characters in the console and in alert() messages
    // https://stackoverflow.com/questions/5620516/how-to-get-text-bold-in-alert-or-confirm-box
    // https://github.com/davidkonrad/toUnicodeVariant
    // Usage example: alert('your chance is: ' + toUnicodeVariant('100%', 'bold sans', 'bold'));
    static toUnicodeVariant(str, variant, flags) {
        const offsets = {
            m: [0x1d670, 0x1d7f6],
            b: [0x1d400, 0x1d7ce],
            i: [0x1d434, 0x00030],
            bi: [0x1d468, 0x00030],
            c: [0x1d49c, 0x00030],
            bc: [0x1d4d0, 0x00030],
            g: [0x1d504, 0x00030],
            d: [0x1d538, 0x1d7d8],
            bg: [0x1d56c, 0x00030],
            s: [0x1d5a0, 0x1d7e2],
            bs: [0x1d5d4, 0x1d7ec],
            is: [0x1d608, 0x00030],
            bis: [0x1d63c, 0x00030],
            o: [0x24B6, 0x2460],
            p: [0x249C, 0x2474],
            w: [0xff21, 0xff10],
            u: [0x2090, 0xff10]
        }

        const variantOffsets = {
            'monospace': 'm',
            'bold': 'b',
            'italic': 'i',
            'bold italic': 'bi',
            'script': 'c',
            'bold script': 'bc',
            'gothic': 'g',
            'gothic bold': 'bg',
            'doublestruck': 'd',
            'sans': 's',
            'bold sans': 'bs',
            'italic sans': 'is',
            'bold italic sans': 'bis',
            'parenthesis': 'p',
            'circled': 'o',
            'fullwidth': 'w'
        }

        // special characters (absolute values)
        const special = {
            m: {
                ' ': 0x2000,
                '-': 0x2013
            },
            i: {
                'h': 0x210e
            },
            g: {
                'C': 0x212d,
                'H': 0x210c,
                'I': 0x2111,
                'R': 0x211c,
                'Z': 0x2128
            },
            o: {
                '0': 0x24EA,
                '1': 0x2460,
                '2': 0x2461,
                '3': 0x2462,
                '4': 0x2463,
                '5': 0x2464,
                '6': 0x2465,
                '7': 0x2466,
                '8': 0x2467,
                '9': 0x2468,
            },
            p: {},
            w: {}
        };
        //support for parenthesized latin letters small cases 
        for (let i = 97; i <= 122; i++) {
            special.p[String.fromCharCode(i)] = 0x249C + (i - 97)
        }
        //support for full width latin letters small cases 
        for (let i = 97; i <= 122; i++) {
            special.w[String.fromCharCode(i)] = 0xff41 + (i - 97)
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';

        const getType = function (variant) {
            if (variantOffsets[variant]) return variantOffsets[variant]
            if (offsets[variant]) return variant;
            return 'm'; //monospace as default
        };
        const getFlag = function (flag, flags) {
            if (!flags) return false
            return flags.split(',').indexOf(flag) > -1
        };

        const type = getType(variant);
        const underline = getFlag('underline', flags);
        const strike = getFlag('strike', flags);
        let result = '';

        for (let k of str) {
            let index
            let c = k
            if (special[type] && special[type][c]) c = String.fromCodePoint(special[type][c])
            if (type && (index = chars.indexOf(c)) > -1) {
                result += String.fromCodePoint(index + offsets[type][0])
            } else if (type && (index = numbers.indexOf(c)) > -1) {
                result += String.fromCodePoint(index + offsets[type][1])
            } else {
                result += c
            }
            if (underline) result += '\u0332' // add combining underline
            if (strike) result += '\u0336' // add combining strike
        }
        return result
    }
}


//  /$$$$$$                                        /$$
// /$$__  $$                                      | $$
// | $$  \__/        /$$$$$$         /$$$$$$$      | $$$$$$$         /$$$$$$
// | $$             |____  $$       /$$_____/      | $$__  $$       /$$__  $$
// | $$              /$$$$$$$      | $$            | $$  \ $$      | $$$$$$$$
// | $$    $$       /$$__  $$      | $$            | $$  | $$      | $$_____/
// |  $$$$$$/      |  $$$$$$$      |  $$$$$$$      | $$  | $$      |  $$$$$$$
//  \______/        \_______/       \_______/      |__/  |__/       \_______/


/* *******************************************************************************************
SINGLETON that provides access to the cache instance.

// Usage in different classes
const cacheProvider1 = CacheProvider.getInstance();
const cache1 = cacheProvider1.getCache();

const cacheProvider2 = CacheProvider.getInstance();
const cache2 = cacheProvider2.getCache();

console.log(cache1 === cache2); // Output: true (both cache instances are the same)
** ******************************************************************************************/

class CacheProvider {
    constructor() {
        if (!CacheProvider.instance) {
            CacheProvider.instance = this;
            this.cache = new ExpiringCache(); // Create the cache instance here
        }
        return CacheProvider.instance;
    }

    static getInstance() {
        return CacheProvider.instance || new CacheProvider();
    }

    getCache() {
        return this.cache;
    }
}


/* *******************************************************************************************
ExpiringCache class, where  set method  accept both the value and an optional expiration time. 
If the expirationTimeMs parameter is not provided, it is assumed that the cache entry does not expire. 
The get method is also updated to handle items with and without expiration timestamps appropriately.

This way, you can use the set method to add items to the cache that either expire after a certain time or do not expire at all.

// Usage
const cache = new ExpiringCache();

cache.set('user123', { name: 'Alice' }, 5000); // Cache entry expires after 5 seconds
cache.set('settings', { theme: 'dark' });      // Cache entry does not expire

// Passing a call back function = a function that will be executed when the cache expires
const myCache = new ExpiringCache();
myCache.set('key1', 'value1', 2000, (key, value) => {
    console.log(`Cache with key ${key} and value ${value} has expired.`);
});

// Access the cache, which will trigger the callback if the cache has expired
const result = myCache.get('key1');


// Retrieve from cache
const user = cache.get('user123');
const settings = cache.get('settings');

console.log(user);      // Output: { name: 'Alice' }
console.log(settings);  // Output: { theme: 'dark' }
** ******************************************************************************************/
class ExpiringCache {
    constructor() {
        this.cache = new Map();
        this.removeExpired = this.removeExpired.bind(this);
    }

    set(key, value, expirationTimeMs, onExpireCallback, callbackParams) {
        if (expirationTimeMs !== undefined) {
            const expirationTimestamp = Date.now() + expirationTimeMs;
            this.cache.set(key, {value, expirationTimestamp, onExpireCallback, callbackParams});

            if (Configuration.debug) console.log(`${TimeService.timeStamp} Cache set, key: ${key}, expiration ${expirationTimeMs}, callback fn: ${Utils.isNullOrUndefined(onExpireCallback)}.
value: ${value}`);

            // Schedule cleanup after expirationTimeMs
            setTimeout(this.removeExpired, expirationTimeMs); //setTimeout(async () => await this.removeExpired(), expirationTimeMs);
        } else {
            this.cache.set(key, {value});
        }
    }

    get(key) {
        const entry = this.cache.get(key);
        if (entry) {
            if (entry.expirationTimestamp === undefined || // no expiration time
                entry.expirationTimestamp > Date.now()) {
                return entry.value;
            }

            // Delete if the entry has an expiration timestamp and it has expired
            if (entry.expirationTimestamp && entry.expirationTimestamp <= Date.now()) {
                this.cache.delete(key);
            }
        }
        return undefined;
    }

    async removeExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expirationTimestamp && entry.expirationTimestamp <= now) {

                // Execute the onExpireCallback if provided
                if (entry.onExpireCallback) {
                    if (Configuration.debug) console.log(`${TimeService.timeStamp} Cache expired, key: ${key}, value ${entry.value}. Executing the callback function.`);

                    if (entry.onExpireCallback instanceof Promise) {
                        Array.isArray(entry.callbackParams)
                            ? await entry.onExpireCallback(...entry.callbackParams)
                            : await entry.onExpireCallback;
                    } else if (typeof entry.onExpireCallback === 'function') {
                        Array.isArray(entry.callbackParams)
                            ? entry.onExpireCallback(...entry.callbackParams)
                            : entry.onExpireCallback
                    }
                    this.cache.delete(key);
                }
            }
        }
    }
}


// /$$$$$$        /$$             /$$$$$$       /$$   /$$        /$$$$$$
// /$$__  $$      | $$            |_  $$_/      | $$$ | $$       /$$__  $$
// | $$  \__/      | $$              | $$        | $$$$| $$      | $$  \__/
// |  $$$$$$       | $$              | $$        | $$ $$ $$      | $$ /$$$$
//  \____  $$      | $$              | $$        | $$  $$$$      | $$|_  $$
// /$$  \ $$      | $$              | $$        | $$\  $$$      | $$  \ $$
// |  $$$$$$/      | $$$$$$$$       /$$$$$$      | $$ \  $$      |  $$$$$$/
//  \______/       |________/      |______/      |__/  \__/       \______/
//

/* *******************************************************************************************
// SlingServices
// Change the SlingPlayer channels by sending the channel number to the Slingbox server.
// The channel number is sent to an intermediary endpoint, because the Slingbox server does not allow CORs
// (Cross-Origin Resource Sharing )
** ******************************************************************************************/
class SlingServices {

    static #cache = CacheProvider.getInstance().getCache();

    /*********************************************************************************************

     /$$$$$$        /$$       /$$                       /$$
     /$$__  $$      | $$      |__/                      | $$
     | $$  \__/      | $$       /$$        /$$$$$$$      | $$   /$$
     | $$            | $$      | $$       /$$_____/      | $$  /$$/
     | $$            | $$      | $$      | $$            | $$$$$$/
     | $$    $$      | $$      | $$      | $$            | $$_  $$
     |  $$$$$$/      | $$      | $$      |  $$$$$$$      | $$ \  $$
     \______/       |__/      |__/       \_______/      |__/  \__/
     *********************************************************************************************/
    static clickHandler(eventTarget) {

        if (!(eventTarget instanceof HTMLDivElement)) {
            // ignore the ghost click event, on the span element inside the div
            // as the click event is also fired on the div element
            return;
        }

        const functionName = "SlingServices.clickHandler()";

        if (Configuration.debug) console.log(`${TimeService.timeStamp} ${functionName}: event: ${eventTarget}`);

        const spanChannelNumberElement = eventTarget.querySelector('.span-channel-number');
        if (Utils.isNullOrUndefined(spanChannelNumberElement)) {
            console.error(`${TimeService.timeStamp} ${functionName}: spanChannelNumberElement is null or undefined. Is the server running?`);
            return;
        }

        if (Utils.isNullOrUndefined(Configuration.slingApiUrls.slingServerUrl)) {
            console.error(`${TimeService.timeStamp} ${functionName}: slingBoxServerUrl is null or undefined`);
            return;
        }

        if (Utils.isNullOrUndefined(Configuration.slingApiUrls.slingRemoteControlUrl)) {
            console.error(`${TimeService.timeStamp} ${functionName}: remoteControlServiceUrl is null or undefined`);
            return;
        }

        const channelNumber = spanChannelNumberElement.innerHTML
        const slingBoxName = eventTarget.dataset.slingboxName

        if (Utils.isNullOrUndefined(channelNumber)) {
            console.error(`${TimeService.timeStamp} ${functionName}: channelNumber is null or undefined`);
            return;
        }

        if (Utils.isNullOrUndefined(slingBoxName)) {
            console.error(`${TimeService.timeStamp} ${functionName}: slingboxName is null or undefined`);
            return;
        }

        // channelNumber may be null when checking if the streaming has stopped, otherwise it should be a number
        if (!Utils.isNullOrUndefined(channelNumber) && Number.isNaN(channelNumber.replace('.', ""))) {
            console.error(`${TimeService.timeStamp} ${functionName}: channelNumber is not a number: ${channelNumber} for slingboxName: ${slingBoxName}`);
            return;
        }

        this.setChannelChangedAsync(slingBoxName, channelNumber).then(() => {
            this.displayChannelButtonAsSelected(slingBoxName, channelNumber);
            this.sendChangeChannelRequestToServer(channelNumber, slingBoxName);
        })
            .catch(err => console.error(`${TimeService.timeStamp} ${functionName}: Error setting channel #: ${err}`));
    }

    static #formDataChannelNumberLabel = "Digits";
    static #formDataSlingBoxNameLabel = "_SlingBoxName";

    static sendChangeChannelRequestToServer(channelNumber, slingboxName) {
        let formData = new FormData();
        formData.append('Channel', 'Channel');
        formData.append('Digits', channelNumber.toString().trim());

        // Hack: pass slingboxName as additional parameter to the AJAX call 
        // so that it highlights the selected channel. 
        // Additional params will be ignored by the SlingBox_Server only when a channel # is passed.
        // but will throw an error if the channel # is not a number.
        if (!Utils.isNullOrUndefined(channelNumber)) {
            formData.append(SlingServices.#formDataSlingBoxNameLabel, slingboxName);
        }

        let slingboxServerRemoteUrl = Configuration.slingApiUrls.slingServerUrl + "/Remote/" + slingboxName;
        slingboxServerRemoteUrl = Configuration.slingApiUrls.slingRemoteControlUrl + "?url=" + slingboxServerRemoteUrl;

        // Prevent sending the same channel number consecutively.
        if (!this.#isChannelSameAsLastSelected(slingboxName, channelNumber)) {
            this.setLastSelectedChannelToCache(slingboxName, channelNumber);

            // AJAX call to send data to the server
            SlingServices.#sendChannelChangedDataToServerAjax(formData, slingboxServerRemoteUrl)
        }
    }


    static #isChannelSameAsLastSelected(slingboxName, channelNumber) {
        if (Utils.isNullOrUndefined(channelNumber)) {
            // edge case, to get the server trigger when the streaming has stopped 
            return false;
        }
        const lastChannelNumber = this.getLastSelectedChannelFromCache(slingboxName);

        if (Utils.isNullOrUndefined(lastChannelNumber)) {
            return false;
        }

        const isSameChannel = lastChannelNumber.toString() === channelNumber.toString();

        return isSameChannel;
    }


    // Change the channel by sending an async POST request to the Slinger server. 
    static #sendChannelChangedDataToServerAjax(data, url) {
        console.log(`Sending ChannelChanged data: ${data.get(SlingServices.#formDataSlingBoxNameLabel)} ${data.get(SlingServices.#formDataChannelNumberLabel)} to ${url}`);

        const httpRequest = new XMLHttpRequest();
        const urlEncodedDataPairs = [];

        // Turn the data object into an array of URL-encoded key/value pairs.
        for (const [name, value] of data) {
            urlEncodedDataPairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
        }

        // Combine the pairs into a single string and replace all %-encoded spaces to
        // the '+' character; matches the behavior of browser form submissions.
        const urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

        // on successful data submission
        httpRequest.addEventListener('load', () => {

            const slingboxName = data.get(SlingServices.#formDataSlingBoxNameLabel);
            const channelNumber = data.get(SlingServices.#formDataChannelNumberLabel);
            const success = httpRequest.status === 200;

            if (!success) {
                const responseText = httpRequest.responseText;
                const errMsg = "Error" + " " + responseText + " when sending " + urlEncodedData + "to " + url;
                alert(responseText);
                console.error(errMsg);
            }

            this.highlightSelectedChannelButton(slingboxName, channelNumber, success);

            this.notifyNewChannel(slingboxName, channelNumber);
        });

        // on error
        httpRequest.addEventListener('error', (event) => {
            const xmrErrs = httpRequest.responseText + " " + httpRequest.statusText + " " + event.currentTarget;

            const slingboxName = data.get(SlingServices.#formDataSlingBoxNameLabel);
            const channelNumber = data.get(SlingServices.#formDataChannelNumberLabel);

            if (Utils.isNullOrUndefined(xmrErrs)) {
                this.highlightSelectedChannelButton(slingboxName, channelNumber, false);
                console.error("Could not send POST data to server: " + url + ", error: " + xmrErrs);

                return
            }

            this.highlightSelectedChannelButton(slingboxName, channelNumber, false);

            const errMsg = "Error " + xmrErrs + " when sending " + urlEncodedData + "to " + url;
            console.error(errMsg);
        });

        // Set up our request
        httpRequest.open('POST', url, true);

        // Add the required HTTP header for form data POST requests
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.setRequestHeader('X-Referer', url);

        // Finally, send our data.
        httpRequest.send(urlEncodedData);
    }


    /*********************************************************************************************

     /$$   /$$       /$$$$$$
     | $$  | $$      |_  $$_/
     | $$  | $$        | $$
     | $$  | $$        | $$
     | $$  | $$        | $$
     | $$  | $$        | $$
     |  $$$$$$/       /$$$$$$
     \______/       |______/

     *********************************************************************************************/

    // Selects or unselects the channel button. 
    // Returns the number of selected buttons
    static displayChannelButtonAsSelected(slingboxName, channelNumber) {
        const channelNumbersElements = this.#getAllSlingBoxChannelNumbersAsDivs(slingboxName);

        if (Utils.isNullOrUndefined(channelNumbersElements)) {
            console.error("displayChannelButtonAsSelected(): channelNumbersElements is null or undefined. for slingBox: " + slingboxName);
            return;
        }

        channelNumbersElements.forEach(divElement => {
                const spanChannelNumberElement = HtmlUtils.getFirstElementByClassName(divElement, Configuration.css.spanChannelNumber);

                if (Utils.isNullOrUndefined(spanChannelNumberElement)) {
                    console.error("displayChannelButtonAsSelected(): spanChannelNumberElement is null or undefined.");
                    return;
                }

                this.resetHighlightedButton(divElement);

                const channelNumberFromElement = spanChannelNumberElement.innerHTML;
                const isSelected = (channelNumberFromElement.toString() === channelNumber.toString());

                this.#setButtonAsSelected(divElement, spanChannelNumberElement, isSelected);
            }
        )
    }


    static #getAllSlingBoxChannelNumbersAsDivs(slingboxName) {
        const selectorExpressionForSlingId = this.#createSelectorExpressionForSlingChannelsAsDivs(slingboxName);
        const divChannelNumbersBySlingNameElement = document.querySelectorAll(selectorExpressionForSlingId);

        return divChannelNumbersBySlingNameElement;
    }


    static #createSelectorExpressionForSlingChannelsAsDivs(slingboxName) {
        const selectorExpressionForSlingId = "[" + Configuration.css.dataAttributeSlingBoxName + "='" + slingboxName + "']"
        return selectorExpressionForSlingId;
    }

    static #isSlingBoxDisplayedWithButtons(slingboxName) {
        const selectorExpr = "." + Configuration.css.divChannelNumberAsButton + this.#createSelectorExpressionForSlingChannelsAsDivs(slingboxName);
        const element = document.querySelector(selectorExpr);

        return !Utils.isNullOrUndefined(element);

    }

    // clear all previous highlights for the selected channel number
    static resetHighlightedButton(divElement) {
        divElement.classList.remove(Configuration.css.divChannelNumberHighlighted);
        divElement.classList.remove(Configuration.css.divChannelNumberError);
    }

    static #setButtonAsSelected(divElement, spanChannelNumberElement, isSelected) {
        if (isSelected) {
            divElement.classList.add(Configuration.css.divChannelNumberSelected);
            spanChannelNumberElement.classList.add(Configuration.css.spanChannelNumberSelected);
        } else {
            divElement.classList.remove(Configuration.css.divChannelNumberSelected);
            spanChannelNumberElement.classList.remove(Configuration.css.spanChannelNumberSelected);
        }
    }


    static highlightSelectedChannelButton(slingboxName, channelNumber, success) {

        if (Utils.isNullOrUndefined(slingboxName) || Utils.isNullOrUndefined(channelNumber)) {
            return;
        }

        const channelNumbersElements = this.#getAllSlingBoxChannelNumbersAsDivs(slingboxName);

        if (Utils.isNullOrUndefined(channelNumbersElements) || channelNumbersElements.length === 0) {
            return;
        }

        const highlightColor = success
            ? Configuration.css.divChannelNumberHighlighted
            : Configuration.css.divChannelNumberError;

        channelNumbersElements.forEach(divElement => {
                const spanChannelNumberElement = HtmlUtils.getFirstElementByClassName(divElement, Configuration.css.spanChannelNumber);
                if (Utils.isNullOrUndefined(spanChannelNumberElement)) {
                    return;
                }

                this.resetHighlightedButton(divElement);

                const channelNumberFromElement = spanChannelNumberElement.innerHTML;

                if (channelNumberFromElement.toString() === channelNumber.toString()) {
                    divElement.classList.add(highlightColor);
                }
            }
        )
    }


    // *************************************************************************************************
    // Change the appearance of the channel numbers to look like buttons and 
    // Add event listeners to them
    // - or 
    // Disable them if the server is not connected - check the streaming status of the SlingBox server
    // *************************************************************************************************
    static async displayDivChannelNumbersAsButtonsAsync() {
        if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivChannelNumbersAsButtonsAsync() started`);

        if (!Configuration.isPageLaunchedFromSlingBoxServer) {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivChannelNumbersAsButtonsAsync() exited: page is not launched from the SlingBox server`);
            return false;
        }

        let parentElement = document.getElementById('tvGuide'); // div containing all channels (with programs) rows
        if (Utils.isNullOrUndefined(parentElement)) {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivChannelNumbersAsButtonsAsync() exited: parentElement is null or undefined`);
            return false;
        }

        const divChannelNumberElements = parentElement.getElementsByClassName('div-channel-number');
        if (divChannelNumberElements.length === 0) {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivChannelNumbersAsButtonsAsync() exited: divChannelNumberCollection is empty`);
            return false;
        }

        // Key: slingBoxName, Value: {isConnectedAndStreaming, currentChannelNumber}
        const activelyStreamingStatusDictionary = new Map();
        await createActiveSlingboxesStreamingStatusDictionaryAsync();
        if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivChannelNumbersAsButtonsAsync() created streamingStatusDictionary with ${activelyStreamingStatusDictionary.size} entries`);

        displayDivsAsButtons();

        displayTheSelectedButtons();

        if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivChannelNumbersAsButtonsAsync() completed`);
        return true;

        // Note: use "for( of )" loop instead of "forEach()" because "forEach()" does not support async/await
        async function createActiveSlingboxesStreamingStatusDictionaryAsync() {
            const slingBoxesWithDisplayedButtons = SlingServices.#getAllSlingBoxesNamesWithDisplayedButtons();

            for (const slingBoxName of Configuration.slingBoxesNames) {
                const {
                    isStreaming,
                    currentChannelNumber
                } = await SlingServices.#getSlingBoxStreamingStatus(slingBoxName);

                const isConnectedAndStreaming = SlingServices.isSignalRConnectionConnected() && isStreaming;
                if (!isConnectedAndStreaming && !slingBoxesWithDisplayedButtons.includes(slingBoxName)) {
                    if (Configuration.debug) console.log(`${TimeService.timeStamp} createSlingboxesStreamingStatusDictionary() slingBoxName: ${slingBoxName} is not connected and streaming, and is not displayed with buttons. Skipping...`);
                    continue;
                }

                activelyStreamingStatusDictionary.set(slingBoxName, {isConnectedAndStreaming, currentChannelNumber});
            }
        }

        function displayTheSelectedButtons() {

            for (const slingBoxName of activelyStreamingStatusDictionary.keys()) {
                const {
                    isConnectedAndStreaming,
                    currentChannelNumber
                } = activelyStreamingStatusDictionary.get(slingBoxName);

                if (!isConnectedAndStreaming) {
                    continue;
                }

                SlingServices.displayChannelButtonAsSelected(slingBoxName, currentChannelNumber)
                SlingServices.highlightSelectedChannelButton(slingBoxName, currentChannelNumber, true);
            }
        }

        // Set the appearance of the channel number div to look like a button and add event listeners to them
        function displayDivsAsButtons() {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivsAsButtons() started`);

            for (let i = 0; i < divChannelNumberElements.length; i++) {

                const divChannelNumberElement = divChannelNumberElements[i];
                if (Utils.isNullOrUndefined(divChannelNumberElement)) {
                    console.error(`${TimeService.timeStamp} displayDivsAsButtons(): divChannelNumberElement is null or undefined`)
                    continue;
                }

                const slingboxName = divChannelNumberElement.dataset.slingboxName;
                if (Utils.isNullOrUndefined(slingboxName)) {
                    console.error(`${TimeService.timeStamp} displayDivsAsButtons(): slingBoxId is null or undefined`)
                    continue;
                }

                const spanChannelNumberElement = divChannelNumberElement.getElementsByClassName('span-channel-number')[0];
                if (Utils.isNullOrUndefined(spanChannelNumberElement)) {
                    console.error(`${TimeService.timeStamp} displayDivsAsButtons(): spanChannelNumber is null or undefined`)
                    continue;
                }

                const channelNumber = spanChannelNumberElement.innerHTML;
                if (Utils.isNullOrUndefined(channelNumber)) {
                    // It's OK for some buttons to not have a channel number. 
                    continue;
                }

                const streamingStatus = activelyStreamingStatusDictionary.get(slingboxName);
                if (Utils.isNullOrUndefined(streamingStatus)) {
                    // It's OK for some slingboxes to not have a streaming status b/c they are not active and do not need activation.
                    continue;
                }

                const isConnectedAndStreaming = streamingStatus.isConnectedAndStreaming;
                const parentElement = divChannelNumberElement.parentElement.parentElement.parentElement;
                const channelId = parentElement.id;

                setButtonAppearance(slingboxName, divChannelNumberElement, channelNumber, isConnectedAndStreaming);
                setButtonEventHandlers(slingboxName, divChannelNumberElement, spanChannelNumberElement, channelNumber, isConnectedAndStreaming, channelId);
            }
            if (Configuration.debug) console.log(`${TimeService.timeStamp} displayDivsAsButtons() completed`);
        }


        // set or remove the appearance of the channel number div to look like a button
        // (Note: does not select and highlight the selected button)
        function setButtonAppearance(slingBoxName, divChannelNumberElement, channelNumber, isConnectedAndStreaming) {

            if (Utils.isNullOrUndefined(channelNumber)) {
                // Its OK for some buttons to not have a channel number.
                return;
            }

            if (isConnectedAndStreaming) {
                divChannelNumberElement.classList.add(Configuration.css.divChannelNumberAsButton);
            } else {
                divChannelNumberElement.classList.remove(Configuration.css.divChannelNumberAsButton);

                // disable the selected button
                if (divChannelNumberElement.classList.contains(Configuration.css.divChannelNumberSelected)) {
                    divChannelNumberElement.classList.remove(Configuration.css.divChannelNumberSelected);
                    divChannelNumberElement.classList.remove(Configuration.css.divChannelNumberHighlighted)
                    divChannelNumberElement.classList.remove(Configuration.css.divChannelNumberError)

                    const spanChannelNumberElement = divChannelNumberElement.getElementsByClassName('span-channel-number')[0];
                    if (!Utils.isNullOrUndefined(spanChannelNumberElement)) {
                        spanChannelNumberElement.classList.remove(Configuration.css.spanChannelNumberSelected);
                    }
                }
            }
        }


        // add or remove event listeners to the div and span elements for the click event
        function setButtonEventHandlers(slingBoxName, divChannelNumberElement, spanChannelNumberElement, channelNumber, isConnectedAndStreaming, channelId) {
            if (Utils.isNullOrUndefined(channelNumber)) {
                return;
            }

            // Need the channelId to avoid issues when the same channel number is used on different channel rows (bad data from API) 
            const dictionaryKey = channelId + "_" + slingBoxName + "_" + channelNumber;

            if (isConnectedAndStreaming) {
                divChannelNumberElement.addEventListener('click', clickHandler);
                SlingServices.clickHandlerEventsDictionary.set(dictionaryKey, clickHandler);
            } else {
                // to remove the event listener, we need to pass the same function object that was used to add it
                const clickHandlerReference = SlingServices.clickHandlerEventsDictionary.get(dictionaryKey);
                if (!Utils.isNullOrUndefined(clickHandlerReference)) {
                    divChannelNumberElement.removeEventListener('click', clickHandlerReference);
                    SlingServices.clickHandlerEventsDictionary.delete(dictionaryKey);
                } else {
                    console.error(`${TimeService.timeStamp} SlingServices.setButtonEventHandlers(): removing event - did not find clickHandlerReference for slingBoxName: ${slingBoxName}, channelNumber: ${channelNumber}`);
                }
            }

            function clickHandler(event) {
                if ((event.target instanceof HTMLDivElement)) {
                    SlingServices.clickHandler(event.target);
                } else if ((event.target instanceof HTMLSpanElement)) {
                    SlingServices.clickHandler(event.target.parentElement);
                } else {
                    console.error(`${TimeService.timeStamp} SlingServices.clickHandler(): event.target is not a div or span element`);
                }
            }
        }

    }


    // store a reference to the click handler event of each slingbox and channel, in order to be removed later
    static clickHandlerEventsDictionary = new Map();


    /*********************************************************************************************

     // /$$$$$$        /$$                                                       /$$       /$$$$$$$
     // /$$__  $$      |__/                                                      | $$      | $$__  $$
     // | $$  \__/       /$$        /$$$$$$        /$$$$$$$         /$$$$$$       | $$      | $$  \ $$
     // |  $$$$$$       | $$       /$$__  $$      | $$__  $$       |____  $$      | $$      | $$$$$$$/
     // \____  $$      | $$      | $$  \ $$      | $$  \ $$        /$$$$$$$      | $$      | $$__  $$
     // /$$  \ $$      | $$      | $$  | $$      | $$  | $$       /$$__  $$      | $$      | $$  \ $$
     // |  $$$$$$/      | $$      |  $$$$$$$      | $$  | $$      |  $$$$$$$      | $$      | $$  | $$
     // \______/       |__/       \____  $$      |__/  |__/       \_______/      |__/      |__/  |__/
     //                           /$$  \ $$
     //                          |  $$$$$$/
     //                           \______/
     *********************************************************************************************/
    static #signalRConnection;  // Singleton connection variable
    static isSignalRConnectionConnected = () => {
        return !Utils.isNullOrUndefined(this.#signalRConnection) &&
            this.#signalRConnection instanceof signalR.HubConnection &&
            this.#signalRConnection.state === "Connected";
    }

    static maxSignalRErrorCount = 15;
    static #signalRErrorCount = 0;


    static canUseSignaR = () => {
        return this.#signalRErrorCount < this.maxSignalRErrorCount
    };

    static incrementSignalRErrorCount() {
        this.#signalRErrorCount++;
    }

    static resetSignalRErrorCount = () => {
        this.#signalRErrorCount = 0
    };

    static cannotConnectToSignalR = () => {
        return this.#signalRErrorCount >= this.maxSignalRErrorCount
    }

    /********************************************************************************************
     * Initialize the SignalR connection
     * define handlers for the 'ChannelChanged', 'StreamingInProgress' and 'StreamingStopped' events
     *********************************************************************************************/
    static initializeSignalRConnection = () => {
        if (this.isSignalRConnectionConnected()) {
            return this.#signalRConnection;
        }

        // If we have too many errors, don't try to connect again
        if (!this.canUseSignaR()) {
            return null;
        }

        const connection = new signalR
            .HubConnectionBuilder()
            .withUrl(Configuration.slingApiUrls.slingServerSignalRHubUrl, {withCredentials: true})
            .build();


        if (this.isSignalRConnectionConnected()) {
            this.resetSignalRErrorCount();
        }
        const success = true;
        this.RegisterSignalREventHandlers(connection, success);

        connection.start().catch((err) => {
            this.#signalRConnection = null; // Clear the connection

            this.incrementSignalRErrorCount(); // this.#signalRErrorCount++;
            if (this.cannotConnectToSignalR()) { // this.#signalRErrorCount >= this.maxSignalRErrorCount

                if (this.#signalRErrorCount === this.maxSignalRErrorCount) {
                    this.displaySignalRConnectionError();
                }

                // STOP the connection after 'n' insuccesfull attempts, 
                connection.stop().finally(() => {
                    console.log(`${TimeService.timeStamp} SignalR connection stopped after ${this.maxSignalRErrorCount} failed attempts`);
                });
            }
            console.error(`${TimeService.timeStamp} ${SlingServices.initializeSignalRConnection.name}(): ${err.toString()}`);
        });

        this.#signalRConnection = connection; // Store the connection as a singleton

        return connection;
    }

    static RegisterSignalREventHandlers(connection, success) {

        connection.on("ChannelChanged", ({slingBoxName, newChannelNumber, eventOrigin}) => {
                console.log(`${TimeService.timeStamp} received notification: ChannelChanged ${slingBoxName} ${newChannelNumber}, ${eventOrigin}`);

                this.setChannelChangedAsync(slingBoxName, newChannelNumber)
                    .then(() => {
                        HtmlServices.displayMessage("Channel changed: " + slingBoxName + " " + newChannelNumber);

                        this.displayDivChannelNumbersAsButtonsAsync().then(() => {
                            this.displayChannelButtonAsSelected(slingBoxName, newChannelNumber);
                            this.highlightSelectedChannelButton(slingBoxName, newChannelNumber, success);
                        })
                    })
                    .catch(err => console.error(`${TimeService.timeStamp} 'ChannelChanged': Error setting channel # and streaming in progress status: ${err}`));
            }
        );

        connection.on("StreamingInProgress", ({slingBoxName, eventOrigin}) => {
            console.log(`${TimeService.timeStamp} received notification: StreamingInProgress ${slingBoxName}`);

            if (eventOrigin === "server") {
                if (Configuration.debug) console.log(`${TimeService.timeStamp} StreamingInProgress. Executing setStreamingInProgressAsync()`);
                this.setStreamingStatusInProgressAsync(slingBoxName)
                    .then(() =>
                        HtmlServices.displayMessage("Streaming in progress: " + slingBoxName)
                    )
                    .then(async () => {
                            if (Configuration.debug) console.log(`${TimeService.timeStamp} StreamingInProgress. Start displaying channel numbers as buttons`);
                            await this.displayDivChannelNumbersAsButtonsAsync()
                                .then(
                                    () => {
                                        if (Configuration.debug) console.log(`${TimeService.timeStamp} StreamingInProgress. Completed displaying channel numbers as buttons`);
                                    }
                                )
                        }
                    )
                    .catch(err => console.error(`${TimeService.timeStamp} StreamingInProgress ${err}`));
            }
        });

        connection.on("StreamingStopped", ({slingBoxName, eventOrigin}) => {
            console.log(`${TimeService.timeStamp} received notification: StreamingStopped ${slingBoxName}`);

            if (eventOrigin === "server") {
                this.setStreamingStoppedAsync(slingBoxName)
                    .then(() => this.displayDivChannelNumbersAsButtonsAsync())
                    .catch(err => console.error(`${TimeService.timeStamp} StreamingStopped: slingBoxName: ${slingBoxName}, eventOrigin: ${eventOrigin}, error: ${err}`));

                HtmlServices.displayMessage("Streaming stopped: " + slingBoxName);
            }
        });

        connection.on("SlingBoxBricked", ({slingBoxName, eventOrigin}) => {
            console.log(`${TimeService.timeStamp} received notification: SlingBoxBricked ${slingBoxName} from ${eventOrigin}`);
            const msg = "SlingBox Bricked ! " + slingBoxName;
            HtmlServices.displayMessage(msg, HtmlServices.messageTypeError);
            alert(msg);
        });


        connection.on("RemoteLocked", ({slingBoxName, eventOrigin}) => {
            console.log(`${TimeService.timeStamp} received notification: RemoteLocked ${slingBoxName} from ${eventOrigin}`);
            let msg = "Remote is Locked for " + slingBoxName;
            HtmlServices.displayMessage(msg, HtmlServices.messageTypeError);

            msg = "The SlingBox" + slingBoxName + " is configured to allow ONLY ONE REMOTE control at a time. " +
                "Another user is already streaming and has control. " +
                "Please try again later or comment-out the setting 'RemoteLock=yes' in the sling server config file.";

            alert(msg);
        });

    }


    static displaySignalRConnectionError() {
        const remoteControlMsg = HtmlUtils.toUnicodeVariant('SlingBox Remote Control', 'bold sans', 'bold');
        const reasonMsg = HtmlUtils.toUnicodeVariant('Reason:', 'bold sans', 'bold');
        const resolutionMsg = HtmlUtils.toUnicodeVariant('Solution:', 'bold sans', 'bold');

        alert(`Cannot use this page as a ${remoteControlMsg}.
                    
${reasonMsg} the page could not connect to the SignalR server
${Configuration.slingApiUrls.slingServerSignalRHubUrl}
 
${resolutionMsg} refresh the page or check if the server is working and properly configured.`);

        window.location.reload(); // Refresh the page
    }

    static notifyNewChannel = (slingBoxName, newChannelNumber) => {

        if (Utils.isNullOrUndefined(newChannelNumber)) {
            return; // Use a null channel for server pings to check if the SlingBox streaming has stopped 
        }

        const connection = this.initializeSignalRConnection();
        this.restartSignalRConnection(connection);

        if (connection.state !== signalR.HubConnectionState.Connected) {
            alert(`Could not connect to the SignalR server ${Configuration.slingApiUrls.slingServerSignalRHubUrl}. Please refresh the page and try again.`);
            return;
        }

        const channelNumber = parseInt(newChannelNumber);
        connection.invoke("NotifyNewChannel", {
            slingBoxName: slingBoxName,
            newChannelNumber: channelNumber,
            eventOrigin: "tvGuide"
        })
            .catch((err) => {
                return console.error(slingBoxName + " " + channelNumber + " " + err.toString());
            });
    }

    static restartSignalRConnection = (connection) => {
        if (connection.state !== signalR.HubConnectionState.Connected ||
            connection.state === signalR.HubConnectionState.Disconnected) {

            const retryCount = 3;
            const retryDelayMs = 1000;

            for (let i = 0; i < retryCount; i++) {
                connection.start().then(() => {
                    console.log(`${TimeService.timeStamp} SignalR Connection started successfully.`);
                }).catch((err) => {
                    console.error(`${TimeService.timeStamp} retry #: ${i} ${err.toString()}`);
                })

                if (connection.state === signalR.HubConnectionState.Connected) {
                    return
                } else {
                    TimeService.waitAsync(retryDelayMs).then(() => "");
                }
            }
        }
    }


    static async setStreamingStatusInProgressAsync(slingBoxName) {
        const functionName = `${SlingServices.setStreamingStatusInProgressAsync.name}()`;
        if (Configuration.debug) console.log(`${TimeService.timeStamp} started for slingBoxName: ${slingBoxName}`);
        const streamingStatusPromise = await this.#getServerStreamingStatusAsync();
        let serverStreamingStatus = await streamingStatusPromise;

        if (Utils.isNullOrUndefined(serverStreamingStatus)) {
            console.error(`${TimeService.timeStamp} ${functionName}: Server Streaming Status (cached or fetched) is null or undefined`);
            return;
        }

        const slingBoxStreamingStatus = serverStreamingStatus['slingBoxes'][slingBoxName];
        if (Utils.isNullOrUndefined(slingBoxStreamingStatus)) {
            console.error(`${TimeService.timeStamp} ${functionName}: slingBoxStreamingStatus is null or undefined`);
            return;
        }

        if (Configuration.debug) console.log(`${TimeService.timeStamp} ${functionName} for slingBoxName: ${slingBoxName}. Current streaming status: ${slingBoxStreamingStatus.isStreaming}`);

        this.#updateSlingBoxStreamingStatusWithIsStreaming(serverStreamingStatus, slingBoxName, true);
        if (Configuration.debug) console.log(`${TimeService.timeStamp} ${functionName} set to true for slingBoxName: ${slingBoxName}.`);

        this.cachedStreamingStatus = serverStreamingStatus; // update the cache to extend the expiration time
        if (Configuration.debug) console.log(`${TimeService.timeStamp} ${functionName} stored in cache with value ${this.cachedStreamingStatus['slingBoxes'][slingBoxName].isStreaming}  for slingBoxName: ${slingBoxName}.`);
        if (Configuration.debug) console.log(`${TimeService.timeStamp} ${functionName} exit`);
    }

    static async setStreamingStoppedAsync(slingBoxName) {
        let serverStreamingStatus = await this.#getServerStreamingStatusAsync();

        if (!this.#isServerStreamingStatusValid(serverStreamingStatus, slingBoxName)) {
            console.error(`${TimeService.timeStamp} ${SlingServices.setStreamingStoppedAsync.name}(): serverStreamingStatus is not valid. SlingBox: ${slingBoxName}`);
            return;
        }

        this.#updateSlingBoxStreamingStatusWithIsStreaming(serverStreamingStatus, slingBoxName, false);
        this.cachedStreamingStatus = serverStreamingStatus; // update the cache to extend the expiration time
    }


    static async setChannelChangedAsync(slingBoxName, channelNumber) {
        let serverStreamingStatus = await this.#getServerStreamingStatusAsync();
        serverStreamingStatus = this.#updateSlingBoxStreamingStatusWithChannelNumber(serverStreamingStatus, slingBoxName, channelNumber)
        this.cachedStreamingStatus = serverStreamingStatus;
    }


    // Update the sling box channel and set streaming to true in serverStreamingStatus  
    static #updateSlingBoxStreamingStatusWithChannelNumber(serverStreamingStatus, slingBoxName, channelNumber) {
        if (!this.#isServerStreamingStatusValid(serverStreamingStatus, slingBoxName)) {
            console.error(`${TimeService.timeStamp} ${SlingServices.#updateSlingBoxStreamingStatusWithChannelNumber.name}(): serverStreamingStatus is not valid. SlingBox: ${slingBoxName}`);
            return serverStreamingStatus;
        }
        if (!Utils.isNullOrUndefined(channelNumber)) {
            serverStreamingStatus['slingBoxes'][slingBoxName].currentChannelNumber = channelNumber;
        }
        serverStreamingStatus['slingBoxes'][slingBoxName].isStreaming = true;

        return serverStreamingStatus;
    }


    static #updateSlingBoxStreamingStatusWithIsStreaming(serverStreamingStatus, slingBoxName, isStreaming) {
        if (!this.#isServerStreamingStatusValid(serverStreamingStatus, slingBoxName)) {
            return serverStreamingStatus;
        }
        serverStreamingStatus['slingBoxes'][slingBoxName].isStreaming = isStreaming;

        return serverStreamingStatus;
    }

    static #isServerStreamingStatusValid(serverStreamingStatus, slingBoxName) {
        const functionName = `${SlingServices.#isServerStreamingStatusValid.name}()`;

        if (!serverStreamingStatus) {
            console.error(`${TimeService.timeStamp} ${functionName}(): serverStreamingStatus is null or undefined`);
            return false;
        }

        if (!serverStreamingStatus['slingBoxes']) {
            console.error(`${TimeService.timeStamp} ${functionName}(): serverStreamingStatus['slingBoxes'] is null or undefined`);
            return false;
        }


        if (!serverStreamingStatus['slingBoxes'][slingBoxName]) {
            console.error(`${TimeService.timeStamp} ${functionName}(): slingBoxName ${slingBoxName} not found in streamingStatus: ${JSON.stringify(serverStreamingStatus)}`);
            return false;
        }

        return true;
    }

    static async #getSlingBoxStreamingStatus(slingBoxName) {
        let serverStreamingStatusPromise = this.#getServerStreamingStatusAsync();
        if (Utils.isNullOrUndefined(serverStreamingStatusPromise)) {
            return {isStreaming: false, currentChannelNumber: null};
        }

        const {
            isStreaming,
            currentChannelNumber
        } = await this.#readSlingBoxStatusFromServerStreamingStatus(slingBoxName, serverStreamingStatusPromise); // destructuring

        return {isStreaming, currentChannelNumber};
    }

    static async #getServerStreamingStatusAsync() {
        let serverStreamingStatus = this.cachedStreamingStatus;

        if (Utils.isNullOrUndefined(serverStreamingStatus)) {
            try {
                const serverStreamingStatusPromise = await this.fetchServerStreamingStatusAsync();
                serverStreamingStatus = await serverStreamingStatusPromise;
                if (serverStreamingStatus === null) {
                    const errMsg = "Cannot read streaming status from server";
                    HtmlServices.displayMessage(errMsg, HtmlServices.messageTypeWarning);
                }
                this.cachedStreamingStatus = serverStreamingStatus;
            } catch (error) {
                console.error('#getServerStreamingStatus(): Error: ', error);
                return null;
            }
        }

        return serverStreamingStatus;
    }

    static async #readSlingBoxStatusFromServerStreamingStatus(slingBoxName, serverStreamingStatusPromise) {
        const serverStreamingStatusAsJsonData = await serverStreamingStatusPromise;

        if (Utils.isNullOrUndefined(slingBoxName) || Utils.isNullOrUndefined(serverStreamingStatusAsJsonData)) {
            return {isStreaming: false, currentChannelNumber: null};
        }

        const slingBoxes = serverStreamingStatusAsJsonData['slingBoxes'];

        if (slingBoxes && slingBoxName in slingBoxes) {
            const slingBoxData = slingBoxes[slingBoxName];
            const currentChannelNumber = slingBoxData.currentChannelNumber;
            const isStreaming = slingBoxData.isStreaming;

            return {isStreaming, currentChannelNumber};
        } else {
            return {isStreaming: false, currentChannelNumber: null}; // SlingBox not found
        }
    }


    // Example of Server Streaming Status JSON data:
    // {
    //    "slingBoxes": {
    //        "sbRomania": {
    //            "currentChannelNumber": 15,
    //            "isStreaming": true
    //        },
    //        "sbCanada": {
    //            "currentChannelNumber": 0,
    //            "isStreaming": false
    //        }
    //    }
    // }
    static async fetchServerStreamingStatusAsync() {

        const queryParams = Configuration.slingBoxesNames
            .map(item => `slingBoxName=${encodeURIComponent(item)}`)
            .join('&');

        let url = `${Configuration.slingApiUrls.slingServerStreamingStatusUrl}?${queryParams}`;
        url = HtmlUtils.appendTimeStampToUrl(url);

        const responsePromise = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if (!responsePromise.ok) {
            throw new Error(`HTTP error! Status: ${responsePromise.status}`);
        }

        const serverStreamingStatus = await responsePromise.json();
        if (Configuration.debug) console.log(`${TimeService.timeStamp} ` + "fetchServerStreamingStatusAsync(): " + JSON.stringify(serverStreamingStatus));

        return serverStreamingStatus;
    }


    /*********************************************************************************************

     /$$$$$$                                        /$$
     /$$__  $$                                      | $$
     | $$  \__/        /$$$$$$         /$$$$$$$      | $$$$$$$         /$$$$$$
     | $$             |____  $$       /$$_____/      | $$__  $$       /$$__  $$
     | $$              /$$$$$$$      | $$            | $$  \ $$      | $$$$$$$$
     | $$    $$       /$$__  $$      | $$            | $$  | $$      | $$_____/
     |  $$$$$$/      |  $$$$$$$      |  $$$$$$$      | $$  | $$      |  $$$$$$$
     \______/        \_______/       \_______/      |__/  |__/       \_______/
     *********************************************************************************************/

    // Last Channel cache
    static setLastSelectedChannelToCache(slingBoxName, channelNumber) {

        if (Utils.isNullOrUndefined(channelNumber)) {
            if (Configuration.debug) console.log(`setLastSelectedChannelToCache(): channelNumber is null or undefined, ignoring the request. ${slingBoxName}`);
            return;
        }

        // estimated duration of the echoed SignalR notifications due to a change channel event:
        const expirationTimeMs = Configuration.slingCacheSettings.slingChannelChangeExpirationTimeMs;

        const cache_key = `ChangeChannel_${slingBoxName}`;
        this.#cache.set(cache_key, channelNumber, expirationTimeMs);
    }

    static getLastSelectedChannelFromCache(slingBoxName) {
        const cache_key = `ChangeChannel_${slingBoxName}`
        return this.#cache.get(cache_key);
    }


    // Streaming Status cache
    static streamingStatusCache_key = "slingsStatus_Key";

    static get cachedStreamingStatus() {
        const serializedSlingBoxesStatus = this.#cache.get(this.streamingStatusCache_key);
        if (Utils.isNullOrUndefined(serializedSlingBoxesStatus)) {
            return null;
        }
        const jsonObject = JSON.parse(serializedSlingBoxesStatus);
        return jsonObject;
    }

    static set cachedStreamingStatus(jsonData) {
        const serializedSlingBoxesStatus = JSON.stringify(jsonData);
        if (serializedSlingBoxesStatus.toString().indexOf("slingBoxes") < 0) {
            const errMsg = "'set cachedStreamingStatus():' invalid streamig status json data: " + serializedSlingBoxesStatus
            //alert(errMsg);
            console.error(errMsg);
        }

        // Bug: the callBack function never calles when cache expires
        const expirationTimeMs = Configuration.slingCacheSettings.slingStatusExpirationTimeMs;
        this.#cache.set(
            this.streamingStatusCache_key,
            serializedSlingBoxesStatus,
            expirationTimeMs,
            null, //setInterval(SlingServices.checkCanDisableChannelButtons, Configuration.webPageRefreshRates.checkCanDisableChannelButtonsTimeOutMs), // call back function to trigger upon expiration
            null);
    }


    // Hack
    static maxResetCounter = 10;
    static resetDisplayButtonCounter = this.maxResetCounter;

    // **[HACK]*********************************************************
    // Check if the web page should disable the channel buttons when a slingBox is no longer streaming.
    // *****************************************************************
    // Details:
    //  - Gerry's server displays a notification when streaming has stopped, but for now, the wrapper cannot detect it, 
    //  probably because it is not follwed by a new line character.
    //  - Therefore, the wrapper indicates that the streaming stopped after ~ 100 seconds of server's inactivity
    // for that slingBox (default behaviour, based on the frequency the server notifies that streaming is ongoing).
    // So, the UI will disable the buttons after 1.5 minutes of a slingBox inactivity, which is NOT a reasonable time.
    // *****************************************************************
    // This function is a Hack to workaround to reset the buttons when there are no slingboxes connected
    // *****************************************************************
    static checkCanDisableChannelButtonsHack() {
        if (Configuration.debug) console.log(`${TimeService.timeStamp} checkCanDisableChannelNumbersButtons() - Hack to detect if the server stopped streaming`);

        const slingBoxesNames = SlingServices.#getAllSlingBoxesNamesWithDisplayedButtons();
        if (slingBoxesNames.length === 0) {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} checkCanDisableChannelNumbersButtons() - No slingboxes displayed with buttons. Returning...`);
            return;
        }

        if (!SlingServices.isSignalRConnectionConnected()) {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} checkCanDisableChannelNumbersButtons() - No SignalR active connection. Returning...`);
            return;
        }

        if (Utils.isNullOrUndefined(this.cachedStreamingStatus) && SlingServices.resetDisplayButtonCounter > 0) {
            if (Configuration.debug) console.log(`${TimeService.timeStamp} Cache is empty, calling #getServerStreamingStatus to refresh it`);

            SlingServices.#getServerStreamingStatusAsync()
                .then(() => SlingServices.sendNullChangeChannelRequests())
                .catch((error) => {
                    console.log("displayDivChannelNumbersAsButtonsAsync() failed " + error);
                });

            SlingServices.resetDisplayButtonCounter--;
        } else {
            SlingServices.resetDisplayButtonCounter = SlingServices.maxResetCounter;
        }

        if (Configuration.debug) console.log(`${TimeService.timeStamp} checkCanDisableChannelNumbersButtons() - completed`);
    }

    static sendNullChangeChannelRequests() {
        Configuration.slingBoxesNames.forEach(slingBoxName => {
            const serverStreamingStatus = this.cachedStreamingStatus;
            if (Utils.isNullOrUndefined(serverStreamingStatus)) {
                console.error(`${TimeService.timeStamp} sendNullChangeChannelRequests(): Could not read server streaming status from cache`);
                return;
            }

            const slingBoxData = serverStreamingStatus['slingBoxes'][slingBoxName];
            const isStreaming = slingBoxData.isStreaming;

            const hasButtons = this.#isSlingBoxDisplayedWithButtons(slingBoxName);

            if (hasButtons || isStreaming) {
                this.sendChangeChannelRequestToServer("", slingBoxName);
            }
        });
    }

    static #getAllSlingBoxesNamesWithDisplayedButtons() {
        let slingBoxesNames = [];
        Configuration.slingBoxesNames.forEach(slingBoxName => {
            const hasButtons = this.#isSlingBoxDisplayedWithButtons(slingBoxName);
            if (hasButtons) {
                slingBoxesNames.push(slingBoxName);
            }
        });

        return slingBoxesNames;
    }
}