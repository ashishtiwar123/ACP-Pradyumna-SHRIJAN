import fs from "fs";
import path from "path";

// rest of your code stays the same


// -----------------------------------------------------------------------------
// Load patterns from .gitignore
// -----------------------------------------------------------------------------
function loadGitignore(basePath) {
  const gitignorePath = path.join(basePath, ".gitignore");
  const patterns = [];

  if (fs.existsSync(gitignorePath)) {
    const lines = fs.readFileSync(gitignorePath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        patterns.push(trimmed);
      }
    }
  }
  return patterns;
}

// -----------------------------------------------------------------------------
// Check if item should be skipped
// -----------------------------------------------------------------------------
function shouldSkip(item, skipFiles) {
  return (
    skipFiles.has(item) ||
    item.startsWith(".") ||
    item === "venv" // explicitly skip virtual environment folder
  );
}

// -----------------------------------------------------------------------------
// Recursively generate folder & file structure
// -----------------------------------------------------------------------------
function getProjectStructure(basePath, indent = "", skipFiles = new Set()) {
  let structure = "";
  const items = fs.readdirSync(basePath).sort();
  const visibleItems = items.filter((item) => !shouldSkip(item, skipFiles));

  visibleItems.forEach((item, index) => {
    const fullPath = path.join(basePath, item);
    const isLast = index === visibleItems.length - 1;
    const branch = isLast ? "└── " : "├── ";

    structure += indent + branch + item + "\n";

    if (fs.statSync(fullPath).isDirectory()) {
      const extension = isLast ? "    " : "│   ";
      structure += getProjectStructure(fullPath, indent + extension, skipFiles);
    }
  });

  return structure;
}

// -----------------------------------------------------------------------------
// Main execution
// -----------------------------------------------------------------------------
(function main() {
  const baseDir = "."; // project root

  // Load .gitignore patterns
  const gitignorePatterns = loadGitignore(baseDir);

  // Custom skip files/folders
  const customSkipFiles = [
    "generate_file_structure.js",
    "prompt.txt",
    "structure.txt",
    "venv"
  ];

  // Combine both
  const skipFiles = new Set([...gitignorePatterns, ...customSkipFiles]);

  // Generate structure
  const structureText = getProjectStructure(baseDir, "", skipFiles);

  // Save to file
  fs.writeFileSync("structure.txt", structureText, "utf-8");

  console.log("✅ Project structure saved to structure.txt (ignoring .gitignore, venv & custom files)");
})();