import mongoose from "mongoose";
import bluebird from "bluebird";
import { exit } from "process";
import dns from 'dns';
export function wrapWithBox(message: string, lineGap: boolean = true) {
    const dotsLine = '-'.repeat(message.length + 6);
    console.log(dotsLine);
    console.log(`|  ${message}  |`);
    console.log(dotsLine);
    if (lineGap) console.log('');
}

export function mongoInit(url: string): void {
      dns.setServers(['8.8.8.8', '8.8.4.4']);

    console.log('Using DNS servers:', dns.getServers());


    mongoose.Promise = bluebird;
    mongoose.connect(url).then(
        () => {
            wrapWithBox("Connected to MongoDB");
        },
    ).catch(err => {
        console.log("MongoDB connection error: " + err);
        exit();
    });

  mongoose.Promise = bluebird;

  mongoose.connect(url, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    wrapWithBox("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  });
}
