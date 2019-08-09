// JavaScript source code
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment');

const modRole = 'Admin';

let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
const token = 'NjA4MzQyMjcxMzgwNjg0ODUx.XUy_Qg.8qojrKheLltyD8dcWCJy6zqqaUQ';

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
	if (!userData[sender.id + message.guild.id].CreateBank) userData[sender.id + message.guild.id].CreateBank = 0;
	fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
		if (err) console.error(err);
	})
	if ((msg === `${prefix}CB` || msg === `${prefix}CREATEBANK`) && userData[sender.id + message.guild.id].CreateBank === 0){
		userData[sender.id + message.guild.id].CreateBank = 1;
		userData[sender.id + message.guild.id].money += 500000;
		message.reply("Chúc mừng, bạn đã tạo tài khoản ngân hàng thành công. Vì đây là lần đầu của bạn nên chúng tôi tặng bạn 500.000 BoH như phần quà ưu đãi\nBây giờ, bạn có thể dùng những câu lệnh khác\nHãy dùng BOHHELP để biết thêm thông tin chi tiết về các lệnh")
	}
	else if ((msg === `${prefix}CB` || msg === `${prefix}CREATEBANK`) && (!message.author.bot)) {
		message.reply("Xin lỗi nhưng bạn đã lập tài khoản ngân hàng. Bạn không thể lập lại lần nữa! ")
	}
	if (msg === `${prefix}PING` || msg === `${prefix} PING`) {
		message.channel.send('Pong! :ballot_box_with_check:')
	}
	if (msg === "BOH HELP" || msg === "BOHHELP"){
		message.channel.send({embed: {
		color: 3447003,
		author: {
			name: bot.user.username,
			icon_url: bot.user.avatarURL
		},
			title: "BẢNG LỆNH CỦA BOH",
			url: "https://discord.gg/aVzzbkb",
			description: "Chỉ dẫn các lệnh của con bot BoH",
			fields: [{
				name: "BOHCB / BOHCREATEBANK.",
				value: "Dùng để lặp tài khoản ngân hàng cho người mới."
			  },
				{
				name: "BOHM / BOHMONEY",
				value: "Dùng để kiểm tra số tiền BoH còn lại."
			  },
			  {
				name: "BOHLX / BOHLIXI",
				value: "Dùng để nhận lì xì trong khoảng từ 1 đến 10k. Mỗi ngày chỉ nhận được __3__ lần."
			  },
			  {
				name: "BOHHF / BOHHEARTFLIP + <số tiền cược>",
				value: "Dùng để chơi hàn gắn trái tim. Nếu trái tim hồi phục, bạn sẽ nhận được tiền. Nếu không thành công bạn sẽ bị mất đi số tiền đã đặt cược."
			  },
			  {
				name: "BOHBC / BOHBAUCUA + <số tiền cược> + <bau / cua / tom / ca / ga / nai>.",
				value: "Dùng để chơi bầu cua."
			  },
			  {
				name: "BOHTX / BOHTAIXIU + <số tiền cược> + <tai/xiu>.",
				value: "Dùng để chơi tài xỉu."
			  },
			  {
				name: "BOHSEND / BOHGIVE + <số tiền> + <người dùng>.",
				value: "Dùng để gửi tiền của bản thân cho người dùng."
			  },
			],
			timestamp: new Date(),
			footer: {
			  icon_url: bot.user.avatarURL,
			  text: "© BoH"
			}
		  }
		});
	}
	
	if (userData[sender.id + message.guild.id].CreateBank === 1){
	if (msg.startsWith(`${prefix}TAIXIU`) || msg.startsWith(`${prefix}TX`)){
		userData[sender.id + message.guild.id].CreateBank = 1;
		if ((Number(args[0])>userData[sender.id + message.guild.id].money) && (userData[sender.id + message.guild.id].money<=0)){message.reply("Bạn không đủ tiền để đặt cược")}
		else {
		var cuoc;
		if (!args[0]) {cuoc = 1}
		else if (args[0].toUpperCase()==='ALL') {cuoc = userData[sender.id + message.guild.id].money}
		else {cuoc = Number(args[0])};

		var chon;

		if (!args[1]) {chon='XIU';message.reply("Bạn không chọn tài hay xỉu nên máy tự mặc định bạn chọn xỉu")}
		else {chon=args[1].toUpperCase()};

		var tx1 = Math.floor(Math.random() * 6 )+1;
		var tx2 = Math.floor(Math.random() * 6 )+1;
		var tx3 = Math.floor(Math.random() * 6 )+1;

		var s = tx1+tx2+tx3;

		message.reply("Đổ xúc xắc và ra ["+tx1+"] ["+tx2+"] ["+tx3+"]\n**Và có tổng là ["+s+"]**");
		if ((tx1 === 1 && tx2 === 1 && tx3 === 1 && chon === 'XIU') || (tx1 === 6 && tx2 === 6 && tx3 === 6 && chon === 'TAI')){
			message.reply("Bạn thật may mắn. Cả ba con xúc xắc đều cùng đổ ra "+tx1+" và bạn đã chọn đúng "+chon+". Do đó bạn nhận được "+cuoc*2+" BoH :money_mouth: ")
			userData[sender.id + message.guild.id].money += cuoc*2;
		}
		else {
			if (s<=9 && chon === 'XIU' || s>=10 && chon === 'TAI'){
				message.reply("Bạn thật may mắn.Bạn đã chọn đúng "+chon+". Do đó bạn nhận được "+cuoc+" BoH :money_mouth: ")
				userData[sender.id + message.guild.id].money += cuoc;
			}
			else {
				message.reply("Thật đáng tiếc, bạn đã chọn sai . Do đó bạn mất đi "+cuoc+" BoH :dizzy_face: ")
				userData[sender.id + message.guild.id].money -= cuoc;
			}
		}
		}
	}

	if (msg === `${prefix}LIXI` || msg === `${prefix}LX`) {
		userData[sender.id + message.guild.id].CreateBank = 1;
		var k = Math.floor(Math.random() * 10000);
		var radmin = ["CỪU","ANH VŨ", "STACY", "MERLIN", "LY", "MÈO CHỦ TỊT", "LION VIOLET", "SOC_SECURITY", "GRIEZMANN", "CHỊ HỒNG ANH", "CƠM", "CUA", "[M]ÈO | THE [L]IGHT CAT", "MÈO PHÒ", "NINJA", "LẦU XANH", "[MÈO] | THE [D]ARKNESS CAT", "NEP", "GẤU TUYẾT"];
		var random1 = Math.floor(Math.random() * 20);
		var random2 = Math.floor(Math.random() * 20);
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
	if (msg === `${prefix}M` || msg === `${prefix}MONEY`){
		userData[sender.id + message.guild.id].CreateBank = 1;
		message.channel.send('Bạn <@' +sender.id+'> hiện đang có '+userData[sender.id + message.guild.id].money+' BoH ');
	}

	if (msg.startsWith(`${prefix}HF`) || msg.startsWith(`${prefix}HEARTFLIP`)) {
		userData[sender.id + message.guild.id].CreateBank = 1;
		if (args[0]>userData[sender.id + message.guild.id].money){ message.channel.send("Bạn không đủ tiền để đặt cược :scream: !")}
		else {
			var cuoc;
			if (!args[0]) {cuoc = 1}
			else if (args[0].toUpperCase()==='ALL') {cuoc = userData[sender.id + message.guild.id].money}
			else {cuoc = Number(args[0])};

			var k = Math.floor(Math.random() * 2);	
			if (k === 0){
				message.channel.send(":heart: | Trái tim đã được hồi phục. Bạn <@" +sender.id+"> được nhận "+cuoc+" BoH!");
				userData[sender.id + message.guild.id].money += cuoc;
			}
			else {
				message.channel.send(":broken_heart: | Bạn <@" +sender.id+"> làm trái tim bị vỡ mất rồi. Bạn bị mất "+cuoc+" BoH!");
				userData[sender.id + message.guild.id].money -= cuoc;
			}
		}
	}

	if (msg.startsWith(`${prefix}SC`) || msg.startsWith(`${prefix}SETCOIN`)){
		if (!message.member.roles.find("name", modRole)){
			message.reply("**Bạn cần role "+modRole+" để có thể dùng lệnh này")
		}
		else {
			var num = Number(args[0]);
			let userid ='';
			var firstmention =  message.mentions.members.first();
			if (!firstmention){
				userData[sender.id + message.guild.id].money = num;
				message.channel.send("Đặt thành công tiền của "+sender+" thành "+num+" BoH")
			}
			else {
				userid = firstmention.id;
				if (!userData[userid + message.guild.id]) userData[userid + message.guild.id] = {}
				if (!userData[userid + message.guild.id].money) userData[userid + message.guild.id].money = 0;
				if (!userData[userid + message.guild.id].lastDaily) userData[userid + message.guild.id].lastDaily = "Chưa được nhận lì xì";
				if (!userData[userid + message.guild.id].LanLX) userData[userid + message.guild.id].LanLX = 0;
				userData[userid + message.guild.id].money = num;
				fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
				if (err) console.error(err);
				})
				message.channel.send("Đặt thành công tiền của "+firstmention+" thành "+num+" BoH")
			}
		}
	}

	if (msg.startsWith(`${prefix}GIVE`) || msg.startsWith(`${prefix}SEND`)){
			var num = Number(args[0]);
			let userid ='';
			var firstmention =  message.mentions.members.first();
			if (!firstmention){
				message.channel.send("Nhập sai cú pháp. Vui lòng dùng BOHHELP !")
			}
			else if (num>userData[sender.id + message.guild.id].money){
					message.reply("Bạn không có đủ tiền để gửi đâu! Đồ ngốc ~")
				}
				else{
					userid = firstmention.id;
					if (!userData[userid + message.guild.id]) userData[userid + message.guild.id] = {}
					if (!userData[userid + message.guild.id].money) userData[userid + message.guild.id].money = 0;
					if (!userData[userid + message.guild.id].lastDaily) userData[userid + message.guild.id].lastDaily = "Chưa được nhận lì xì";
					if (!userData[userid + message.guild.id].LanLX) userData[userid + message.guild.id].LanLX = 0;
					userData[userid + message.guild.id].money += num;
					userData[sender.id + message.guild.id].money -= num;
					fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
					if (err) console.error(err);
					})
					message.channel.send("Chuyển "+num+" BoH sang "+firstmention+" thành công. Bạn còn "+userData[sender.id + message.guild.id].money+" BoH");
				}	
		}

	if (msg.startsWith(`${prefix}BC`) || msg.startsWith(`${prefix}BAUCUA`))
	{
		userData[sender.id + message.guild.id].CreateBank = 1;
		if (Number(args[0])>userData[sender.id + message.guild.id].money){ message.channel.send("Bạn không đủ tiền để đặt cược :scream: !")} 
		else 
		{
			var cuoc;
			if (!args[0]) {cuoc = 1}
			else if (args[0].toUpperCase()==='ALL') {cuoc = userData[sender.id + message.guild.id].money}
			else {cuoc = Number(args[0])};

			var chon;

			if (!args[1]) {chon='BAU';message.reply("Bạn không chọn cược con gì nên máy tự mặc định bạn chọn bầu")}
			else {chon=args[1].toUpperCase()};

			var baucua = ["BẦU", "CUA", "TÔM", "CÁ", "GÀ", "NAI"];
			var bctest = ["BAU", "CUA", "TOM", "CA", "GA", "NAI"];
			
			var bc1 = Math.floor(Math.random() * 6);	
			var bc2 = Math.floor(Math.random() * 6);	
			var bc3 = Math.floor(Math.random() * 6);
			message.channel.send("<@" +sender.id+">, Lắc dĩa và ra [" +baucua[bc1]+"] | ["+baucua[bc2]+"] | ["+baucua[bc3]+"]");
			var dem=0;
			var k;
			if (chon === bctest[bc1]){
				dem +=1;
				k = bc1;
			}
			if (chon === bctest[bc2]){
				dem +=1;
				k = bc2;
			}
			if (chon === bctest[bc3]){
				dem +=1;
				k = bc3
			}
			if (dem === 0){
				message.channel.send("<@"+sender.id+">. Thật tiếc cho bạn. Bạn không trúng cái nào và mất "+cuoc+" BoH! :cry:")
				userData[sender.id + message.guild.id].money -= cuoc;
			}
			else{
				message.channel.send("<@"+sender.id+">. Chúc mừng bạn . Bạn trúng "+baucua[k]+" "+dem+" lần và nhận được "+cuoc*dem+" BoH! :heart_eyes_cat: ")
				userData[sender.id + message.guild.id].money += cuoc*dem;
			}
		}
	}
	}
	else {
		if(!message.author.bot && (msg.startsWith(`${prefix}BC`) || msg.startsWith(`${prefix}BAUCUA`) || msg.startsWith(`${prefix}HF`) || msg.startsWith(`${prefix}HEARTFLIP`) || msg === `${prefix}LIXI` || msg === `${prefix}LX` || msg.startsWith(`${prefix}TAIXIU`) || msg.startsWith(`${prefix}TX`) || msg === `${prefix}M` || msg === `${prefix}MONEY` || msg === "BOH HELP" || msg === "BOHHELP")) return message.reply("Hãy tạo bank khi bạn chưa sử dụng để có thể sử dụng các câu lệnh và nhận ngay 500.000 BoH\n**Hãy sử dụng câu lệnh BOHCB hoặc BOHCREATEBANK để tạo tài khoản ngân hàng nhé!");
	}
})


bot.login(token);