/**
* The Settings Module reads the settings out of settings.json and provides
* this information to other modules. No need to modify anything here.
*
* See: settings.json.template
*/

var fs = require("fs");
var moment = require("moment");
var jsonminify = require("jsonminify");

// NOTE: rpcuser/pass/host/port is pulled from the coin's config file.

// Version
exports.version = "2.1.0";

// Runtime environment: 'development' or 'production'
exports.env = "development";

// The url hosting the app. e.g. example.com (!!! Must match browser URI to satisfy CORS !!!)
exports.appHost = "localhost";

// The app title, visible in browser window
exports.appTitle = "Generic ICO";

// The app slogan
exports.appSlogan = "A Generic ICO Website!";

// The app description
exports.appDescription = "A short description of the Generic ICO goes here.";

// The copyright for the footer
exports.copyRight = "Copyright (c) " + moment().utc().format("YYYY") + ", The " + this.appTitle + " developers. All rights reserved.";

// Logo
exports.logo = "/images/Logo.png";

// Icon
exports.icon = "/images/Icon.png";

// The app favicon fully specified url, visible e.g. in the browser window
exports.favicon = "./public/ico/favicon.ico";

// ICO start / stop / round durations
// Update countdown.js with these timestamps, too.
exports.icoStart = "Oct 23, 2017 10:00:00";
exports.icoStop = "Nov 20, 2017 10:00:00";
exports.icoRoundDurations = [6,24,48,48,48,48,48,48,48,48,48,48]; // hours for each round

// BTC public send to addresses (one per round)
exports.icoBtcAddresses = ["","","","","","","","","","","",""];

// Ethereum public contract addresses
exports.icoEthAddress = "";

// Coin name / page heading
exports.coinName = "GenericToken";

// Coin symbol, e.g. BTC, VRC, POST, ...
exports.coinSymbol = "GEN";

// Coin addresses start with this character
exports.coinChar = "G";

// How many decimale places to display for coin fractions
exports.decimalPlaces = 18;

// Coin has transaction txcomment feature
exports.txComment = false;

// chRoot allows you to put the app in a "subfolder" of an existing website,
// then use mod_proxy (or equivolent) to proxy requests for /ico to the node.
// e.g. ProxyPass /ico/ https://192.168.1.246:8383/ico/ KeepAlive=On
//      ProxyPassReverse /ico/ https://192.168.1.246:8383/ico/
// If your website is Wordpress, you will need to change the .htaccess rule to:
//      # ORIGINAL RewriteRule . /index.php [L]
//      RewriteRule ./ /index.php [L]
// Set to "" to allow the sub-folder 'ico' to be exposed for proxying.
// Set to "/ico" to chroot the node to /public/ico/ (Normal for stand-alone ICO site).
exports.chRoot = "/ico";

// Show stats in navigation
exports.showStats = true;

// History rows per page
exports.historyRowsPP = 10;

// Minimum transaction fee
exports.minTxFee = 0.0001;

// Amount to send new users at sign-up
exports.newUserAmount  = 1.0;

// Some control over how much can be sent at one time
exports.maxSendAmount  = 1000.0;                      

// Run nodejs as ssl server or not
exports.ssl = false;

// The ports express should listen on
exports.port = process.env.PORT || 8181;
exports.sslPort = process.env.SSLPORT || 8383;

// SSL certs
exports.sslKey = "./sslcert/server.key";
exports.sslCrt = "./sslcert/server.crt";

// This setting is passed to MongoDB. See README.md for setting up the database.
exports.mdb = {
  "user": "admin",
  "password": "password",
  "database": "database",
  "host" : "127.0.0.1",
  "port" : 27017
};

// This setting is used to make RPC calls to the wallet daemon.
exports.wallet = {
    "rpcuser": "rpcuser",
    "rpcpassword": "rpcpassword",
    "rpchost": "127.0.0.1",
    "rpcport": 19184,
    "ssl": false,
    "rejectUnauthorized": false,
    "strictSSL": false
};
  
// Email address to send through mail service.
exports.appEmail = "info@example.com";

// MASTER_ACCOUNT will become an address label in the wallet.
exports.masterAccount    = "MASTER_ACCOUNT";        // Master login account, and Label to assign to "" wallet accounts.
exports.masterEmail      = "webmaster@example.com";  // Master email account.
exports.masterPassword   = "SecretPassword";        // Master email/account password.
exports.masterCanEncrypt = true;                    // Allow wallet encryption by MASTER_ACCOUNT

// Secret used for keyring and cookies
exports.supersecret = "super secret pass phrase";

// Storage temp for uploads
exports.storageTemp = "/tmp/";

// Google reCaptcha private/public keys
exports.reCaptchaSecret = "";
exports.reCaptchaKey = "";


// Load the settings
exports.loadSettings = function loadSettings() {
    // Discover where the settings file lives
    var settingsFilename = "./settings.json";

    var settingsStr;
    try {
        settingsStr = fs.readFileSync(settingsFilename).toString();
    } catch(e) {
        console.warn('No settings.json file found. Continuing using defaults!');
    }

    // Parse the settings
    var settings;
    try {
        if (settingsStr) {
            settingsStr = jsonminify(settingsStr).replace(",]","]").replace(",}","}");
            settings = JSON.parse(settingsStr);
        }
    } catch(e) {
        console.error('There was an error processing your settings.json file: '+e.message);
        process.exit(1);
    }

    // Loop trough the settings
    for (var i in settings) {
        if (i) {
            // Test if the setting start with a low character
            if (i.charAt(0).search("[a-z]") !== 0) {
                console.warn("Settings should start with a low character: '" + i + "'");
            }
            // We know this setting, so overwrite the exported value
            if(exports[i] !== undefined) {
                // Normalize on localhost (prevent cookie confusion)
                if (settings[i] === "127.0.0.1")
                    settings[i] = "localhost";
                exports[i] = settings[i];
            } else {
                console.warn("Unknown Setting: '" + i + "'. This setting doesn't exist or it was removed.");
            }
        }
    }
};

// Initial load settings
exports.loadSettings();
