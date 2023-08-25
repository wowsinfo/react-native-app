/**
 * This file contains all the global data that is used throughout the app
 */
class AppGlobalData {
    // We store saved and local data as a single object
    static DATA: object = {};
    
    // Theme
    static LIGHT: object = {};
    static DARK: object = {};
    static DARKMODE: boolean = false;

    // App Settings
    static SWAPBUTTON: boolean = false;
    static NOIMAGEMODE: boolean = false;
    static CLEANMODE: boolean = false;

    // You can only check one time
    static CANCHECKFORUPDATE: boolean = true;
    // Only update api once as well
    static CANUPDATEAPI: boolean = true;

    // Trace how many battles
    static RSBATTLE: number = 0;

    // Trace last known location
    static LASTLOCATION: string = '';

    static GITHUB_VERSION: boolean = false;
}