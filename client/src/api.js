const log = {
  info: (arg) => console.log("[INFO]", arg),
  warn: (arg) => console.log("[WARN]", arg),
  err: (arg) => console.log("[ERROR]", arg),
}

export const getModules = async () => {
  const res = await fetch("/dbmigrations/modules")
  if (res.ok) {
    return res.json();
  } else {
    const msg = 'Unable to load modules';
    log.err(`Status: ${res.status}. ${msg}`);
    throw msg;
  }
};

export const getModuleFiles = async (module) => {
  const res = await fetch(`/dbmigrations/modules/${module.name}`)
  if (res.ok) {
    const files = await res.json();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.dtfiled = new Date(file.dtfiled);
    }

    files.sort((a, b) => {
      const astr = a.filename.toLowerCase();
      const bstr = b.filename.toLowerCase();
      if (astr > bstr) return 1;
      if (astr < bstr) return -1;
      return 0;
    })
    console.log("getModuleFiles files", files);
    return files;
  } else {
    const msg = `Unable to load module ${module.name} files.`;
    log.err(`Status: ${res.status}. ${msg}`);
    throw msg;
  }
};


export const saveModule = async module => {
  const res = await fetch(`/dbmigrations/modules/${module.name}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ module }),
  });

  if (res.ok) {
    return module;
  } else {
    const msg = `Unable to save module ${module.name}.`;
    log.err(`Status: ${res.status}. ${msg}`);
    throw msg;
  }
}

export const buildModules = async () => {
  const res = await fetch(`/dbmigrations/build`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (res.ok) {
    return await getModules();
  } else {
    const msg = `Unable to save module ${module.name}.`;
    log.err(`Status: ${res.status}. ${msg}`);
    throw msg;
  }
}

export const buildModule = async (module) => {
  const res = await fetch(`/dbmigrations/build/${module.name}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!res.ok) {
    const msg = `Error deploying scripts for ${module.name}.`;
    log.err(`Status: ${res.status}. ${msg}`);
    throw msg;
  }
}