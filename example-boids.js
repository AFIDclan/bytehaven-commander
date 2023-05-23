const { Commander } = require("./index.js");

class MyTeam {
    constructor() {
        this.commander = new Commander("my-team-" + Math.floor(Math.random() * 1000));
        this.commander.connect({ address: "0.0.0.0", port: 1346 });
        this.playerDestMap = {};

        this.commander.on("update", this.updateHandler.bind(this));
    }

    updateHandler(players) {

        players.forEach((player) => {
            if (player.detected_enemies.length > 0) {
                this.attackEnemy(player, player.detected_enemies[0]);
            } else {
                this.boidMovement(player, players);
            }
        });
    }

    attackEnemy(player, enemy) {
        this.playerDestMap[player.id] = null;

        const angleToEnemy = Math.atan2(enemy.pose.y - player.pose.y, enemy.pose.x - player.pose.x);
        const playerAngle = player.pose.angle;

        const angleDifference = this.getShortestAngleDifference(playerAngle, angleToEnemy);

        player.turn(angleDifference);
        player.move(0, -50);
        player.fire();
    }

    boidMovement(player, allPlayers) {
        const cohesionWeight = 0.5;
        const alignmentWeight = 0.3;
        const separationWeight = 0.2;
        const maxSpeed = 50;
        const maxAcceleration = 10;
    
        const nearbyPlayers = this.getNearbyPlayers(player, allPlayers);
        const averagePosition = this.calculateAveragePosition(nearbyPlayers);
        const averageVelocity = this.calculateAverageVelocity(nearbyPlayers);
    

        const cohesionVector = {
            x: averagePosition.x - player.pose.x,
            y: averagePosition.y - player.pose.y
        };
    
        const alignmentVector = {
            x: averageVelocity.x - player.velocity.x,
            y: averageVelocity.y - player.velocity.y
        };
    
        const separationVector = {
            x: 0,
            y: 0
        };
    
        nearbyPlayers.forEach((other_player) => {
            const distance = Math.sqrt(Math.pow(player.pose.x - other_player.pose.x, 2) + Math.pow(player.pose.y - other_player.pose.y, 2));
            if (distance > 0 && distance < 500) {
                separationVector.x += (player.pose.x - other_player.pose.x) / distance;
                separationVector.y += (player.pose.y - other_player.pose.y) / distance;
            }
        });

        const separationFactor = 350; // Adjust this value as needed for desired separation strength

        const separationMagnitude = Math.sqrt(Math.pow(separationVector.x, 2) + Math.pow(separationVector.y, 2));
        if (separationMagnitude > 0) {
            separationVector.x *= separationFactor / separationMagnitude;
            separationVector.y *= separationFactor / separationMagnitude;
        }
        

        const acceleration = {
            // x: cohesionWeight * cohesionVector.x + alignmentWeight * alignmentVector.x + separationWeight * separationVector.x,
            // y: cohesionWeight * cohesionVector.y + alignmentWeight * alignmentVector.y + separationWeight * separationVector.y
            x: alignmentWeight * alignmentVector.x,
            y: alignmentWeight * alignmentVector.y
        };
    
        const accelerationMagnitude = Math.sqrt(Math.pow(acceleration.x, 2) + Math.pow(acceleration.y, 2));
        if (accelerationMagnitude > maxAcceleration) {
            const scale = maxAcceleration / accelerationMagnitude;
            acceleration.x *= scale;
            acceleration.y *= scale;
        }

        
    
        player.velocity.x += acceleration.x;
        player.velocity.y += acceleration.y;
    
        const velocityMagnitude = Math.sqrt(Math.pow(player.velocity.x, 2) + Math.pow(player.velocity.y, 2));
        if (velocityMagnitude > maxSpeed) {
            const scale = maxSpeed / velocityMagnitude;
            player.velocity.x *= scale;
            player.velocity.y *= scale;
        }

        player.turn((Math.atan2(player.velocity.y, player.velocity.x) + Math.PI/2) - player.pose.angle);
        player.move(0, -Math.sqrt(Math.pow(player.velocity.x, 2) + Math.pow(player.velocity.y, 2)));
    }
    
    
    getNearbyPlayers(player, allPlayers) {
        return allPlayers.filter((p) => {
            const distance = Math.sqrt(Math.pow(player.pose.x - p.pose.x, 2) + Math.pow(player.pose.y - p.pose.y, 2));
            return distance > 0 && distance < 1000;
        });
    }

    calculateAveragePosition(players) {
        const averagePosition = { x: 0, y: 0 };
        players.forEach((player) => {
            averagePosition.x += player.pose.x;
            averagePosition.y += player.pose.y;
        });

        if (players.length)
        {
            averagePosition.x /= players.length;
            averagePosition.y /= players.length;
        }
        
        return averagePosition;
    }

    calculateAverageVelocity(players) {
        const averageVelocity = { x: 0, y: 0 };
        players.forEach((player) => {
            averageVelocity.x += player.velocity.x;
            averageVelocity.y += player.velocity.y;
        });

        if (players.length)
        {
            averageVelocity.x /= players.length;
            averageVelocity.y /= players.length;
        }

        return averageVelocity;
    }

    getShortestAngleDifference(angle1, angle2) {
        let angle = ((angle2 % (2 * Math.PI)) - (angle1 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        let direction = 1;
        if (angle > Math.PI) {
            angle = 2 * Math.PI - angle;
            direction = -1;
        }
        return direction * angle;
    }
}

const myTeam = new MyTeam();
