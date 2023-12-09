require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.sfnlykc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const express = require('express');
const app = express(); 
const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

// setup db connection & add initial data if empty
try {
    client.connect();
} catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(0);
}

// create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
  if (err) {
    console.log("Starting server failed.");
  } else {
    console.log(`To access server: http://localhost:${port}`);
    startREPL();
  }
}); 
console.log("============================");

function startREPL() {
  rl.setPrompt('Stop to shutdown the server:');
  rl.prompt();

  // listener for command line interface
  rl.on('line', (input) => {
      
      if(input === "stop"){
        console.log('Shutting down the server');
        process.exit(0);
      }
      else {
        // prompt user again
        rl.prompt();
      }
  });

  // listener for closing command line interface
  rl.on('close', () => {
    console.log('Shutting down the server');
    process.exit(0);
  });
}

app.get("/", (req, res) => {
    res.render('../templates/index.ejs', null);
});

// app.post("/processAdminRemove", async (req, res) => {
//     const database = client.db(process.env.MONGO_DB_NAME);
//     const collection = database.collection(`${process.env.MONGO_COLLECTION}`);
//     applicants = (await collection.find({}).toArray()).length;
//     const result = await collection.deleteMany({});

//     res.render('../templates/processAdminRemove.ejs', {'num': applicants});

// });




