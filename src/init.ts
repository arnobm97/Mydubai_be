
import mongoose from "mongoose";
import bluebird from "bluebird";
import { exit } from "process";

export function wrapWithBox(message: string, lineGap: boolean = true) {
    const dotsLine = '-'.repeat(message.length + 6);
    console.log(dotsLine);
    console.log(`|  ${message}  |`);
    console.log(dotsLine);
    if (lineGap) console.log('');
}

export function mongoInit(url: string): void {
    // Connect to MongoDB
    mongoose.Promise = bluebird;
    mongoose.set("useFindAndModify", false);
    mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
        () => {
            wrapWithBox("Connected to MongoDB");
        },
    ).catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
        exit();
    });
}