const inquirer = require('inquirer');
const mysql = require('mysql2');
const { concat } = require('rxjs');

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Cupp@!T3aSQL",
      database: "employees",
    },
    console.log(`Connected to the employees database.`)
);

function viewAllDepartments() {
    db.connect(function (err) {
        if(err){
            throw err;
        }

        db.query(`SELECT * FROM department`,
        function(err, result) {
            if(err){
                throw err;
            }
            console.table(result);
        });
    });
}

function viewAllRoles() {
    db.connect(function (err) {
        if(err){
            throw err;
        }

        db.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id`,
        function(err, result) {
            if(err){
                throw err;
            }
            console.table(result);
        });
    })
}

function viewAllEmployees() {
    db.connect(function (err) {
        if(err){
            throw err;
        }

        db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
        role.title, role.salary, department.name AS department, 
        CONCAT(manager.first_name,' ', manager.last_name) AS manager_name FROM employee 
        JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id  
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`,
        function (err, result) {
            if(err){
                throw err;
            }
            console.table(result);
        });
    });
}

viewAllRoles();