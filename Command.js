
class Command 
{
    constructor(player_id, type, data)
    {
        this.player_id = player_id;
        this.type = type;
        this.data = data;
    }
}

module.exports = Command;