const resolve = require('soundcloud-resolve')

exports.scKey = (key, callback) => {

    resolve(key, "https://soundcloud.com/lubxtpf/whateverhappened", (err, data) => {

        if (err) return callback(true)

        return callback(false)

    })

}

exports.ytKey = (key, callback) => {

    return callback(false)

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