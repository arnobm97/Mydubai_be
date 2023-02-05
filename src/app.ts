
// System
import path from "path";
import fs from "fs";
import { exit } from "process";

// Core
import { mongoInit } from "./init";
import { Application } from "./core/Application";
import { Config } from "./core/Config";
import { Role } from "./core/IUserProvider";
import cron from "node-cron";

// Providers
import { UserProvider } from "./providers/UserProvider";
import { SMTPMailer } from "./providers/SMTPMailer";

// Formatters
import { dateFormatter } from "./ftms/date";

// Controllers
import { SignupController } from "./controllers/SignupController";
import { LoginController } from "./controllers/LoginController";


// Crons
// import { UpdateCohort } from "./crons/UpdateCohort";
import { any } from "bluebird";

// config
const CONFIG_FILE = "config.json";

if (!fs.existsSync(CONFIG_FILE)) {
    console.warn(`Can't find '${CONFIG_FILE}' please make sure config file is present in the current directory`);
    exit(0);
}

const APP_CONFIG: Config = new Config(JSON.parse(fs.readFileSync(CONFIG_FILE).toString()));

// Initialize mongo db
mongoInit(APP_CONFIG.mongoUrl);

const app = new Application(APP_CONFIG);

app.viewDir("views");
app.viewEngine("pug");
app.setStatic(path.join(__dirname, "public"), { maxAge: 0 }); // 31557600000 turned off caching for now

app.set("UserProvider", new UserProvider());


// Initialize and set the mailer to use
const Mailer = new SMTPMailer(APP_CONFIG.smtp);
app.set("Mailer", Mailer);


// Setup menu


app.setMenu("main", {
    items: [
        { name: "Dashboard", path: "#", for: [Role.Superadmin, Role.Admin, Role.Member] },
        { name: "Order", path: "#", for: [Role.Superadmin, Role.Admin, Role.Member] },
        { name: "Booking", path: "#", for: [Role.Superadmin, Role.Admin, Role.Member] },
        { name: "Accounts", path: "#", for: [Role.Superadmin, Role.Admin, Role.Member] },
        { name: "Logout", path: "#", for: [Role.Superadmin, Role.Admin, Role.Member] }
    ]
})

// Add any formatters, you can access it by fmt.date in views like fmt.date.ymd()
app.setFormatter("date", dateFormatter);

// Lets register the controllers
app.registerController(SignupController);
app.registerController(LoginController);

// Finally setup the cron jobs
// Run Cohort Update cron at midnight everyday to update cohort status
cron.schedule("* 0 * * *", async () => {
    // await UpdateCohort();
});

// start the express server
app.listen(APP_CONFIG.port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${APP_CONFIG.port}`);
});