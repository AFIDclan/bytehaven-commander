const { Commander } = require("./index.js");

let commander = new Commander("example1-" + Math.floor(Math.random() * 1000));
commander.connect({address: "localhost", port: 1346});


let player_dest_map = {};

commander.on("update", (players) => {

    players.forEach((player) => {
        
        if (player.detected_enemies.length > 0)
        {
            player_dest_map[player.id] = null;

            let enemy = player.detected_enemies[0];
            player_aim_at(player, enemy.pose);
            player.fire();
        
        } else {

            if (!player_dest_map[player.id])
            {
                player_dest_map[player.id] = {
                    x: (Math.random() * 2000) - 1000,
                    y: (Math.random() * 2000) - 1000
                }
            } else {
                player_aim_at(player, player_dest_map[player.id]);
                player.move(0, -50);
            }
            
        }
    });
});




function sainitize_angle(angle)
{
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;

    return angle;
}

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

function player_aim_at(player, target_pose)
{
    let angle = Math.atan2(target_pose.y - player.pose.y, target_pose.x - player.pose.x) + Math.PI / 2;
    let player_angle = player.pose.angle;

    angle = sainitize_angle(angle);
    player_angle = sainitize_angle(player_angle);

    if (player_angle > Math.PI) player_angle -= 2 * Math.PI;

    let shortest = get_shortest_direction(player_angle, angle);
    player.turn(shortest[1] * Math.abs(shortest[0]/10));
}

