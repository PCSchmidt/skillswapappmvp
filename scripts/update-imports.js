/**
 * Import Path Standardization Script
 * 
 * This script automatically updates import paths across the codebase to use the standardized @/ prefix format.
 * It scans all source and test files for non-standardized import patterns and replaces them with the standardized format.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TESTS_DIR = path.join(ROOT_DIR, 'tests');
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Import patterns to replace
const IMPORT_PATTERNS = [
  // Direct imports without @/ prefix
  {
    regex: /from\s+['"](?!@\/|react|next|\.\/|\.\.\/|https?:\/\/|@[a-zA-Z0-9-]+\/)(components|lib|types|contexts|hooks|ai|utils|app|styles|config)\/([^'"]+)['"]/g,
    replacement: (match, folder, path) => `from '@/${folder}/${path}'`
  },
  // Alias imports with @components, @lib, etc.
  {
    regex: /from\s+['"](@components|@lib|@types|@contexts|@hooks|@ai|@utils|@app|@styles|@config)\/([^'"]+)['"]/g,
    replacement: (match, folder, path) => `from '@/${folder.substring(1)}/${path}'`
  }
];

// Helper function to check if a file should be processed
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return EXTENSIONS.includes(ext) && 
         !filePath.includes('node_modules') && 
         !filePath.includes('.next') &&
         !filePath.includes('out');
}

// Helper function to recursively get all files in a directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat().filter(shouldProcessFile);
}

// Helper function to update imports in a file
async function updateImportsInFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;

    // Apply each import pattern replacement
    IMPORT_PATTERNS.forEach(({ regex, replacement }) => {
      const newContent = updatedContent.replace(regex, replacement);
      if (newContent !== updatedContent) {
        hasChanges = true;
        updatedContent = newContent;
      }
    });

    // Only write to file if changes were made
    if (hasChanges) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated imports in: ${path.relative(ROOT_DIR, filePath)}`);
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    return 0;
  }
}

// Main function
async function main() {
  console.log('🔍 Scanning for files to update...');
  
  // Get all source and test files
  const srcFiles = await getFiles(SRC_DIR);
  const testFiles = fs.existsSync(TESTS_DIR) ? await getFiles(TESTS_DIR) : [];
  const allFiles = [...srcFiles, ...testFiles];
  
  console.log(`📁 Found ${allFiles.length} files to process`);
  
  // Update imports in all files
  let updatedCount = 0;
  for (const file of allFiles) {
    updatedCount += await updateImportsInFile(file);
  }
  
  console.log(`\n✨ Import path standardization complete!`);
  console.log(`📊 Updated ${updatedCount} files out of ${allFiles.length} total files`);
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
