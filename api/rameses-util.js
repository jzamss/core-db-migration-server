const path = require("path");
const fs = require("fs");

const log = {
  info: (arg) => console.log("[INFO]", arg),
  warn: (arg) => console.log("[WARN]", arg),
  err: (arg) => console.log("[ERROR]", arg),
}

const isDirectory = (dirPath) => {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
};

const isFileEqualExtension = (file, extension) => {
  if (!extension) return false;
  let extName = extension.toLowerCase();
  extName = extName.startsWith(".") ? extName : "." + extName;
  return path.extname(file) === extName;
};

const findDirs = (dir) => {
  const dirs = [];
  if (!isDirectory(dir)) {
    return dirs;
  }

  fs.readdirSync(dir).forEach((file) => {
    const fileName = path.join(dir, file);
    if (isDirectory(fileName)) {
      dirs.push({ dir, file });
    } 
  });
  return dirs;
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
  findDirs,
  findFiles,
  isDirectory,
  isFileEqualExtension,
  log,
};
