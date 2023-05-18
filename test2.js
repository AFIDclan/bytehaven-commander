const { Commander } = require("./index.js");

let commander = new Commander("zoxks" + Math.floor(Math.random() * 1000));
commander.connect({address: "localhost", port: 1346});

function sainitize_angle(angle)
{
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    return angle;
}

/*
# precondition: [a1,a2] >= 0
angle = ((a2 % 360) - (a1 % 360) + 360) % 360
direction = CLOCKWISE
if angle > 180:
    angle = 360 - angle
    direction = ANTICLOCKWISE
*/ 
function get_shortest_direction(angle1, angle2)
{
    let angle = ((angle2 % Math.PI*2) - (angle1 % Math.PI*2) + Math.PI*2) % Math.PI*2;
    let direction = 1;
    if (angle > Math.PI)
    {
        angle = Math.PI*2 - angle;
        direction = -1;
    }

    return [angle, direction];
}


commander.on("update", (players) => {

    players.forEach((player) => {
        
        if (player.detected_enemies.length > 0)
        {
            let enemy = player.detected_enemies[0];
            let angle = Math.atan2(enemy.pose.y - player.pose.y, enemy.pose.x - player.pose.x) + Math.PI / 2;
            let player_angle = player.pose.angle;

            angle = sainitize_angle(angle);
            player_angle = sainitize_angle(player_angle);

            if (player_angle > Math.PI) player_angle -= 2 * Math.PI;

            let shortest = get_shortest_direction(player_angle, angle);
            player.turn(shortest[1] * Math.abs(shortest[0]/10));
            player.fire();
        
        }

        

        //console.log(player.detected_enemies.length)
    });
});

