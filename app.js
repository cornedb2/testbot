// Calling the package
var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs')

var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var commandsList = (fs.readFileSync('Storage/commands.txt', 'utf8'));

// Functions
function userInfo(user) {
    var finalString = '';

    // name
    finalString += '**' + user.username + '**, with the **ID** of **' + user.id + '**';

    // createdate
    var userCreated = user.createdAt.toString().split(' ');
    finalString += ', was **created on ' + userCreated[1] + ', ' + userCreated[2] + ' ' + userCreated[3] + ',**'

    // Berichten verzonden
    finalString += ' Since then, they have **sent ' + userData[user.id].messageSent + ' messages** to this discord.'
    return finalString;
}

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

//Wanneer de bot joined
bot.on("guildCreate", guild => {
	guild.createRole({
		name: "BotStaff",
		color: generateHex(),
		permissions: []
	});
});

// Runt de code als de bot gestart is
bot.on('message', message => {

    // Variables
    var msg = message.content.toUpperCase(); // Takes the message, and makes it all uppercase
    var prefix = '>' //The text before commands
    var sender = message.author

    // Bekijkt of het de bot is die de bericht verstuurd
    //if (sender.id === '430261584233758720') {
    //  return;
    //}

    // Ping / pong Commands
    if (msg === prefix + 'PING'){
      message.channel.send('Pong!') //Sends a message to the channel, with the contents "Pong!"
    }

    // Help command
    if (msg === prefix + 'HELP' || msg === prefix + 'COMMANDS'){
        message.channel.send(commandsList)
    }

    // Deleting Specific Message ( Messages that are not an ID for me)
    if (message.channel.id === '430269042033426432'){ // Bekijkt of het beericht een specifiek kanaal is
      if (isNaN(message.content)) { // Bekijkt of het bericht een nummer is
        message.delete() // Bericht wordt verwijderd
        message.author.send('**Hey!** Hier mag je alleen nummers versturen en GEEN tekst! Alvast bedankt.') // De author krijgt een DM met de tekst
      }
    }

    if (msg.startsWith(prefix + "USERINFO")){
        if (msg === prefix + "USERINFO"){
            message.channel.send(userInfo(sender));
        }
    }

    if (!userData[sender.id]) userData[sender.id] = {
      messageSent: 0
    }

    //Increase messageSent to the final file
    userData[sender.id].messageSent++

    //Save the file
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err); //Maakt een log als er een error is
    });

});

//Listener Event: User Joining the discord server
bot.on('guildMemberAdd', member => {
    console.log('User ' + member.user.username + ' has joined the server!') //Sends a message to the console that a player joined the discord

    // Search for the role
    var role = member.guild.roles.find('name', 'User')

    // Add the role to a player
    member.addRole(role)

    //Send a message when a player joines the server
    member.guild.channels.get('430286732240617472').send('**' + member.user.username + '** has joined the server!')
});

//Listener Event: User leaving the discord server
bot.on('guildMemberRemove', member => {
    console.log('User ' + member.user.username + ' has left the server!')
    member.guild.channels.get('430286732240617472').send('**' + member.user.username + '** has left the server!')
});

// Listener Event: Bot Launched
bot.on('ready', () => {
    console.log('Bot Launched...') // Runs when the bot is launched!

    // Set bot settings 'game playing', 'status' and 'streaming'

    //status
    bot.user.setStatus('online')

    //game
    bot.user.setActivity('met Flech')

});

//login
bot.login('process.env.BOT_TOKEN') //Bot Token moet hier!
