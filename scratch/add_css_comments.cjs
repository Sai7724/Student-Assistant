const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// Remove all block comments.
css = css.replace(/\/\*[\s\S]*?\*\//g, '');

let lines = css.split('\n');
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let trimmed = line.trim();
  
  if (trimmed.startsWith('.') && trimmed.includes('{')) {
     let match = trimmed.match(/^\.([a-zA-Z0-9_-]+)/);
     if (match) {
        newLines.push(`/* Styles for ${match[1]} class */`);
     }
  } else if (trimmed === ':root {') {
     newLines.push(`/* Root CSS variables */`);
  } else if (trimmed === 'body {') {
     newLines.push(`/* Body element styles */`);
  } else if (trimmed.startsWith('@media')) {
     newLines.push(`/* Media query */`);
  } else if (trimmed.startsWith('@keyframes')) {
     let match = trimmed.match(/^@keyframes\s+([a-zA-Z0-9_-]+)/);
     if (match) {
        newLines.push(`/* Keyframes for ${match[1]} */`);
     }
  }
  
  newLines.push(line);
}

let finalCss = newLines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync(cssPath, finalCss);
console.log('Processed index.css');
