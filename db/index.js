const connection = require('./connection');

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  getAllDepartments() {
    return this.connection.query('SELECT * FROM department');
  }

  viewDepartment(department) {
    return this.connection.query(`SELECT concat(name, ' (', department_id, ')') AS 'Department (+ ID)', concat(employee.first_name, ' ', employee.last_name) AS 'Employee', employee.id AS 'ID', role.title AS 'Title', concat('$', FORMAT(role.salary,0)) AS 'Salary', concat(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    WHERE department.name = "${department}";`)
  }

  addNewDepartment(name) {
    return this.connection.query('INSERT INTO department SET ?', {
      name: name
    });
  }

  getAllRoles() {
    return this.connection.query('SELECT * FROM role');
  }

  addNewRole(title, salary, department_id) {
    return this.connection.query('INSERT INTO role SET ?', {
      title: title,
      salary: salary,
      department_id: department_id
    });
  }

  getAllEmployees() {
    return this.connection.query(`SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary 'Salary', concat(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`);
  }

  addNewEmployee(first_name, last_name, role_id, manager_id) {
    return this.connection.query('INSERT INTO employee SET ?', {
      first_name: first_name,
      last_name: last_name,
      role_id: role_id,
      manager_id: manager_id
    });
  }

  updateRole(role, chosenEmployee) {
    return this.connection.query('UPDATE employee SET ? WHERE ?', [
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
