const Command = require("./Command.js");

class Player {
    constructor(player_obj, commander)
    {
        Object.assign(this, player_obj);
        this.commander = commander;
    }
    
    fire()
    {
        this.commander.pending_commands.push(new Command(this.id, "fire", {}));
    }

    move(x, y)
    {
        this.commander.pending_commands.push(new Command(this.id, "move", {x, y}));
    }

    turn(angle)
    {
        this.commander.pending_commands.push(new Command(this.id, "turn", {angle}));
    }

    activate_shield()
    {
        this.commander.pending_commands.push(new Command(this.id, "activate_shield", {}));
    }

    deactivate_shield()
    {
        this.commander.pending_commands.push(new Command(this.id, "deactivate_shield", {}));
    }
}

module.exports = Player;