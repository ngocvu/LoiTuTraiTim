// JavaScript source code
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const newUsers = [];

const token = 'NjA4MTk2Nzc4NjEyNzUyMzk1.XUkvkQ.l2998Alja9jwZGBjWJvo_rmuwoE';

bot.on('ready', () =>{
	console.log('Bot online');
})

bot.on("guildMemberAdd", (member,message) => {
  let memberid = member.user.id;
  member.guild.channels.get('608132630298230842').send("Chào <@"+  memberid +"> , Chào b?n d?n v?i server L?i T? Trái Tim, b?n nên vào #rules-:warning:  d? d?c lu?t tru?c khi vui choi vào c?ng d?ng này ^^. Xong r?i vào #:two_hearts:-l?i-t?-trái-tim-:two_hearts:  d? trò chuy?n nhé.")
}); 

bot.on('message', msg=>{
	if (msg.content === 'boh ping' || msg.content === 'bohping') {
		msg.channel.send('Pong! :ballot_box_with_check:')
	}
})

bot.login(token);