import * as shell from "shelljs";

shell.cp("-R", "src/public/js", "build/public/");
shell.cp("-R", "src/public/fonts", "build/public/");
shell.cp("-R", "src/public/images", "build/public/");