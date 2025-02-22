import fs from "fs";
import path from "path";

export function createNewProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error("Project already exists!");
    process.exit(1);
  }

  fs.mkdirSync(projectPath);
  fs.writeFileSync(
    path.join(projectPath, "index.js"),
    `import { RevApp } from "revjs";

const app = new RevApp();
app.listen(3000, () => console.log("Server running!"));
`
  );
}

