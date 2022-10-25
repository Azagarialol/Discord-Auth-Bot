// CREATED BY !" Nobi.Exe#0007 & >Azagaria#9999

const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect(process.env.mongodb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connected to the database!")
    }catch (e) {
        console.log(e)
    }
};

connect();

// CREATED BY !" Nobi.Exe#0007 & >Azagaria#9999