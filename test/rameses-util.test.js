const path = require("path");
const config = require("../config/config");
const api = require("../api/rameses-db-migration");

const rootDir = path.join(__dirname, "dbm-root");

afterAll(() => {
  console.log("afterAll")
  api.closeCache();
});

describe("DB Migration", () => {
  test("should load single level module", async () => {
    const expectedModules = [
      { file: "module1", 
        fileId: "module1",
        dir: `${rootDir}/single`,
        files: [
          {file: "1-init.mysql", dir: `${rootDir}/single/module1/migrations`},
          {file: "2-update.mysql", dir: `${rootDir}/single/module1/migrations`},
        ],
        modules: [],
      }
    ];
    const modules = await api.scanModules(path.join(rootDir, "single"));
    expect(modules).toEqual(expectedModules);
  });

  // test("should load multi-level dirs", async () => {
  //   const expectedDirs = [
  //     { file: "module1", 
  //       fileId: "module1",
  //       dir: `${rootDir}/multiple` 
  //     },
  //     { file: "submodule1", 
  //       fileId: "module1.submodule1",
  //       dir: `${rootDir}/multiple/module1/migrations` 
  //     },
  //     { file: "submodule2", 
  //       fileId: "module1.submodule2",
  //       dir: `${rootDir}/multiple/module1/migrations` 
  //     }
  //   ];
  //   const result = await api.findDirs(path.join(rootDir, "multiple"), (file) => !/migrations/i.test(file) );
  //   expect(result).toEqual(expectedDirs);
  // });
});
