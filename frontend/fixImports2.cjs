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
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src', 'pages'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const depth = file.replace(path.join(__dirname, 'src', 'pages'), '').split(path.sep).length - 1;
  let importPath = '../components/ui/AvatarLoader';
  if (depth === 2) importPath = '../../components/ui/AvatarLoader';
  if (depth === 3) importPath = '../../../components/ui/AvatarLoader';
  
  const importStatement = `import AvatarLoader from '${importPath}';`;

  if (content.includes('import AvatarLoader')) {
    // Remove the bad import
    const regex = new RegExp(`import AvatarLoader from '[^']+';?\\n?`, 'g');
    content = content.replace(regex, '');
    
    // Add it safely at the very top of the file
    content = `${importStatement}\n` + content;
    changed = true;
  } else if (content.includes('<AvatarLoader')) {
    // If it's completely missing, add it to the top
    content = `${importStatement}\n` + content;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed import in ${file}`);
  }
});
