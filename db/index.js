const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  getAllDepartments() {
    return this.connection.query("SELECT * FROM department");
  }

  addNewDepartment(item) {
    return this.connection.query("INSERT INTO department SET ?", {
      name: name
    });
  }

  getAllRoles() {
    return this.connection.query("SELECT * FROM role");
  }

  addNewRole(title, salary, department_id) {
    return this.connection.query("INSERT INTO role SET ?", {
      title: title,
      salary: salary,
      department_id: department_id
    });
  }

  getAllEmployees() {
    return this.connection.query("SELECT * FROM employee");
  }

  addNewEmployee(first_name, last_name, role_id, manager_id) {
    return this.connection.query("INSERT INTO employee SET ?", {
      first_name: first_name,
      last_name: last_name,
      role_id: role_id,
      manager_id: manager_id
    });
  }

  updateRole(role, chosenEmployee) {
    return this.connection.query("UPDATE employee SET ? WHERE ?", [
      {
        role_id: role_id,
      },
      {
        id: chosenEmployee.id,
      },
    ]);
  }
}

module.exports = new DB(connection);
