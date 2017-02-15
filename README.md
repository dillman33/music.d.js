#music.d.js
A music library for discord.js
Now we can flood the discord community with amazing music bots!
Its just that easy!

###Example
```js
const Player = require('music.d.js')

let options = {
    scKey: "1234567",
    ytKey: "7654321",
    autoPlay: true
}

let player = Player(options)

voiceChannel.join().then(connection => {
  
   player.addConnection(connection, message)
  
}
```

####options
Value|Default|Description
:---|:---|:---
scKey|false|The SoundCloud API Key, if no key is provided, soundcloud functionality is disabled
ytKey|false|The YouTube API Key, if no key is provided, youtube *playlist* and *search* is disabled
autoPlay|true|When enabled, will start playing music on queue without having to run `play()`


##Player
####Player\#setup
setup the music player
>returns Promise\<Options\>
```js
Player.setup(options)
.then(options => {
    //The options set
})
.catch(err => {
    //Invalid api keys or options were simply incorrect
})
```

####Player\#addConnection
Add a voiceConnection 
>returns GuildPlayer Class of id, else returns error
```js
voiceChannel.join().then(connection => {
    let GuildPlayer = Player.addConnection(connection, message)
})
//connection: The VoiceChannel connection object
//message: The standard d.js Message Object
```

####Player#get
Get a GuildPlayer by ID if it exists
>returns GuildPlayer Class of id, else returns false
```js
let GuildPlayer = Player.get('12345678899')
```

##GuildPlayer
