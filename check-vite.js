import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if vite is installed
const vitePath = path.join(__dirname, 'node_modules', 'vite');
const viteExists = fs.existsSync(vitePath);

console.log(`Vite installed: ${viteExists}`);
if (viteExists) {
  const vitePackageJsonPath = path.join(vitePath, 'package.json');
  const vitePackageJsonExists = fs.existsSync(vitePackageJsonPath);
  console.log(`Vite package.json exists: ${vitePackageJsonExists}`);
  
  if (vitePackageJsonExists) {
    const vitePackageJson = JSON.parse(fs.readFileSync(vitePackageJsonPath, 'utf8'));
    console.log(`Vite version: ${vitePackageJson.version}`);
  }
  
  const viteBinPath = path.join(vitePath, 'bin', 'vite.js');
  const viteBinExists = fs.existsSync(viteBinPath);
  console.log(`Vite bin exists: ${viteBinExists}`);
}

// Check node_modules structure
const nodeModulesPath = path.join(__dirname, 'node_modules');
const nodeModulesExists = fs.existsSync(nodeModulesPath);
console.log(`node_modules exists: ${nodeModulesExists}`);

if (nodeModulesExists) {
  // List top-level directories in node_modules
  const topLevelDirs = fs.readdirSync(nodeModulesPath)
    .filter(dir => fs.statSync(path.join(nodeModulesPath, dir)).isDirectory())
    .slice(0, 10); // Show only first 10 directories
  
  console.log(`Top-level directories in node_modules (first 10): ${topLevelDirs.join(', ')}`);
}
