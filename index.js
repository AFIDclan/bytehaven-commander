const io = require("socket.io-client");
const { Logger } = require("yalls");

const log = Logger.console("bytehaven-commander");

class Commander {
    constructor(team_name) {
        this.team_name = team_name;
    }

    connect({address, port})
    {
        this.socket = io('ws://' + address + ':' + port);

        this.socket.on("registration_opened", () => this.register());
    }

    register()
    {
        log.info("Registering team: " + this.team_name);
        this.socket.emit("register_team", {name: this.team_name});

        setInterval(() => {
            this.socket.emit("get_players", (entities) => {
                log.info("Got entities: " + entities.length);
            });
        }, 1000);
            
    }
}

module.exports = { Commander };