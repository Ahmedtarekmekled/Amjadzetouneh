const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy static assets
const frontendPublic = path.join(__dirname, 'frontend', 'public');
const backendPublic = path.join(__dirname, 'food-blog-backend', 'public');

// Ensure backend public directory exists
if (!fs.existsSync(backendPublic)) {
  fs.mkdirSync(backendPublic, { recursive: true });
}

// Copy frontend public to backend public/frontend
const backendFrontendPublic = path.join(backendPublic, 'frontend');
copyDir(frontendPublic, backendFrontendPublic);

console.log('✅ Static assets copied successfully!');
console.log('📁 Frontend public -> Backend public/frontend'); 