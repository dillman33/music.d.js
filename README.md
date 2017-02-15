# music.d.js
A music library for discord.js

###Example
```js
const Player = require('music.d.js')

let options = {
    scKey: "1234567",
    ytKey: "7654321",
    autoPlay: true
}

let player = new Player(options)

voiceChannel.join().then(connection => {
  
   player.addConnection(connection, guildID)
  
}
```
