const { Commander } = require("./index.js");

let commander = new Commander("zoxks" + Math.floor(Math.random() * 1000));
commander.connect({address: "localhost", port: 1346});

