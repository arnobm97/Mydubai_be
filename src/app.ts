
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
import { PropertyTypeProvider } from "./providers/PropertyTypeProvider";
import { PropertyAreaProvider } from "./providers/PropertyAreaProvider";
import { DevelopmentTypeProvider } from "./providers/DevelopmentTypeProvider";
import { DeveloperTypeProvider } from "./providers/DeveloperTypeProvider";
import { SliderProvider } from "./providers/SliderProvider";
import { CustomerInterestProvider } from "./providers/CustomerInterestProvider";
import { ArrangeMeetingProvider } from "./providers/ArrangeMeetingProvider";

// Formatters
import { dateFormatter } from "./ftms/date";

// Controllers
import { SetupController } from "./controllers/SetupController";
import { LoginController } from "./controllers/LoginController";
import { DashboardController } from "./controllers/DashboardController";
import { BasicSetupController } from "./controllers/BasicSetupController";
import { CmsSetupController } from "./controllers/CmsSetupController";
import { UserController } from "./controllers/UserController";
import { PropertyController } from "./controllers/PropertyController";
import { FileController } from "./controllers/FileController";
import { CustomerInterestController } from "./controllers/CustomerInterestController";

// api
import { HomeApiController } from "./controllers/api/HomeApiController";
import { PropertyApiController } from "./controllers/api/PropertyApiController";
import { CustomerInterestApiController } from "./controllers/api/CustomerInterestApiController";



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
app.set("PropertyTypeProvider", new PropertyTypeProvider());
app.set("PropertyProvider", new PropertyProvider());
app.set("PropertyAreaProvider", new PropertyAreaProvider());
app.set("DevelopmentTypeProvider", new DevelopmentTypeProvider());
app.set("DeveloperTypeProvider", new DeveloperTypeProvider());
app.set("SliderProvider", new SliderProvider());
app.set("CustomerInterestProvider", new CustomerInterestProvider());
app.set("ArrangeMeetingProvider", new ArrangeMeetingProvider());



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
        { name: "CMS Setup", icon: "<i class='fa-solid fa-sliders fa-lg'></i>", path: "/cms-setup/index", for: [Role.Admin, Role.Moderator] },
        { name: "File Drive", icon: "<i class='fa-solid fa-hdd fa-lg'></i>", path: "/file-drive", for: [Role.Admin, Role.Moderator] },
        { name: "Customer Query", icon: "<i class='fa-solid fa-envelope fa-lg'></i>", path: "/customer-interest/index", for: [Role.Admin, Role.Moderator] }
    ]
})

// Add any formatters, you can access it by fmt.date in views like fmt.date.ymd()
app.setFormatter("date", dateFormatter);

// Lets register the controllers
app.registerController(SetupController);
app.registerController(LoginController);
app.registerController(DashboardController);
app.registerController(BasicSetupController);
app.registerController(CmsSetupController);
app.registerController(UserController);
app.registerController(PropertyController);
app.registerController(FileController);
app.registerController(CustomerInterestController);

// api
app.registerController(HomeApiController);
app.registerController(PropertyApiController);
app.registerController(CustomerInterestApiController);




// Finally setup the cron jobs
// cron.schedule("1 0 * * *", async () => {

// });


// start the express server
app.listen(APP_CONFIG.port, () => {
    console.log(`server started at http://localhost:${APP_CONFIG.port}`);
});