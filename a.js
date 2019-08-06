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
		if (!voiceChannel) return msg.channel.send('B?n c?n ph?i ? trong room voice d? t�i c� th? h�t cho b?n');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('T�i c?n du?c c?p quy?n d? v�o room voice');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('T�i c?n quy?n speak trong room voice');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); 
				await handleVideo(video2, msg, voiceChannel, true); 
			}
			return msg.channel.send(`? List nh?c: **${playlist.title}** b�i n�y d� dc th�m`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**L?a Ch?n nh?c de m�y :) :**__

${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

xin h?y ch?n b�i h�t t? 1 d?n 10 .
					`);
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('Vui l�ng nh?p s?!');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('Xin l?i nhung t�i kh�ng t�m th?y!');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('B?n kh�ng c� trong ph�ng n�n kh�ng th? d�ng!');
		if (!serverQueue) return msg.channel.send('Kh�ng c�n b�i n�o d? skip');
		serverQueue.connection.dispatcher.end('s� k�p th�nh c�ng :) !');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('m�y d�o c� trong ph�ng d�ng cc � ?');
		if (!serverQueue) return msg.channel.send('c� b�i n�o d? choi d�u m� stop ?:D??');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('D?ng th�nh c�ng oke ?');
		return undefined;
	} else if (command === 'amluong') {
		if (!msg.member.voiceChannel) return msg.channel.send('m�y d�o c� trong ph�ng d�ng cc � ?');
		if (!serverQueue) return msg.channel.send('c� c?c g� d? play ? ```there is nothing to playing```');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`�� d?t t?n �m lu?ng cho t?t c? m?i ngu?i Th�nh: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('c� c?c g� d? play ? ```there is nothing to playing```');
		return msg.channel.send(`?? �ang H�t b�i: **${serverQueue.songs[0].title}**`);
	} else if (command === 'list') {
		if (!serverQueue) return msg.channel.send('c� c?c g� d? play ? ```there is nothing to playing```');
		return msg.channel.send(`
__**List nh?c:**__ __**Bot By: https://www.facebook.com/NoRightCopySound.Index **__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**�ang H�t b�i:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'dung') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('? d?ng oke!');
		}
		return msg.channel.send('c� con m� g� d? d?ng nh?c ?.');
	} else if (command === 'tieptuc') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('? ti?p t?c n�o !!!');
		}
		return msg.channel.send('c� m? g� d�u ?');
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
		else return msg.channel.send(`? **${song.title}** � k�!`);
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

	serverQueue.textChannel.send(`?? �ang H�t b�i: **${song.title}**`);
}

client.login(TOKEN);