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

  if (content.includes('<AvatarLoader') && !content.includes('import AvatarLoader')) {
    const depth = file.replace(path.join(__dirname, 'src', 'pages'), '').split(path.sep).length - 1;
    let importPath = '../components/ui/AvatarLoader';
    if (depth === 2) importPath = '../../components/ui/AvatarLoader';
    if (depth === 3) importPath = '../../../components/ui/AvatarLoader';
    
    // Find last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + `import AvatarLoader from '${importPath}';\n` + content.slice(endOfLastImport + 1);
        changed = true;
    } else {
        content = `import AvatarLoader from '${importPath}';\n` + content;
        changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed import in ${file}`);
  }
});
