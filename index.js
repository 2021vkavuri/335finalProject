const path = require("path");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.sfnlykc.mongodb.net/?retryWrites=true&w=majority`;

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

async function main() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    try {
        await client.connect();
        if (process.argv.length != 3) {
            console.log("Usage summerCampServer.js portNumber");
            process.exit();
        } else {
            app.listen(Number(process.argv[2]), (err) => {
                if (err) {
                    console.log("Starting server failed.");
                } else {
                    console.log(
                        `Web server started and running at http://localhost:${Number(process.argv[2])}`);
                    process.stdout.write("Stop to shut down the server: ");
                    readline.on("line", (input) => {
                        if (input === "stop") {
                            console.log("Shutting down the server");
                            process.exit(0);
                        } else {
                            console.log(`Invalid command: ${input}`);
                        }
                        process.stdout.write("Stop to shut down the server: ");
                    });
                }
            });

            app.get("/", async (request, response) => {
                await client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_COLLECTION).insertOne({test1: 1, test2: 2});
                response.send("Hello World");
            });
        }
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
