// JavaScript source code
const Discord = require('discord.js');
const eco = require("./discordeco.js");
const bot = new Discord.Client();

const newUsers = [];

let userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));

const token = 'NjA4MTk2Nzc4NjEyNzUyMzk1.XUkvkQ.l2998Alja9jwZGBjWJvo_rmuwoE';

bot.on('ready', () =>{
	console.log('Bot online');
})

bot.on("guildMemberAdd", (member,message) => {
  let memberid = member.user.id;
  member.guild.channels.get('602453889459027999').send("Chào <@"+  memberid +"> , Chào mừng bạn đến với server Lời Từ Trái Tim, bạn nên vào nên vào <#602452372412825620>-:warning:  để đọc luật trước khi vui chơi vào cộng đồng này ^^. Xong rơi vào <#603591426751725568>  để trò chuyện nhé.")
}); 

bot.on('message', message=>{
	let sender = message.author;
	let msg = message.content.toUpperCase();
	
	if (bot.user.id === message.author.id) { return }
	
	if (msg.content === 'boh ping' || msg.content === 'bohping') {
		msg.channel.send('Pong! :ballot_box_with_check:')
	}
	
	
	fs.writeFile('userData.json',JSON.stringify(userData), (user) => {
		if (err) console.error(err);
	})
	
	if (msg.content === 'bohmoney' || msg.content === 'boh money'){
		var output = await eco.FetchBalance(message.author.id)
    		message.channel.send(`${message.author.tag} đang sở hữu ${output.balance} boh.`);
	}
	
	  if (command === 'daily') {
 
    		var output = await eco.Daily(message.author.id)
 
    		if (output.updated) {
 
      		var profile = await eco.AddToBalance(message.author.id, 1000)
      		message.reply(`Bạn đã nhận daily thành công! Bây giờ, bạn đang có ${profile.newbalance} boh.`);
 
    		} else {
      		message.channel.send(`Xin lỗi, bạn đã nhận daily rồi\nNhưng đừng lo lắng, sau ${output.timetowait} bạn có thể nhận daily!`)
    		}
 
  		}
	  if (command === 'leaderboard') {
 
    
    if (message.mentions.users.first()) {
 
      var output = await eco.Leaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`Người chơi ${message.mentions.users.first().tag} nằm ở vị thứ ${output} trên bảng danh vọng!`);
 
    } else {
 
      eco.Leaderboard({
        limit: 3, //Only takes top 3 ( Totally Optional )
        filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
      }).then(async users => { //make sure it is async
 
        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
 
        message.channel.send(`My leaderboard:
 
1 - ${firstplace && firstplace.tag || 'Chưa có ai'} : ${users[0] && users[0].balance || 'None'}
2 - ${secondplace && secondplace.tag || 'Chưa có ai'} : ${users[1] && users[1].balance || 'None'}
3 - ${thirdplace && thirdplace.tag || 'Chưa có ai'} : ${users[2] && users[2].balance || 'None'}`)
 
      })
 
    }
  }
})


bot.login(token);
