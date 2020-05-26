const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');
require('console.table');

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: 'Employee Tracker' }).render();
  console.log(logoText);
  mainPrompts();
}
//main menu of app
async function mainPrompts() {
  const { choice } = await prompt({
    name: 'choice',
    type: 'list',
    choices: ['VIEW', 'ADD', 'UPDATE', 'EXIT'],
    message:
      '\nWould you like to [VIEW], [ADD] to, [UPDATE] the Employee Database, or [EXIT]?\n'
  });

  switch (choice) {
    case 'VIEW':
      return viewQueries();
    case 'ADD':
      return addToTables();
    case 'UPDATE':
      return updateEmployees();
    case 'EXIT':
      quit();
  }
}
// user selects to View queries of current database
async function viewQueries() {
  let { viewBy } = await prompt([
    {
      name: 'viewBy',
      type: 'rawlist',
      choices: ['DEPARTMENT', 'ROLE', 'ALL EMPLOYEES', 'MANAGER', 'BACK'],
      message: '\nWould you like to View Employees by [DEPARMENT], [ROLE], [MANAGER] or View [ALL EMPLOYEES], or go [BACK] a step?'
    }
  ]);
  // different ways user can View Employees
  switch (viewBy) {
    case 'DEPARTMENT':
      return viewDepartments();
    case 'ROLE':
      return viewRoles();
    case 'ALL EMPLOYEES':
      return viewEmployees();
    case 'MANAGER':
      return viewByManager();
    case 'BACK':
      mainPrompts(); // return to main menu
  }
}
// user selects to View Employees by Departments
async function viewDepartments() {
  const departments = await db.getAllDepartments();
  let { department } = await prompt([
    {
      name: 'department',
      type: 'rawlist',
      // .map method puts all relevant choices into an array
      choices: departments.map(department => department.name),
      message: '\nWithin which Department would you like to View Employees?'
    }
  ]);
  // checks if Department has any employees for user convenience
  const employeesbyDept = await db.viewDepartment(department);
  if (employeesbyDept == '') {
    console.log('\n This Department has no Employees.\n');
    mainPrompts();
  }
  else {
    console.log('\n');
    console.table(employeesbyDept);
    mainPrompts();
  }
}
// views all Roles and Employees in those Roles
async function viewRoles() {
  const roles = await db.getAllRoles();
  let { role } = await prompt([
    {
      name: 'role',
      type: 'rawlist',
      choices: roles.map(role => role.title),
      message: '\nWithin which Role would you like to View Employees?'
    }
  ]);
  const employeesbyRole = await db.viewRole(role);
  if (employeesbyRole == '') {
    console.log('\n');
    const roleTable = await db.getThisRole(role);
    console.table(roleTable);
    console.log('\n No Employee is filling this Role.\n');
    mainPrompts();
  }
  else {
    console.log('\n');
    console.table(employeesbyRole);
    mainPrompts();
  }
}
// builds a new Table showing all Employee information
async function viewEmployees() {
  const employee = await db.getAllEmployees();
  console.log('\n');
  console.table(employee);
  mainPrompts();
}
// views Employees grouped by who manages them
async function viewByManager() {
  const managers = await db.getAllManagers();
  console.table(managers);
  let { manager } = await prompt([
    {
      name: 'manager',
      type: 'rawlist',
      choices: managers.map(manager => manager.Name),
      message: '\nWhich Manager would you like to see the Employees of?'
    }
  ]);
  // getting table of Employee info grouped by common Manager
  const employeesByManagerRes = await db.getAllEmployeesByManager(manager);
  console.log('\n');
  console.table(employeesByManagerRes);
  mainPrompts();
}
// menu option to Add to the different tables
async function addToTables() {
  let { table } = await prompt([
    {
      name: 'table',
      type: 'rawlist',
      choices: ['DEPARTMENTS', 'ROLES', 'EMPLOYEES', 'BACK'],
      message: 'Would you like to Add to the [DEPARMENTS], [ROLES] or [EMPLOYEES] Table, or go [BACK] a step?'
    }
  ]);
  switch (table) {
    case 'DEPARTMENTS':
      return addToDepartments();
    case 'ROLES':
      return addToRoles();
    case 'EMPLOYEES':
      return addToEmployees();
    case 'BACK':
      mainPrompts();
  }
}
// user can add new Department
async function addToDepartments() {
  let { name } = await prompt(
    [
      {
        name: 'name',
        type: 'input',
        message: '\nWhat is the Name of the new Department?',
      }
    ]);
  await db.addNewDepartment(name);
  console.log('\nYour Department was created successfully.');
  mainPrompts();
}
// user can add new employee Role
async function addToRoles() {
  const departments = await db.getAllDepartments();
  let { title, salary, department } = await prompt([
    {
      name: 'title',
      type: 'input',
      message: '\nWhat is the Title of the new Role?'
    },
    {
      name: 'salary',
      type: 'number',
      message: 'What is the Salary of the new Role? (Enter an Integer only.)',
      // validate package used to ensure input is an integer
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: 'department',
      type: 'rawlist',
      choices: departments.map(department => department.name),
      message: 'What is the Department of the new Role?'
    }
  ])
  // pull Department ID to use as an argument later
  const departmentRes = await db.getDepartmentIDByDepartment(department);
  const department_id = departmentRes[0].id; //pulls value from returned Object of SQL data
  await db.addNewRole(title, salary, department_id);
  // get strings to print to console for user
  const newRole = await db.getThisRole(title);
  console.log(`\nYour Role of ${title} was created successfully:\n`);
  console.table(newRole);
  mainPrompts();
}
// add new Employee
async function addToEmployees() {
  const roles = await db.getAllRoles();
  const employees = await db.whoIsEmployee();
  const managerChoices = employees.map(employee => employee.first_name + ' ' + employee.last_name);
  // pushing choice for no manager into choices array
  managerChoices.push('[NONE]');
  let { first_name, last_name, role, manager } = await prompt([
    {
      name: 'first_name',
      type: 'input',
      message: '\nWhat is the First Name of the new Employee?'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'What is the Last Name of the new Employee?'
    },
    {
      name: 'role',
      type: 'rawlist',
      choices: roles.map(role => role.title),
      message: 'What is the Role of the new Employee?',
    },
    {
      name: 'manager',
      type: 'rawlist',
      choices: managerChoices,
      message: 'Who will be the Manager of the new Employee?\n (If they are not managed, select [NONE])'
    }
  ]);
  // pull role_id for future argument
  const roleResponse = await db.getRoleIDByTitle(role);
  const role_id = roleResponse[0].id;
  let manager_id = null;
  // if there is no manager for new Employee
  if (manager !== '[NONE]') {
    const managerResponse = await db.getManagerIDByEmployee(manager);
    manager_id = managerResponse[0].id;
  };
  await db.addNewEmployee(first_name, last_name, role_id, manager_id);
  console.log(`\nYour Employee ${first_name} ${last_name} was created successfully.\n`);
  mainPrompts();
}
// update Role of an Employee
async function updateEmployees() {
  const employees = await db.whoIsEmployee();
  const roles = await db.getAllRoles();
  console.log('\n');
  // to show all Employees to user
  const employeeTable = await db.getAllEmployees();
  console.table(employeeTable);
  let { employee, newRole } = await prompt([
    {
      name: 'employee',
      type: 'rawlist',
      choices: employees.map(employee => employee.first_name + ' ' + employee.last_name),
      message: 'Which Employee would you like to Update?'
    },
    {
      name: 'newRole',
      type: 'rawlist',
      choices: roles.map(role => role.title),
      message: `\nWhich Role would you like to assign?`
    }
  ]);
  const employeeRes = await db.getEmployeeIDByEmployeeName(employee);
  let employee_id = employeeRes[0].id;
  const roleRes = await db.getRoleIDByTitle(newRole);
  let role_id = roleRes[0].id;
  // update Role of Employee
  await db.updateEmployee(employee_id, role_id);
  console.log(`\nYour Employee ${employee} has been promoted to ${newRole}:\n`);
  // show table info of new Role for user convenience
  console.table(await db.getThisRole(newRole));
  mainPrompts();
}
// quit the application
function quit() {
  console.log('\nThank you for your service to Evil Corp.');
  process.exit();
}
