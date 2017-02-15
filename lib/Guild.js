const ut = require('./util')
const _url = require('url')

module.exports = class Guild {

    constructor(options, connection, message) {

        this.options = options

        this.id = message.guild.id

        this.connection = connection

        this.dispatcher

        this.host = message.author.id

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

    queue(song, requester) {

        return new Promise((resolve, reject) => {

            let type = ut.linkType(song)

            if (type === "yt" || type === "sc") {

                _addSong(song, requester, (err, data) => {

                    if (err) return reject(err)

                    return resolve(data)

                })

            } else if (type === "yt-playlist" || type === "sc-playlist") {

                _addPlaylist(song, requester, (err, data) => {

                    if (err) return reject(err)

                    return resolve(data)

                })

            } else if (/http/.test(song)) {

                _search(song, requester, (err, data) => {

                    if (err) return reject(err)

                    return resolve(data)

                })

            } else {

                return reject('Invalid Query')

            }


        })

    }

    _addPlaylist(song, requester, callback) {
        
    }

    _addSong(url, requester, callback) {

        return new Promise((resolve, reject) => {

            let type = ut.linkType(url)

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

                    this.playlist.push(song);

                    return resolve(song);

                }).catch(err => {

                    return reject(err);

                })

            } else if (type === "sc") {

                soundcloudInfo(url).then(data => {

                    let song = {
                        title: data.title,
                        owner: data.user.username,
                        stream: data.stream_url,
                        url: url,
                        duration: data.duration,
                        regionsAllowed: "all"
                    }

                    this.playlist.push(song);

                    return resolve(song)

                }).catch(err => {

                    return reject(err);

                })

            }

        })

    }

    _search(song, callback) {

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

    _soundcloudInfo(url, ) {

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

    test() {

    }

    textChannel() {

    }

}