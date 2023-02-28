
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
import { SMTPMailer } from "./providers/SMTPMailer";
import { UserProvider } from "./providers/UserProvider";
import { PropertyProvider } from "./providers/PropertyProvider";
import { PropertyAreaProvider } from "./providers/PropertyAreaProvider";
import { DevelopmentTypeProvider } from "./providers/DevelopmentTypeProvider";

// Formatters
import { dateFormatter } from "./ftms/date";

// Controllers
import { SetupController } from "./controllers/SetupController";
import { LoginController } from "./controllers/LoginController";
import { DashboardController } from "./controllers/DashboardController";
import { BasicSetupController } from "./controllers/BasicSetupController";
import { UserController } from "./controllers/UserController";
import { PropertyController } from "./controllers/PropertyController";



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




// provider
app.set("UserProvider", new UserProvider());
app.set("PropertyProvider", new PropertyProvider());
app.set("PropertyAreaProvider", new PropertyAreaProvider());
app.set("DevelopmentTypeProvider", new DevelopmentTypeProvider());



// Initialize and set the mailer to use
const Mailer = new SMTPMailer(APP_CONFIG.smtp);
app.set("Mailer", Mailer);


// Setup menu
app.setMenu("main", {
    items: [
        { name: "Dashboard", icon: "<i class='fa-solid fa-house fa-lg'></i>", path: "/", for: [Role.Admin, Role.Moderator] },
        { name: "Users", icon: "<i class='fa-solid fa-user fa-lg'></i>", path: "/users", for: [Role.Admin, Role.Moderator] },
        { name: "Properties", icon: "<i class='fa-solid fa-building fa-lg'></i>", path: "/properties", for: [Role.Admin, Role.Moderator] },
        { name: "Basic Setup", icon: "<i class='fa-solid fa-cogs fa-lg'></i>", path: "/basic-setup/index", for: [Role.Admin, Role.Moderator] },
        { name: "File Drive", icon: "<i class='fa-solid fa-hdd fa-lg'></i>", path: "/properties", for: [Role.Admin, Role.Moderator] }
    ]
})

// Add any formatters, you can access it by fmt.date in views like fmt.date.ymd()
app.setFormatter("date", dateFormatter);

// Lets register the controllers
app.registerController(SetupController);
app.registerController(LoginController);
app.registerController(DashboardController);
app.registerController(BasicSetupController);
app.registerController(UserController);
app.registerController(PropertyController);



// Finally setup the cron jobs
// cron.schedule("1 0 * * *", async () => {

// });


// start the express server
app.listen(APP_CONFIG.port, () => {
    console.log(`server started at http://localhost:${APP_CONFIG.port}`);
});