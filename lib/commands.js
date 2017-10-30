var commands = module.exports.commands = [
 'getBalance',
 'getInfo',
 'help',
 // non-rpc commands
 'getNodeInfo',
 'getUserAccount',
 'saveUserProfile',
 'saveUserWallet'
];

module.exports.isCommand = function(command){
    command = command.toLowerCase();
    for (var i=0, len=commands.length; i<len; i++){
        if (commands[i].toLowerCase() === command){
            return true;
        }
    }
};
