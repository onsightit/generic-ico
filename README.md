# Generic-ICO ICO
![Generic-ICO, LLC](https://github.com/onsightit/generic-ico/blob/master/public/ico/images/ico.png)


Application for Generic-ICO


## Prerequisites:

A running RPC coin daemon. See: https://github.com/onsightit/SolarCoin

Mongo DB for storing account info. See: https://www.mongodb.com/

 Create DB and user:
 > use database-name
 > db.createUser( { user: "{user}", pwd: "{password}", roles: [ { role: "readWrite" } ] } )

Node.js 6.x for running Generic-ICO. For debian installations:

 If running 4.x:
 > sudo apt-get purge nodejs npm

 Install 6.x:
 > curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
 > sudo apt-get install -y nodejs
 > npm install

If Generic-ICO is not running locally, https is the default protocol.  To set up a self-signed SSL certificate in debian/apache2 environments, run:

 > sudo mkdir /etc/apache2/certs
 > sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/certs/{domain name}.key -out /etc/apache2/certs/{domain name}.crt

 Note: Also copy the crt and key file to the {nodejs}/sslcert directory. Change the owner to that of the nodejs process, then make sure your settings.json SSL parameters have the correct file-names for your key and crt files.


## Configuring:

Configure the database connection parameters, localizations and features of Generic-ICO by copying 'settings.json.template' to 'settings.json' and making your changes in 'settings.json'.

If you need to run Generic-ICO app from a "sub directory" of the main web-site (e.g. https://example.com/ico/), change the settings.json parameter, chRoot to: "".


## Running:

Windows:

 > ico.bat

 (If supervisor is not installed, run 'npm install supervisor'.)

Linux:

 > ico.sh

 (If 'daemon' is not installed, please consult your Linux distro's documentation for installing 'daemon'.)

## License

GNU V3 (See LICENSE file.)
