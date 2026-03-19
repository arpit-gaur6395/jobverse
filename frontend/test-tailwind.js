// Test script to verify Tailwind CSS setup
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Tailwind CSS Setup...\n');

// Check if required files exist
const requiredFiles = [
  'tailwind.config.js',
  'postcss.config.js',
  'package.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check package.json for Tailwind dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const tailwindDeps = ['tailwindcss', 'postcss', 'autoprefixer'];
  
  console.log('\n📦 Checking dependencies...');
  tailwindDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} missing from devDependencies`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  allFilesExist = false;
}

// Check if main CSS file has Tailwind directives
try {
  const appCss = fs.readFileSync('src/App.css', 'utf8');
  const tailwindDirectives = ['@tailwind base', '@tailwind components', '@tailwind utilities'];
  
  console.log('\n🎨 Checking CSS setup...');
  tailwindDirectives.forEach(directive => {
    if (appCss.includes(directive)) {
      console.log(`✅ ${directive} found`);
    } else {
      console.log(`❌ ${directive} missing`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading App.css');
  allFilesExist = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 Tailwind CSS setup is complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:5173');
} else {
  console.log('❌ Setup incomplete. Please check the missing items above.');
}

console.log('\n💡 For detailed setup guide, see: TAILWIND_SETUP.md');
