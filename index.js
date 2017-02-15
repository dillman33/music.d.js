const _url = require('url');
const youtube_info = require('youtube-info');
const resolve = require('soundcloud-resolve');
const request = require('request');
const Guild = require('./lib/Guild')
const ut = require('./lib/util.js')

let options = false;
let players = {}

exports.setup = (opt = {}) => {
    
    return new Promise((resolve, reject) => {

        if (opt === false) return reject("Options have already been set")

        if (typeof opt !== "object") return reject("Options must be an object")

        options = {}

        options.scKey = opt.scKey ? opt.scKey : false

        if (options.scKey) {
            
            ut.scKey(options.scKey, (err) => {
                
                if (err) return reject("Invalid SoundCloud Api Key")

            })

        }

        options.ytKey = opt.ytKey ? opt.ytKey : false

        if (options.ytKey) {

            ut.ytKey(options.ytKey, (err) => {
                
                if (err) return reject("Invalid YouTube Api Key")

            })
        }

        options.autoPlay = opt.autoPlay ? opt.autoPlay : true
        
        return resolve(options)
    })

}


exports.get = (id) => {

    if (!players[id]) return false
    return players[id]

}

exports.addConnection = (connection, message) => {
    if (message.channel.type === "dm") throw new Error("Music cannot be played in direct messages")

    if (!connection || !message) throw new Error("Missing argument in addConnection")

    if (this.players[guildID]) throw new Error("Connection for the id: " + guildID + " already exists")

    players[message.guild.id] = new Guild(options, connection, message)
}

/* Create a voice channel connection
yourbot.joinVoiceChannel(channelID).then(connection => {
This must be run to initialize the bot into a voice channel
textChannel is the channel in which Next song messages will be sent
*/
exports.connect = (guildID, voiceChannel, textChannel, connection) => {
    con[guildId] = {
        voiceChannel,
        textChannel,
        connection,
        playlist: []
    };
}

exports.addSong = (guildID, url, user) => {
    return new Promise((res, rej) => {
        if (!con[guildID]) return rej('You must connect to a channel first.');
        let type = exports.linkType(url);
        if (type === "yt-playlist" || type === "sc-playlist" || type === "nal") return rej('InvalidLink: Don\'t request playlists');
        if (type === "yt") {
            youtubeInfo(url).then(data => {
                let song = {
                    title: data.title,
                    owner: data.owner,
                    stream: data.url,
                    url: data.url,
                    duration: data.duration * 1000,
                    regionsAllowed: data.regionsAllowed
                };
                con[guildID].playlist.push(song);
                res(song);
            }).catch(err => {
                rej(err);
            })
        }
        if (type === "sc") {
            if (!opt || !opt.scKey) return rej('Soundcloud links need a soundcloud api key');
            soundcloudInfo(url).then(data => {
                let song = {
                    title: data.title,
                    owner: data.user.username,
                    stream: data.stream_url,
                    url: url,
                    duration: data.duration,
                    regionsAllowed: "all"
                }
                con[guildID].playlist.push(song);

            }).catch(err => {
                rej(err);
            })
        }
    });
}

function youtubeInfo(url) {
    
}

function soundcloudInfo(url) {
    return new Promise((res, rej) => {
        let type = linkType(url);
        if (type === "yt-playlist" || type === "sc-playlist" || type === "nal" || type === "yt") return rej('InvalidLink: only soundcloud tracks.')
        resolve(opt.scKey, url, (err, data) => {
            if (err) return rej('Failed to resolve soundcloud link.');
            return res(data);
        });
    })
}