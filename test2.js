const { Commander } = require("./index.js");

let commander = new Commander("zoxks" + Math.floor(Math.random() * 1000));
commander.connect({address: "localhost", port: 1346});

commander.on("update", (players) => {

    players.forEach((player) => {
        
        if (player.detected_enemies.length > 0)
        {
            let enemy = player.detected_enemies[0];
            let angle = Math.atan2(enemy.pose.y - player.pose.y, enemy.pose.x - player.pose.x) + Math.PI / 2;
            player.turn(angle - player.pose.angle);
            player.fire();
        
        }

        

        //console.log(player.detected_enemies.length)
    });
});

