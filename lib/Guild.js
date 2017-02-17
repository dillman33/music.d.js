const ut = require('./util')
const _url = require('url')
const resolve = require('soundcloud-resolve')
const youtube_info = require('youtube-info')
const EventEmitter = require('events')
const nextSong = require('../index')._nextSong

module.exports = class Guild extends EventEmitter{

    constructor(options, connection, message) {

        this.options = options

        this.id = message.guild.id

        this.connection = connection

        this.dispatcher

        this.host = message.author.id

        this.message = message

    }

    /*
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

    queue(song, requester = false) {

        return new Promise((resolve, reject) => {

            let type = ut.linkType(song)

            if (type === "yt" || type === "sc") {

                this._addSong(song, requester, (err, data) => {

                    if (err) return reject(err)

                    return resolve(data)

                })

            } else if (type === "yt-playlist" || type === "sc-playlist") {

                this._addPlaylist(song, requester, (err, data) => {

                    if (err) return reject(err)

                    return resolve(data)

                })

            } else if (/http/.test(song)) {

                this._search(song, requester, (err, data) => {

                    if (err) return reject(err)

                    return resolve(data)

                })

            } else {

                return reject('Invalid Query')

            }


        })

    }

    _addPlaylist(song, requester) {
        
        return new Promise((resolve, reject) => {

            let type = ut.linkType(song)

            if (type === "sc") {

                this._soundcloudInfo(song, (err, data) => {

                    if (err) return reject(err)

                    let playlist = {}

                    data.tracks.forEach(track => {



                    })

                })

            }
        })
    }

    _addSong(url, requester) {

        return new Promise((resolve, reject) => {

            let type = ut.linkType(url)

            if (type === "yt") {

                this._youtubeInfo(url).then(data => {

                    let song = {
                        title: data.title,
                        owner: data.owner,
                        stream: data.url,
                        url: data.url,
                        duration: data.duration * 1000,
                        regionsAllowed: data.regionsAllowed,
                        requester
                    };

                    this.playlist.push(song);

                    return resolve(song);

                }).catch(err => {

                    return reject(err);

                })

            } else if (type === "sc") {

                this._soundcloudInfo(url).then(data => {

                    let song = {
                        title: data.title,
                        owner: data.user.username,
                        stream: data.stream_url,
                        url: url,
                        duration: data.duration,
                        regionsAllowed: true,
                        requester
                    }

                    this.playlist.push(song);

                    return resolve(song)

                }).catch(err => {

                    return reject(err);

                })

            }

        })

    }

    _search(song) {

    }

    _youtubeInfo(url) {

        return new Promise((res, rej) => {

            let type = linkType(url);

            let id = _url.parse(url, true);

            if (type === "yt") id = id.query.v;

            if (type === "yt-be") id = id.path.slice(1);

            youtube_info(id, (err, data) => {

                if (err) return rej('Invalid Youtube ID');

                return res(data);

            });

        })

    }

    _soundcloudInfo(url) {

        return new Promise((resolve, reject) => {

            if (!this.options.scKey) reject('Missing SoundCloud Key')

            resolve(this.options.scKey, url, (err, data) => {

                if (err) return reject('Failed to resolve soundcloud link.');

                return resolve(data);

            });

        })

    }

    play() {

    }

    _recurse() {

    }

    kill() {

    }

    pause() {

    }

    resume() {

    }

    volume() {

    }

}