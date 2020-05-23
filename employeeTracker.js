const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Tracker" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
    const { choice } = await prompt({
      name: "choice",
      type: "list",
      message:
        "\nWould you like to [VIEW], [ADD] to, [UPDATE] the Employee Database, or [EXIT]?\n",
      choices: ["VIEW", "ADD", "UPDATE", "EXIT"],
    });
  
    switch (choice) {
      case "VIEW":
        return viewTables();
      case "ADD":
        return addToTables();
      case "UPDATE":
        return updateEmployees();
      case "EXIT":
        quit();
    }
  }

  function quit() {
    console.log("\nThank you for your service to Evil Corp.");
    process.exit();
  }
  