import { db } from "./App";
//name text, address text, city text, state text, zip int, phone int, email text, start text, finish text, notes text, cost int
export async function createProject(payload) {
  console.log(payload);

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO projects(name, address, city, state, zip, phone, email, start, finish, notes, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          payload.name,
          payload.address,
          payload.city,
          payload.state,
          payload.zip,
          payload.phone,
          payload.email,
          payload.start,
          payload.finish,
          payload.notes,
          payload.cost,
        ],
        (txObj, resultSet) => {
          console.log(resultSet);
          console.log("NEW PROEJECTL", resultSet, "OD:", resultSet.insertId);
          payload?.areas.map((area) => {
            createArea(area, resultSet.insertId);
          });
          resolve(resultSet);
        },
        (txObj, error) => reject(error)
      );
    });
  });
}

export async function createArea(payload, id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO areas (name, source, requirements, estimate, category, project_id) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          payload.name,
          payload.source,
          payload.requirements,
          payload.estimate,
          payload.category,
          id,
        ],
        (txObj, resultSet) => {
          const res = JSON.stringify(resultSet);
          console.log("AREA RESULE:", res);
          resolve(res);
        },
        (txObj, error) => reject(error)
      );
    });
  });
}

export async function readProjects() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM projects",
        [],
        (txObj, resultSet) => {
          const res = resultSet.rows._array;
          resolve(res);
        },
        (txObj, error) => reject(error)
      );
    });
  });
}
export async function readAreas() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM areas",
        [],
        (txObj, resultSet) => {
          const res = resultSet.rows._array;
          resolve(res);
        },
        (txObj, error) => reject(error)
      );
    });
  });
}
export async function readAreasByProjects(project_id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM areas WHERE project_id = ?;`,
        [project_id],
        (txObj, resultSet) => {
          const res = resultSet.rows._array;
          resolve(res);
        },
        (txObj, error) => reject(error)
      );
    });
  });
}
export async function deleteProject(id) {
  console.log("ID", id);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM projects WHERE id = ?;",
        [id],
        null,
        (txObj, error) => reject(error)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM areas WHERE project_id = ?",
        [id],
        (_, { rowsAffected }) => console.log(`Rows affected: ${rowsAffected}`),
        (_, err) => console.log('Error', err)
      );
    });
  });
}
