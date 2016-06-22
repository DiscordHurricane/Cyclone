var Discord = require("discord.js");
var http = require("http");
var url = require("url");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var bot = new Discord.Client();

function searchForSwearWords(msg){
  var request = new XMLHttpRequest();
  request.open('POST', 'http://api.inversoft.com:8211/content/item/filter');
  request.setRequestHeader('Authorization', process.env.cleanspeak);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status <= 299) {
        var response = JSON.parse(request.responseText);
        if(response.matches){
          bot.reply(msg, "Do not use profane language! Please send your message again in #nsfw.");
          bot.deleteMessage(msg);
        }
      }
    }
  };
  var data = {
    "content": msg.content,
    "emails":{
      "disabled": true
    },
    "phoneNumbers":{
      "disabled": true
    },
    "urls":{
  	  "disabled": true
    },
    "blacklist":{
      "tags": [
    	"Bigotry-Racism",
        "Grooming",
        "Harm-Abuse",
        "Sexual",
        "Spam",
        "Threats",
        "Vulgarity"
      ],
      "minimumSeverity": "medium"
    }
  };
  request.send(JSON.stringify(data));
}


bot.on("message", function(msg) {
    var apex  = msg.server.roles.get("name", "APEX")
    var alpha = msg.server.roles.get("name", "ALPHA");
    if(msg.channel.name == "nsfw" || msg.channel.name == "staff-chat" || msg.author.hasRole(apex) || msg.author.hasRole(alpha)){
    }else{
        searchForSwearWords(msg);
    }
    
});


bot.loginWithToken(process.env.token);