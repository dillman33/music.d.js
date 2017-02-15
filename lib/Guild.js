const ut = require('./util')

module.exports = class Guild {

    constructor(options, connection, id) {
        
        this.options = options

        this.id = id

        this.connection = connection

        this.dispatcher = {}

    }

    queue(song) {


    }

}