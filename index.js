const inquirer = require('inquirer');
const mysql = require('mysql2');
const { start } = require('repl');

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "",
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
            optionsList();
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
            optionsList();
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
            optionsList();
        });
    });
}

function addDepartment() {
    db.connect(function (err) {
        if(err){
            throw err;
        }

        db.query(`SELECT * FROM department`,
        function(err, departments) {
            if(err){
                throw err;
            }

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the new department'
                }
            ]).then((answers) => {
                db.query(`INSERT INTO department(name) VALUES (?)`,
                [answers.name],
                function(err) {
                    if(err){
                        throw err;
                    }

                    console.log(`Successfully added ${answers.name} department to the database.`);
                    optionsList();
                })
            })
        })
    })
}

function addRole() {
    db.connect(function(err) {
        if(err){
            throw err;
        }

        db.query(`SELECT * FROM department`,
        function(err, departments) {
            if(err){
                throw err;
            }

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title of the new role'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the new role'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'What department does the new role belong to',
                    choices: departments.map((dep) => {
                        return {name: dep.name, value: dep.id}
                    })
                }
            ]).then((answers) => {
                db.query(`INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`,
                [answers.title, answers.salary, answers.department_id],
                function(err) {
                    if(err){
                        throw err;
                    }

                    console.log(`Successfully added ${answers.title} role to the database.`);
                    optionsList();
                })
            })
        })
    })
}

function addEmployee() {
    db.connect(function (err) {
        if(err){
            throw err;
        }

        db.query(`SELECT * FROM role`,
        function(err, roles) {
            if(err){
                throw err;
            }
            db.query(`SELECT * FROM employee`, 
            function(err, employees) {
                if(err){
                    throw err;
                }

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the new employees first name'
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the new employees last name'
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What is the new employees role',
                        choices: roles.map((role) => {
                            return {name: role.title, value: role.id};
                        })
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Who is the employees manager',
                        choices: employees.map((emp) => {
                            return {name: emp.first_name + ' ' + emp.last_name, 
                                value: emp.id};
                        })
                    },
                ]).then((answers) => {
                    db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                    [answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
                    function(err, result) {
                        if(err){
                            throw err;
                        }
                        console.log(`Successfully added ${answers.first_name} ${answers.last_name} to the database.`);
                        optionsList();
                    })
                })
            })
        })
    })
}

function optionsList() {
    inquirer.prompt([
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do',
        choices: [
            'View All Employees',
            'Add Employee',
            'View Roles',
            'Add Role',
            'View All Departments',
            'Add Departments',
            'Quit',
        ]
    }]).then((answers) => {
        switch (answers.choice) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'View Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Add Departments':
                addDepartment();
                break;
            default:
                console.log('Exiting app');
                break;
        }
    });
}

function startEmployeeTracker() {
    console.log("Starting Employee Tracker");
    optionsList();
}

startEmployeeTracker();