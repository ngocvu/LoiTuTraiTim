// JavaScript source code
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment');

const modRole = 'Admin';

let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
const token = 'NjA4MzQyMjcxMzgwNjg0ODUx.XUqPmQ.is01svZDognuUshZlGIxoxagFBI';

bot.on('ready', () =>{
	console.log('Bot online');
	bot.user.setActivity("nhịp tim", { type: "WATCHING"});
})

bot.on("guildMemberAdd", (member,message) => {
  let memberid = member.user.id;
  member.guild.channels.get('602453889459027999').send("Chào <@"+  memberid +"> , Chào mừng bạn đến với server Lời Từ Trái Tim, bạn nên vào nên vào <#602452372412825620>-:warning:  để đọc luật trước khi vui chơi vào cộng đồng này ^^. Xong rơi vào <#603591426751725568>  để trò chuyện nhé.")
}); 

bot.on('message', message=>{
	
	let sender = message.author;
	let msg = message.content.toUpperCase();
	let msgowo = message.content.toUpperCase(408785106942164992);
	let prefix = 'BOH'

	let owo = 'OWO'

	let cont = message.content.slice(prefix.length).split(" ");
	let args = cont.slice(1);

	let cont1 = message.content.slice(owo.length).split(" ");
	let args1 = cont.slice(1);

	fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
		if (err) console.log(err)
	});

	if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
	if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 0;
	if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = "Chưa được nhận lì xì";
	if (!userData[sender.id + message.guild.id].LanLX) userData[sender.id + message.guild.id].LanLX = 0;
	fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
		if (err) console.error(err);
	})
	
	if (msg === `${prefix}PING` || msg === `${prefix} PING`) {
		message.channel.send('Pong! :ballot_box_with_check:')
	}
	if (msg === "BOH HELP" || msg === "BOHHELP"){
		message.channel.send("```Dùng lệnh **BOH MONEY** để check số tiền BoH hiện có``````Dùng lệnh **BOH LIXI** để nhận lì xì từ __BAN QUẢN TRỊ__``````Dùng lệnh **BOHHEARTFLIP <số tiền đặt cược>** để thử thách nhân phẩm``````Dùng lệnh **BOHBAUCUA <bau/cua/tom/ca/nai/ga> <số tiền đặt cược>** để chơi bầu cua```");
	}
	
	if (msg === `${prefix}LIXI` || msg === `${prefix} LIXI` || msg === `${prefix}LX` || msg === `${prefix}LIXI`) {
		var k = Math.floor(Math.random() * 10000);
		var radmin = ["CỪU","ANH VŨ", "STACY", "MERLIN", "LY", "MÈO CHỦ TỊT", "LION VIOLET", "SOC_SECURITY", "GRIEZMANN", "CHỊ HỒNG ANH", "CƠM", "CUA", "[M]ÈO | THE [L]IGHT CAT", "MÈO PHÒ", "NINJA", "LẦU XANH", "[MÈO] | THE [D]ARKNESS CAT", "NEP", "GẤU TUYẾT"];
		var random1 = Math.floor(Math.random() * 21);
		var random2 = Math.floor(Math.random() * 21);
		if (userData[sender.id + message.guild.id].lastDaily != moment().format('L') && userData[sender.id + message.guild.id].LanLX<3){
			userData[sender.id + message.guild.id].money += k;
			userData[sender.id + message.guild.id].LanLX += 1;
			message.channel.send("Bạn <@" +sender.id+"> đã nài nỉ, xin xỏ **"+radmin[random1]+"** và được nhận "+ k +" BoH :innocent: ");
		}
		else {
			userData[sender.id + message.guild.id].lastDaily = moment().format('L')
			userData[sender.id + message.guild.id].LanLX = 0;
			message.channel.send("**"+radmin[random1]+"** đang định cho bạn <@" +sender.id+"> "+ k +" BoH nhưng bị **"+radmin[random2]+"** cướp đi :rage: . Bạn không nhận được tiền. Hãy quay lại sau "+moment().endOf('day').fromNow()+" nhé!");
		}
	}
	if (msg === `${prefix} MONEY` || msg === `${prefix}M` || msg === `${prefix}MONEY` || msg === `${prefix} M`){
		message.channel.send('Bạn <@' +sender.id+'> hiện đang có '+userData[sender.id + message.guild.id].money+' BoH ');
	}

	if (msg.startsWith(`${prefix}HF`) || msg.startsWith(`${prefix}HEARTFLIP`)) {
		if (args[0]>userData[sender.id + message.guild.id].money){ message.channel.send("Bạn không đủ tiền để đặt cược :scream: !")}
		else {
			var k = Math.floor(Math.random() * 2);	
			if (k === 0){
				message.channel.send(":heart: | Trái tim đã được hồi phục. Bạn <@" +sender.id+"> được nhận "+args[0]+" BoH!");
				var a = Number(userData[sender.id + message.guild.id].money);
				var b = Number(args[0]);
				a +=b;
				var s = a;
				userData[sender.id + message.guild.id].money = s;
			}
			else {
				message.channel.send(":broken_heart: | Bạn <@" +sender.id+"> làm trái tim bị vỡ mất rồi. Bạn bị mất "+args[0]+" BoH!");
				var a = Number(userData[sender.id + message.guild.id].money);
				var b = Number(args[0]);
				a -=b;
				var s = a;
				userData[sender.id + message.guild.id].money = s;
			}
		}
	}
	if (msg.startsWith(`${prefix}BC`) || msg.startsWith(`${prefix}BAUCUA`))
	{
		if (args[1]>userData[sender.id + message.guild.id].money){ message.channel.send("Bạn không đủ tiền để đặt cược :scream: !")} 
		else 
		{
			var baucua = ["BẦU", "CUA", "TÔM", "CÁ", "GÀ", "NAI"];
			var bctest = ["BAU", "CUA", "TOM", "CA", "GA", "NAI"];
			var mess = args[0].toUpperCase();
			var bc1 = Math.floor(Math.random() * 6);	
			var bc2 = Math.floor(Math.random() * 6);	
			var bc3 = Math.floor(Math.random() * 6);
			message.channel.send("<@" +sender.id+">, Lắc dĩa và ra " +baucua[bc1]+", "+baucua[bc2]+" và "+baucua[bc3]+" !!");
			var dem=0;
			var k;
			if (mess === bctest[bc1]){
				dem +=1;
				k = bc1;
			}
			if (mess === bctest[bc2]){
				dem +=1;
				k = bc2;
			}
			if (mess === bctest[bc3]){
				dem +=1;
				k = bc3
			}
			if (dem === 0){
				message.channel.send("<@"+sender.id+">. Thật tiếc cho bạn. Bạn không trúng cái nào và mất "+args[1]+" BoH! :cry:")
				var a = Number(userData[sender.id + message.guild.id].money);
				var b = Number(args[1]);
				a -=b;
				var s = a;
				userData[sender.id + message.guild.id].money = s;
			}
			else{
				message.channel.send("<@"+sender.id+">. Chúc mừng bạn . Bạn trúng "+baucua[k]+" "+dem+" lần và nhận được "+args[1]*dem+" BoH! :heart_eyes_cat: ")
				var a = Number(userData[sender.id + message.guild.id].money);
				var b = Number(args[1])*dem;
				a +=b;
				var s = a;
				userData[sender.id + message.guild.id].money = s;
			}
		}
	}
})


bot.login(token);