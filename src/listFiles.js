const fs = require('fs');
const path = require('path');

// Function to list all files in a directory
function listFilesInDirectory(directoryPath) {
  // Read the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return;
    }
    
    // Filter out directories and only keep files
    const fileList = files.filter(file => {
      return fs.statSync(path.join(directoryPath, file)).isFile();
    });

    // Format the file names as a JavaScript array
    const formattedArray = `const fileNames = [\n  ${fileList.map(file => `'${file}'`).join(',\n  ')}\n];`;

    // Output the formatted array
    console.log(formattedArray);
  });
}

// Replace 'your-directory-path' with the path to your directory
const directoryPath = path.join(__dirname, 'your-directory-path');
listFilesInDirectory(directoryPath);
