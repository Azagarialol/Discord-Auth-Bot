// CREATED BY !" Nobi.Exe#0007 & >Azagaria#9999

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Database = new Schema({
    id: String,
    data: {type: Array}
});

module.exports = mongoose.model('Database', Database);

// CREATED BY !" Nobi.Exe#0007 & >Azagaria#9999