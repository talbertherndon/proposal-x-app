import { db } from "./App";
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

export async function editProject(payload, projectId) {
  console.log("EDIITN,", payload, projectId)
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE projects SET name=?, address=?, city=?, state=?, zip=?, phone=?, email=?, start=?, finish=?, notes=?, cost=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
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
          projectId
        ],
        (txObj, resultSet) => {
          payload?.areas.map((area) => {
            if (area.id) {
              editArea(area, area.id, projectId);
            } else {
              createArea(area, projectId)
            }
          });

          resolve(resultSet)
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
        `INSERT INTO areas (name, source, file, requirements, estimate, category, status, project_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          payload.name,
          payload.file,
          payload.file,
          JSON.stringify(payload.requirements),
          payload.estimate,
          payload.category,
          payload.status,
          id,
        ],
        (txObj, resultSet) => {
          const res = JSON.stringify(resultSet);
          resolve(res);
        },
        (txObj, error) => reject(error)
      );
    });
  });
}


export async function editArea(payload, areaId, projectId) {
  console.log("THIS IS THE EIT PAYLOARD:", payload)
  let requirements = typeof payload.requirements === 'string' ? JSON.parse(payload.requirements) : payload.requirements;
  console.log("EDITING TO DB:", requirements)
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE areas SET name=?, source=?, file=?, requirements=?, estimate=?, category=?, status=?, project_id=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
        [
          payload.name,
          payload.file,
          payload.file,
          JSON.stringify(requirements),
          payload.estimate,
          payload.category,
          payload.status,
          projectId,
          areaId
        ],
        (txObj, resultSet) => {

          resolve(resultSet)
        },
        (txObj, error) => reject(error)
      );
    });
  });
}

export async function deleteArea(id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM areas WHERE id = ?",
        [id],
        (_, { rowsAffected }) => console.log(`Rows affected: ${rowsAffected}`),
        (_, err) => console.log('Error', err)
      );
    });

  });
}



export async function readProjects() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM projects
        ORDER BY 
        SUBSTR(finish, 7, 4) || '-' || 
        SUBSTR('00' || SUBSTR(finish, 1, INSTR(finish, '/') - 1), -2, 2) || '-' || 
        SUBSTR('00' || SUBSTR(finish, INSTR(finish, '/') + 1, 2), -2, 2);
        `,
        [],
        (txObj, resultSet) => {
          const res = resultSet.rows._array;
          console.log("PROJECTS:", res)
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
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM areas WHERE project_id = ?",
        [id],
        (_, { rowsAffected }) => console.log(`Rows affected: ${rowsAffected}`),
        (_, err) => console.log('Error', err)
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM projects WHERE id = ?;",
        [id],
        null,
        (txObj, error) => reject(error)
      );
    });

  });
}
