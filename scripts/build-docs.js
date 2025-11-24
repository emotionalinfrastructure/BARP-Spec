const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const output = path.join(__dirname, '..', 'dist', 'docs.txt');

if (!fs.existsSync(docsDir)) {
  throw new Error('docs directory missing');
}

const content = fs
  .readdirSync(docsDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => `# ${file}\n${fs.readFileSync(path.join(docsDir, file), 'utf8')}`)
  .join('\n\n');

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, content);
console.log(`Docs bundled to ${output}`);
