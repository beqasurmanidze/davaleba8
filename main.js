const fetch = require("node-fetch");
const { Command } = require("commander");
const fs = require("fs");

const program = new Command();

program
  .command("weather-api <city>")
  .description("Fetch and display the temperature for a given city")
  .action(async (city) => {
    try {
      const apiKey = "895284fb2d2c50a520ea537456963d9c";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();

      if (data.main) {
        console.log(`The temperature in ${city} is ${data.main.temp}°C`);
      } else {
        console.log(`Could not fetch weather data for ${city}.`);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  });

// 2)
const expensesFile = "expenses.json";

function loadExpenses() {
  if (fs.existsSync(expensesFile)) {
    return JSON.parse(fs.readFileSync(expensesFile));
  }
  return [];
}

function saveExpenses(expenses) {
  fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
}

program
  .command("add-expense <description> <amount>")
  .description("Add a new expense")
  .action((description, amount) => {
    const expenses = loadExpenses();
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };
    expenses.push(newExpense);
    saveExpenses(expenses);
    console.log("Expense added successfully.");
  });

program
  .command("delete-expense <id>")
  .description("Delete an expense by ID")
  .action((id) => {
    let expenses = loadExpenses();
    expenses = expenses.filter((expense) => expense.id != id);
    saveExpenses(expenses);
    console.log("Expense deleted successfully.");
  });

program
  .command("show-expenses")
  .description("Show all expenses")
  .action(() => {
    const expenses = loadExpenses();
    if (expenses.length === 0) {
      console.log("No expenses found.");
    } else {
      console.log("Expenses:");
      expenses.forEach((expense) => {
        console.log(
          `ID: ${expense.id}, Description: ${expense.description}, Amount: ${expense.amount} GEL`
        );
      });
    }
  });

program.parse(process.argv);
