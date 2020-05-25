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
      choices: ['DEPARTMENT', 'ROLE', 'ALL EMPLOYEES', 'BACK'],
      message: '\nWould you like to View Employees by [DEPARMENT], [ROLE] or View [ALL EMPLOYEES], or go [BACK] a step?'
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
    case 'BACK':
      mainPrompts();
  }
}
// user selects to View Employees by Departments
async function viewDepartments() {
  const departments = await db.getAllDepartments();

  let { department } = await prompt([
    {
      name: 'department',
      type: 'rawlist',
      choices: departments.map(department => department.name),
      message: '\nWithin which Department would you like to View Employees?'
    }
  ]);

  const employeesbyDept = await db.viewDepartment(department.toString());
  if (employeesbyDept == '') {
    console.log('\n This Department has no Employees.');
    mainPrompts();
  }
  else {
    console.log('\n');
    console.table(employeesbyDept);
    mainPrompts();
  }
}

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

  const employeesbyRole = await db.viewRole(role.toString());
  if (employeesbyRole == '') {
    console.log('\n');
    const roleTable = await db.getThisRole(role.toString());
    console.table(roleTable);
    console.log('\n No Employee is filling this Role.');
    mainPrompts();
  }
  else {
    console.log('\n');
    console.table(employeesbyRole);
    mainPrompts();
  }
}

async function viewEmployees() {
  const employee = await db.getAllEmployees();

  console.log('\n');

  console.table(employee);

  mainPrompts();
}

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

  console.log('\nYour Department was created successfully!');
  mainPrompts();
}

async function addToRoles() {
  const departments = await db.getAllDepartments();

  let { title, salary, department } = await prompt(
    [
      {
        name: 'title',
        type: 'input',
        message: '\nWhat is the Title of the new Role?'
      },
      {
        name: 'salary',
        type: 'number',
        message: 'What is the Salary of the new Role? (Enter an Interger only.)',
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

  const departmentRes = await db.getDepartmentIDByDepartment(department.toString());
  const department_id = departmentRes[0].id;
  await db.addNewRole(title, salary, department_id);
  const newRole = await db.getThisRole(title);
  console.log(`\nYour Role of ${title} was created successfully:\n`);
  console.table(newRole);
  mainPrompts();
}

async function addToEmployees() {
  const roles = await db.getAllRoles();
  const employees = await db.whoIsManager();
  let { first_name, last_name, role, manager } = await prompt(
    [
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
        choices: employees.map(employee => employee.first_name + ' ' + employee.last_name),
        message: 'Who will be the Manager of the new Employee?\n (If none, leave blank and press Enter)'
      }
    ],
  );

  const roleResponse = await db.getRoleIDByTitle(role);
  const role_id = roleResponse[0].id;
  const managerResponse = await db.getManagerIDByEmployee(manager);
  const manager_id = managerResponse[0].id;

  await db.addNewEmployee(first_name, last_name, role_id, manager_id);

  console.log(`\nYour Employee ${first_name} ${last_name} was created successfully!\n`);
  mainPrompts();
}

function quit() {
  console.log('\nThank you for your service to Evil Corp.');
  process.exit();
}
