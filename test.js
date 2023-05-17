const { Commander } = require("./index.js");

let commander = new Commander("zoxks" + Math.floor(Math.random() * 1000));
commander.connect({address: "localhost", port: 1346});

commander.on("update", (players) => {

    players.forEach((player) => {
        player.turn(0.05);
        player.move(-50, 50);
        player.fire();

        //console.log(player.detected_enemies.length)
    });
});

