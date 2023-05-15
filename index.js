const io = require("socket.io-client");
const { Logger } = require("yalls");
const Player = require("./Player.js");
const EventEmitter = require("events");

const log = Logger.console("bytehaven-commander");

class Commander extends EventEmitter {
    constructor(team_name) {
        super();
        this.team_name = team_name;
        this.pending_commands = [];
    }

    connect({address, port})
    {
        this.socket = io('ws://' + address + ':' + port);

        this.socket.on("registration_opened", () => this.register());

        this.socket.on("update", (team) => this._update(team))
    }

    register()
    {
        log.info("Registering team: " + this.team_name);
        this.socket.emit("register_team", {name: this.team_name});
    }

    _update(team)
    {
        let players = team.players.map((p)=> new Player(p, this));
        this.emit("update", players)

        this.socket.emit("command_list", this.pending_commands);
        this.pending_commands = [];
    }

}

module.exports = { Commander };