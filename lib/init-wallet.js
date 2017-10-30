// NOTE: The rpc command setaccount has a "bug" that creates an unlabeled address after executing.
//       See: GetAccountAddress(strOldAccount, true) in rpcwallet.cpp.
//       You have to go into the Qt wallet to label it if you really want it.
//		 So, at every startup, we sweep the wallet for new "" accounts to assign to MASTER_ACCOUNT
var atob = require('atob');
var btoa = require('btoa');

var coin = require('./coinapi');
var User = require('./user');
var QR = require('qr-image');

function BuildQrCodes(addresses) {
	var images = 'public/ico/qrcodes/';
	// Loop through ETH/BTC addresses and build QR images
	if (typeof addresses === 'object') {
		for (var k in addresses) {
			if (addresses.hasOwnProperty(k)) {
				var qr = QR.image(addresses[k], { type: 'png' });
				qr.pipe(require('fs').createWriteStream(images + addresses[k] + '.png'));
			}
		}
	} else {
		if (addresses && addresses !== "") {
			var qr = QR.image(addresses, { type: 'png' });
			qr.pipe(require('fs').createWriteStream(images + addresses + '.png'));
		}
	}
}

function Init() {
	// Build QR Codes
	BuildQrCodes(coin.settings.icoEthAddress);
	BuildQrCodes(coin.settings.icoBtcAddresses);
	
	// Find existing node_id for masterAccount.
	User.findOne({'local.id': coin.settings.masterAccount, 'wallet.node_id': coin.settings.wallet.rpchost}, function(err, user) {
		if (user) {
			console.log("Init-Wallet: Found " + coin.settings.masterAccount + "'s wallet for the " + coin.settings.coinName + " node_id on: " + coin.settings.wallet.rpchost);
		} else {
			console.log("Init-Wallet: " + coin.settings.masterAccount + "'s wallet was NOT found for node_id: " + coin.settings.wallet.rpchost);
			User.findOne({'local.id': coin.settings.masterAccount}, function(err, user) {
				if (err)
					return err;
				if (user) {
					console.log("Init-Wallet: Creating a new wallet for " + coin.settings.masterAccount + " for node_id: " + coin.settings.wallet.rpchost);
					// Push the new wallet to user.
					user.wallet.push( { node_id: coin.settings.wallet.rpchost, account: coin.settings.masterAccount, addresses: coin.settings.icoEthAddress });
					user.save(function(err) {
						if (err)
							throw err;
					});
				} else {
					// Create the masterAccount.
					console.log("Init-Wallet: Creating a new account for " + coin.settings.masterAccount + " for node_id: " + coin.settings.wallet.rpchost);

					// Create the masterAccount
					var newUser = new User();
					newUser.local.id = coin.settings.masterAccount;
					newUser.local.password = newUser.generateHash(coin.settings.masterPassword);
					newUser.local.changeme = false;
					newUser.profile.verified = "Y";
					newUser.profile.login_type = "local";
					newUser.profile.last_login = Date.now();
					newUser.profile.role = "Admin";
					newUser.profile.first_name = "";
					newUser.profile.last_name = "";
					newUser.profile.email = coin.settings.masterEmail;
					newUser.profile.ethaddress = coin.settings.ethAddress;
					newUser.profile.btcaddress = "";
					newUser.profile.age = "";
					newUser.profile.dob = "";
					newUser.profile.country = "";
					newUser.profile.terms = false;
					newUser.profile.credit = 0;
					newUser.wallet.push( { node_id: coin.settings.wallet.rpchost, account: coin.settings.masterAccount, addresses: accountAddresses });

					newUser.save(function(err) {
						if (err)
							throw err;
					});
				}
			});
		}
	});
}

module.exports = function() {
    Init();
};
