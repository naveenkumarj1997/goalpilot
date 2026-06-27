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

  // Patterns to match typical large loaders
  const patterns = [
    /<div className="flex justify-center items-center[^>]*>[\s\n]*<div className="animate-spin rounded-full h-12 w-12[^>]*><\/div>[\s\n]*<\/div>/g,
    /<div className="flex justify-center p-12[^>]*>[\s\n]*<div className="animate-spin h-8 w-8[^>]*><\/div>[\s\n]*<\/div>/g,
    /<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"><\/div>/g,
    /<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"><\/div>/g
  ];

  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '<AvatarLoader />');
      changed = true;
    }
  });

  if (changed) {
    // Determine relative path to ui component
    const depth = file.replace(path.join(__dirname, 'src', 'pages'), '').split(path.sep).length - 1;
    let importPath = '../components/ui/AvatarLoader';
    if (depth === 2) importPath = '../../components/ui/AvatarLoader';
    if (depth === 3) importPath = '../../../components/ui/AvatarLoader';
    
    // Add import if not exists
    if (!content.includes('AvatarLoader')) {
      // Find last import
      const lastImportIndex = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + `import AvatarLoader from '${importPath}';\n` + content.slice(endOfLastImport + 1);
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
