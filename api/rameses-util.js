const path = require("path");
const fs = require("fs");

const isDirectory = (dirPath) => {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
};

const isFileEqualExtension = (file, extension) => {
  if (!extension) return false;
  let extName = extension.toLowerCase();
  extName = extName.startsWith(".") ? extName : "." + extName;
  return path.extname(file) === extName;
};

const doFindFiles = (dir, filter, files = []) => {
  if (!isDirectory(dir)) {
    return;
  }

  fs.readdirSync(dir).forEach((file) => {
    const fileName = path.join(dir, file);
    if (isDirectory(fileName)) {
      const fileName = path.join(dir, file);
      doFindFiles(fileName, filter, files);
    } else if (filter(file)) {
      files.push({ dir, file });
    }
  });
};

const findFiles = (dir, filter = (file) => true) => {
  const files = [];
  doFindFiles(dir, filter, files);
  return files;
};

module.exports = {
  findFiles,
  isDirectory,
  isFileEqualExtension,
};
