const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Pattern to replace || 'http://localhost:5000' with ''
  const pattern = /\|\|\s*'http:\/\/localhost:5000'/g;
  
  if (pattern.test(content)) {
    content = content.replace(pattern, "|| ''");
    changed = true;
  }
  
  const pattern2 = /\|\|\s*'http:\/\/localhost:5000\/api'/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, "|| '/api'");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Removed local URL fallback in ${file}`);
  }
});
