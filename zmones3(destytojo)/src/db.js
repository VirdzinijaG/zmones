import mysql from "mysql";

const connectOptions = {
  host: "192.168.1.2",
  user: "nodejs",
  password: "nodejs123456",
  database: "zmones",
  multipleStatements: true,
};

function dbConnect() {
  const conn = mysql.createConnection(connectOptions);
  return new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(conn);
    });
  });
}

function dbDisconnect(conn) {
  if (conn) {
    return new Promise((resolve, reject) => {
      conn.end((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  } else {
    return Promise.resolve();
  }
}

function dbQuery(conn, ...args) {
  return new Promise((resolve, reject) => {
    conn.query(...args, (err, results, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        results,
        fields,
      });
    });
  });
}

async function getZmones() {
  let conn;
  try {
    conn = await dbConnect();
    let r = await dbQuery(
      conn,
      "select id, vardas, pavarde, gim_data as gimimoData, alga from zmones",
    );
    return r.results;
  } finally {
    try {
      await dbDisconnect(conn);
    } catch (err) {
      // ignored
    }
  }
}

async function getZmogus(id) {
  id = parseInt(id);
  if (isFinite(id)) {
    let conn;
    try {
      conn = await dbConnect();
      let r = await dbQuery(
        conn,
        "select id, vardas, pavarde, gim_data as gimimoData, alga from zmones where id = ?",
        [id],
      );
      return r.results;
    } finally {
      try {
        await dbDisconnect(conn);
      } catch (err) {
        // ignored
      }
    }
  } else {
    throw new Error("Bad id");
  }
}

async function saveZmogus(id, vardas, pavarde, gimimoData, alga) {
  let conn;
  try {
    conn = await dbConnect();
    if (id) {
      let r = await dbQuery(
        conn,
        "update zmones set vardas = ?, pavarde = ?, gim_data = ?, alga = ? where id = ?;",
        [vardas, pavarde, gimimoData, alga, id],
      );
      return r.results;
    } else {
      let r = await dbQuery(
        conn,
        "insert into zmones (vardas, pavarde, gim_data, alga) values (?, ?, ?, ?);",
        [vardas, pavarde, gimimoData, alga],
      );
      return r.results;
    }
  } finally {
    try {
      await dbDisconnect(conn);
    } catch (err) {
      // ignored
    }
  }
}

async function deleteZmogus(id) {
  id = parseInt(id);
  if (isFinite(id)) {
    let conn;
    try {
      conn = await dbConnect();
      let r = await dbQuery(
        conn,
        "delete from zmones where id = ?",
        [id],
      );
    } finally {
      try {
        await dbDisconnect(conn);
      } catch (err) {
        // ignored
      }
    }
  } else {
    throw new Error("Bad id");
  }
}

async function getKontaktai(zmogusId) {
  zmogusId = parseInt(zmogusId);
  if (isFinite(zmogusId)) {
    let conn;
    try {
      conn = await dbConnect();
      let r = await dbQuery(
        conn,
        "select id, tipas, reiksme from kontaktai where zmones_id = ?",
        [zmogusId],
      );
      return r.results;
    } finally {
      try {
        await dbDisconnect(conn);
      } catch (err) {
        // ignored
      }
    }
  } else {
    throw new Error("Bad id");
  }
}

async function getKontaktas(id, zmogusId) {
  id = parseInt(id);
  if (!isFinite(id)) {
    throw new Error("Bad id");
  }
  zmogusId = parseInt(zmogusId);
  if (!isFinite(zmogusId)) {
    throw new Error("Bad zmogusId");
  }
  let conn;
  try {
    conn = await dbConnect();
    let r = await dbQuery(
      conn,
      "select id, tipas, reiksme from kontaktai where id = ? and zmones_id = ?",
      [id, zmogusId],
    );
    return r.results;
  } finally {
    try {
      await dbDisconnect(conn);
    } catch (err) {
      // ignored
    }
  }
}

async function saveKontaktas(id, zmogusId, tipas, reiksme) {
  let conn;
  try {
    conn = await dbConnect();
    if (id) {
      let r = await dbQuery(
        conn,
        "update kontaktai set tipas = ?, reiksme = ? where id = ? and zmones_id = ?;",
        [tipas, reiksme, id, zmogusId],
      );
      return r.results;
    } else {
      let r = await dbQuery(
        conn,
        "insert into kontaktai (zmones_id, tipas, reiksme) values (?, ?, ?);",
        [zmogusId, tipas, reiksme],
      );
      return r.results;
    }
  } finally {
    try {
      await dbDisconnect(conn);
    } catch (err) {
      // ignored
    }
  }
}

async function deleteKontaktas(id, zmogusId) {
  id = parseInt(id);
  if (!isFinite(id)) {
    throw new Error("Bad id");
  }
  zmogusId = parseInt(zmogusId);
  if (!isFinite(zmogusId)) {
    throw new Error("Bad zmogusId");
  }
  let conn;
  try {
    conn = await dbConnect();
    let r = await dbQuery(
      conn,
      "delete from kontaktai where id = ? and zmones_id = ?",
      [id, zmogusId],
    );
  } finally {
    try {
      await dbDisconnect(conn);
    } catch (err) {
      // ignored
    }
  }
}

export {
  deleteKontaktas,
  deleteZmogus,
  getKontaktai,
  getKontaktas,
  getZmogus,
  getZmones,
  saveKontaktas,
  saveZmogus,
};
