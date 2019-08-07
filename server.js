// JavaScript source code
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const newUsers = [];

let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));

const token = 'NjA4MTk2Nzc4NjEyNzUyMzk1.XUkvkQ.l2998Alja9jwZGBjWJvo_rmuwoE';

bot.on('ready', () =>{
	console.log('Bot online');
})

bot.on("guildMemberAdd", (member,message) => {
  let memberid = member.user.id;
  member.guild.channels.get('608132630298230842').send("Chào <@"+  memberid +"> , Chào mừng bạn đến với server Lời Từ Trái Tim, bạn nên vào nên vào <#602452372412825620>-:warning:  để đọc luật trước khi vui chơi vào cộng đồng này ^^. Xong rơi vào <#603591426751725568>  để trò chuyện nhé.")
}); 

bot.on('message', message=>{
	let sender = message.author;
	let msg = message.content.toUpperCase();
	
	if (bot.user.id === message.author.id) { return }
	
	if (msg.content === 'boh ping' || msg.content === 'bohping') {
		msg.channel.send('Pong! :ballot_box_with_check:')
	}
	
	if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
	if (!userData[sender.id | message.guild.id].money) userData[sender.id | message.guild.id].money = 1000;
	
	fs.writeFile('userData.json',JSON.stringify(userData), (user) => {
		if (err) console.error(err);
	})
	
	if (msg.content === 'bohmoney' || msg.content === 'boh money'){
		let value= userData[sender.id + message.guild.id].money;
		message.channel.send('Bạn đang giữ '+ value +' boh'); 
	}
})

bot.on('ready', () => {
	console.log('Khởi chạy tiền tệ...');	
})

bot.login(token);
