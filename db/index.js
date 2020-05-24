// connects to MySQL database
const connection = require('./connection');
//main constructor that processes all queries
class DB {
  constructor(connection) {
    this.connection = connection;
  }
  // gets everything from the 'department' table
  getAllDepartments() {
    return this.connection.query('SELECT * FROM department');
  }
  //displays all Employees in a chosen Department
  viewDepartment(department) {
    return this.connection.query(`SELECT concat(employee.first_name, ' ', employee.last_name) AS 'Employee', employee.id AS 'ID', role.title AS 'Title', concat('$', FORMAT(role.salary,2)) AS 'Salary', concat(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    WHERE department.name = '${department}';`)
  }

  addNewDepartment(name) {
    return this.connection.query('INSERT INTO department SET ?', {
      name: name
    });
  }

  getAllRoles() {
    return this.connection.query('SELECT * FROM role');
  }

  viewRole(role) {
    return this.connection.query(`SELECT role.title AS 'Role',
    department.name AS 'Department',
    employee.id AS 'Employee ID',
    concat(employee.first_name, ' ', employee.last_name) AS 'Name',
    concat('$',FORMAT(role.salary,2)) AS 'Salary',
    concat(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    WHERE role.title = '${role}';`)
  }

  getDepartmentIDByDepartment(department) {
    return this.connection.query(`SELECT department.id
    FROM department
    INNER JOIN role ON role.department_id = department.id
    WHERE name = '${department}';`)
  }
  
  addNewRole(title, salary, department_id) {
    return this.connection.query('INSERT INTO role SET ?', {
      title: title,
      salary: salary,
      department_id: department_id
    });
  }

  getAllEmployees() {
    return this.connection.query(`SELECT employee.id AS 'ID', concat(employee.first_name, ' ', employee.last_name) AS 'Name', role.title AS 'Title', department.name AS 'Department', concat('$', FORMAT(role.salary,2)) AS 'Salary', concat(manager.first_name, ' ', manager.last_name) AS Manager
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
