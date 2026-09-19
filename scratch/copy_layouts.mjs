import fs from 'fs';
import path from 'path';

const sourceDir = 'd:/sem 5/SIH2026/layout/layout';
const targetDir = 'd:/sem 5/SIH2026/web/public/layout/layout';

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

copyFolderRecursiveSync(sourceDir, targetDir);
console.log('Successfully copied layout files into web/public/layout/layout!');
