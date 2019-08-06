const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('B?n c?n ph?i ? trong room voice d? tôi có th? hát cho b?n');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('Tôi c?n du?c c?p quy?n d? vào room voice');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('Tôi c?n quy?n speak trong room voice');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); 
				await handleVideo(video2, msg, voiceChannel, true); 
			}
			return msg.channel.send(`? List nh?c: **${playlist.title}** bài này dã dc thêm`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**L?a Ch?n nh?c de mày :) :**__

${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

xin h?y ch?n bài hát t? 1 d?n 10 .
					`);
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('Vui lòng nh?p s?!');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('Xin l?i nhung tôi không tìm th?y!');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('B?n không có trong phòng nên không th? dùng!');
		if (!serverQueue) return msg.channel.send('Không còn bài nào d? skip');
		serverQueue.connection.dispatcher.end('sì kíp thành công :) !');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('mày déo có trong phòng dùng cc à ?');
		if (!serverQueue) return msg.channel.send('có bài nào d? choi dâu mà stop ?:D??');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('D?ng thành công oke ?');
		return undefined;
	} else if (command === 'amluong') {
		if (!msg.member.voiceChannel) return msg.channel.send('mày déo có trong phòng dùng cc à ?');
		if (!serverQueue) return msg.channel.send('có c?c gì d? play ? ```there is nothing to playing```');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`Ðã d?t t?n âm lu?ng cho t?t c? m?i ngu?i Thành: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('có c?c gì d? play ? ```there is nothing to playing```');
		return msg.channel.send(`?? Ðang Hát bài: **${serverQueue.songs[0].title}**`);
	} else if (command === 'list') {
		if (!serverQueue) return msg.channel.send('có c?c gì d? play ? ```there is nothing to playing```');
		return msg.channel.send(`
__**List nh?c:**__ __**Bot By: https://www.facebook.com/NoRightCopySound.Index **__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Ðang Hát bài:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'dung') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('? d?ng oke!');
		}
		return msg.channel.send('có con mè gì d? d?ng nh?c ?.');
	} else if (command === 'tieptuc') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('? ti?p t?c nào !!!');
		}
		return msg.channel.send('có m? gì dâu ?');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`? **${song.title}** Ô kê!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`?? Ðang Hát bài: **${song.title}**`);
}

client.login(TOKEN);