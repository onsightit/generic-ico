define(['knockout',
    'web3',
    'viewmodels/common/command'], function(ko, web3, Command){
    var homeType = function (options) {
        var self = this;
        self.wallet = options.parent || {};
        self.ready = ko.observable(false);

        self.statusMessage = ko.observable("");

        self.emailVerified = ko.observable(false);
        self.profileComplete = ko.observable(false);
        self.role = ko.observable("");
        self.first_name = ko.observable("");
        self.last_name = ko.observable("");

        self.icoStart = ko.observable("");
        self.icoStop = ko.observable("");
        self.ethaddress = ko.observable("");
        self.btcaddress = ko.observable("");
        self.ethQrCode = ko.observable("");
        self.btcQrCode = ko.observable("");
        
        self.tokens = ko.observable("0");
        self.totalTokens = ko.observable("400000000");
        self.tokenProgress = ko.pureComputed(function(){
            var progress = 100 * self.tokens() / self.totalTokens();
            if (progress < 25) {
                // Start at 25% so text is visible
                progress = 25;
            }
            return progress + '%';
        }).extend({ rateLimit: 500 });
    };

    homeType.prototype.refresh = function(timerRefresh) {
        var self = this;
        if (self.wallet) {
            if (!self.wallet.emailVerified()) {
                window.location = self.wallet.settings().chRoot + '/verify';
            }
            if (!self.wallet.profileComplete()) {
                if (!(self.wallet.currentView() === 'terms' || self.wallet.currentView() === 'faq')) {
                    window.location = self.wallet.settings().chRoot + '/#profile';
                }
            }
            self.first_name(self.wallet.User().profile.first_name || "Investor");

            if (self.wallet.settings().icoStart && self.wallet.settings().icoStop && self.wallet.settings().icoRoundDurations) {
                self.icoStart(new Date(self.wallet.settings().icoStart).getTime());
                self.icoStop(new Date(self.wallet.settings().icoStop).getTime());
                var now = new Date().getTime();
                var start = self.icoStart();
                var stop = self.icoStop();
                var distance = Math.round(Math.abs((start - now) / 1000)); // Difference in seconds
                var durations = (typeof self.wallet.settings().icoRoundDurations === 'object' ? self.wallet.settings().icoRoundDurations : [6,24,48]);
                var round = 0;

                // If countdown is expired, page is no longer ready.
                // DEBUG: Set start to zero to test
                //if (now < 0 || now > stop) {
                if (now < start || now > stop) {
                    self.ready(false);
                    if (now > stop) {
                        self.statusMessage(self.wallet.settings().appTitle + " has EXPIRED.");
                    } else {
                        self.statusMessage(self.wallet.settings().appTitle + " addresses will appear here when the ICO is live.");
                    }
                    self.ethaddress("");
                    self.btcaddress("");
                } else {
                    // Calculate round durations and which round 'now' is in.
                    var dur = 0;
                    for (var d = 0; d < durations.length; d++) {
                        //console.log("DEBUG: durations[d]=" + durations[d] + " distance=" + distance + " dur=" + dur);
                        if (distance > dur) {
                            round = d;
                            if (!isNaN(durations[d])) {
                                dur = dur + (durations[d] * 60 * 60); // convert hours to seconds and add to previous duration
                            } else {
                                dur = dur + (48 * 60 * 60); // default to 48 hours if not numeric
                            }
                        }
                    }
                    self.ethaddress(self.wallet.settings().icoEthAddress || "");
                    self.btcaddress(self.wallet.settings().icoBtcAddresses[round] || "");
                    // These images are pre-built in init-wallet.
                    self.ethQrCode(self.wallet.settings().chRoot + "/qrcodes/" + self.ethaddress() + ".png");
                    self.btcQrCode(self.wallet.settings().chRoot + "/qrcodes/" + self.btcaddress() + ".png");

                    self.statusMessage(self.wallet.settings().appTitle + " Round " + (round + 1) + " is in progress.");
                }
            }
            self.ready(true);

            // TODO: Use web3 to query ethereum blockchain
            // Update token count

            // Check token count against total requested
            if (self.tokens() >= self.totalTokens()) {
                // Shut down the page
                self.ready(false);
                self.statusMessage(self.wallet.settings().appTitle + " has met or exceeded its goal!");
            }
        }
    };

    return homeType;
});
