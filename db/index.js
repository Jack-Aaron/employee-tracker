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
    WHERE department.name = '${department}'`);
  }
  // see everything in 'role' table
  getAllRoles() {
    return this.connection.query('SELECT * FROM role');
  }
  // see employee information when given role title
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
    WHERE role.title = '${role}'`);
  }
  // the information on a specific role
  getThisRole(title) {
    return this.connection.query(`SELECT title AS 'Role',
    concat('$',FORMAT(salary,2)) AS 'Salary',
    department.name AS 'Department'
    FROM role
    INNER JOIN department ON department.id = role.department_id
    WHERE title = '${title}'`);
  }
  // a new table of all employee information and their managers
  getAllEmployees() {
    return this.connection.query(`SELECT employee.id AS 'ID', concat(employee.first_name, ' ', employee.last_name) AS 'Name', role.title AS 'Title', department.name AS 'Department', concat('$', FORMAT(role.salary,2)) AS 'Salary', concat(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
  }
  // a list of all managers
  getAllManagers() {
    return this.connection.query(`SELECT concat(employee.first_name, ' ', employee.last_name) AS 'Name', id
    FROM employee
    WHERE is_manager = TRUE;`);
  }
  // a table of all Employee information grouped by manager
  getAllEmployeesByManager(manager) {
    return this.connection.query(`SELECT employee.id AS 'Employee ID', concat(employee.first_name, ' ', employee.last_name) AS 'Name', department.name AS 'Department', role.title 'Title'
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    WHERE manager_id = 3`);
  }
  // inserts new entry into 'department' table
  addNewDepartment(name) {
    return this.connection.query('INSERT INTO department SET ?', {
      name: name
    });
  }
  // returns department.id when given a department name
  getDepartmentIDByDepartment(department) {
    return this.connection.query(`SELECT id
    FROM department
    WHERE name = '${department}'`);
  }
  // inserts new entry into 'role' table
  addNewRole(title, salary, department_id) {
    return this.connection.query('INSERT INTO role SET ?', {
      title: title,
      salary: salary,
      department_id: department_id
    });
  }
  // returns all data from 'employee' table
  whoIsEmployee() {
    return this.connection.query('SELECT * FROM employee');
  }
  // returns role.id when given a role title
  getRoleIDByTitle(title) {
    return this.connection.query(`SELECT id
    FROM role
    WHERE title = '${title}'`);
  }
  // returns manager_id when given a concated Employee name
  getManagerIDByEmployee(name) {
    return this.connection.query(`SELECT DISTINCT id
    FROM employee
    WHERE concat(first_name, ' ', last_name) = '${name}'`);
  }
  // inserts new entry into 'employee' table
  addNewEmployee(first_name, last_name, role_id, manager_id) {
    return this.connection.query('INSERT INTO employee SET ?', {
      first_name: first_name,
      last_name: last_name,
      role_id: role_id,
      manager_id: manager_id
    });
  }
  // returns employee.id when given a concated Employee name
  getEmployeeIDByEmployeeName(employee) {
    return this.connection.query(`SELECT id
    FROM employee
    WHERE concat(first_name, ' ', last_name) = '${employee}'`);
  }
  // updates Role of given Employee via selection
  updateEmployee(employee_id, role_id) {
    return this.connection.query('UPDATE employee SET ? WHERE ?', [
      {
        role_id: role_id,
      },
      {
        id: employee_id,
      },
    ])
  }
}

// DELETE FROM 

module.exports = new DB(connection);
