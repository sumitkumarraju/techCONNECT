const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../app/api');

const removeFunctionRegex = /const getDataFromToken = \(req: NextRequest\) => \{[\s\S]*?return null;\s*\}\s*\}\s*/;
const importStatement = `import { getDataFromToken } from "@/lib/auth-server";\n`;

function processFile(filePath) {
    if (path.extname(filePath) !== '.ts') return;

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('const getDataFromToken = (req: NextRequest)')) {
        // Remove the function
        content = content.replace(removeFunctionRegex, '');

        // Add import at the top after other imports
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
        } else {
            content = importStatement + content;
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else {
            processFile(fullPath);
        }
    });
}

traverseDirectory(directoryPath);
