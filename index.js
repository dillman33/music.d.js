const _url = require('url');
const youtube_info = require('youtube-info');
const resolve = require('soundcloud-resolve');
const request = require('request');

let opt = false;
let con = {};

exports.set = (a) => {
    if (a.scKey) opt.scKey = a.scKey;
    else opt.scKey = false;
    if (opt.scKey) {
        resolve(opt.scKey, "https://soundcloud.com/lubxtpf/whateverhappened", (err, data) => {
            if (err) opt.scKey = false;
        })
    }
    if (a.ytKey) opt.ytKey = a.ytKey;
    else a.ytKey = false;
    return opt;
}

/* Returns nal if not a link
yt if youtube link
yt-playlist if youtube playlist
sc if soundcloud link
sc-playlist if soundcloud playlist
*/
exports.linkType = (url) => {
    url = _url.parse(url, true);
    if (/(?:www\.)?(?:youtu\.be|youtube\.com)/i.test(url.hostname)) {
        if (url.query.list) return 'yt-playlist';
        if (!url.query.v) return 'yt-be';
        return 'yt'
    }
    if (/(?:www\.)?(?:soundcloud\.com)/i.test(url.hostname)) {
        if (/\/sets\//i.test(url.path)) return 'sc-playlist';
        return 'sc';
    }
    return 'nal';
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
/*
Once you have run connect() you can add songs to the Queue/playlist
You must use addPlaylist() for adding youtube/soundcloud playlists;

Returns Song Object
{
    title: Song Title,
    owner: Song Owner,
    stream: Stream URL (important for soundcloud links),    
    url: Song url,
    duration: Duration in MS,
    regionsAllowed: Regions the link is allowed (returns "all" if all)
};
*/
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
                    duration: data.duration*1000,
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
    return new Promise((res, rej) => {
        let type = linkType(url);
        if (type === "yt-playlist" || type === "sc-playlist" || type === "nal" || type === "sc") return rej("InvalidLink: not youtube link")
        let id = _url.parse(url, true);
        if (type === "yt") id = id.query.v;
        if (type === "yt-be") id = id.path.slice(1);
        youtube_info(id, (err, data) => {
            if (err) return rej('Invalid Youtube ID');
            return res(data);
        });
    })
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