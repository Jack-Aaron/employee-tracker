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
      return viewTables();
    case 'ADD':
      return addToTables();
    case 'UPDATE':
      return updateEmployees();
    case 'EXIT':
      quit();
  }
}

async function viewTables() {
  let { table } = await prompt([
    {
      name: 'table',
      type: 'rawlist',
      choices: ['DEPARTMENTS', 'ROLES', 'EMPLOYEES', 'BACK'],
      message: '\nWould you like to View the [DEPARMENTS], [ROLES] or [EMPLOYEES] Table, or go [BACK] a step?'
    }
  ]);

  switch (table) {
    case 'DEPARTMENTS':
      return viewDepartments();
    case 'ROLES':
      return viewRoles();
    case 'EMPLOYEES':
      return viewEmployees();
    case 'BACK':
      mainPrompts();
  }
}

async function viewDepartments() {
  const department = await db.getAllDepartments();

  console.log('\n');

  console.table(department);

  mainPrompts();
}

async function viewRoles() {
  const role = await db.getAllRoles();

  console.log('\n');

  console.table(role);

  mainPrompts();
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
      message: '\nWould you like to Add to the [DEPARMENTS], [ROLES] or [EMPLOYEES] Table, or go [BACK] a step?'
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

function quit() {
  console.log('\nThank you for your service to Evil Corp.');
  process.exit();
}

// async function addToTables() {
//   let { table } = await prompt(
//     [
//       {
//         name: "item",
//         type: "input",
//         message: "\nWhat is the item you would like to submit?",
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "\nWhat category would you like to place your auction in?",
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "\nWhat would you like your starting bid to be?",
//         validate: function (value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         },
//       },
//     ],
//   );

//   await db.insertAuction(item, category, startingBid);

//   console.log("Your auction was created successfully!\n");
//   loadMainPrompts();
// }
