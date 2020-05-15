const path = require("path");
const fs = require("fs");

const log = {
  info: (arg) => console.log("[INFO]", arg),
  warn: (arg) => console.log("[WARN]", arg),
  err: (arg) => console.log("[ERROR]", arg),
};

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



const scanFiles = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// const initModule = (parent, dir, file) => {
//   return {
//     dir,
//     file: file.name,
//     fileid: parent ? `${parent.file}.${file.name}` : file.name,
//     files: [],
//     modules: [],
//   }
// }

// const initFile = (dir, file) => {
//   return { file: file.name, dir }
// }

// const scanModuleFiles = async (dir, parent) => {
//   const files = await scanFiles(dir);
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     if (file.isDirectory() ) {
//       let parentDir;
//       if (/migrations/i.test(file.name)) {
//         parentDir = path.join(dir, "migrations");
//         await scanModuleFiles(parentDir, parent);
//       } else {
//         const module = initModule(parent, dir, file);
//         parent.modules.push(module);
//         parentDir = path.join(dir, file.name)
//         await scanModuleFiles(parentDir, module);
//       }
//     } else {
//       parent.files.push(initFile(dir, file));
//     }
//   };
// }

// const scanModules = async (dir) => {
//   const modules = [];
//   const files = await scanFiles(dir);
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     if (file.isDirectory()) {
//       const module = initModule(null, dir, file);
//       modules.push(module);
//       const parentDir = path.join(dir, file.name);
//       await scanModuleFiles(parentDir, module);
//     } else {
//       module.files.push({
//         dir: dir,
//         file: file.name,
//       })
//     }
//   };
//   return modules;
// };

module.exports = {
  findDirs,
  findFiles,
  isDirectory,
  isFileEqualExtension,
  log,
  scanFiles,
};
