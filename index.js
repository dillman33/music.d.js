const Guild = require('./lib/Guild')
const ut = require('./lib/util.js')
const EventEmitter = require('events').EventEmitter
const event = new EventEmitter()

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

    return players[message.guild.id]
}

exports._nextSong = (song) => {
    event.emit('nextSong', song)
}