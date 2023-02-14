use employees;

INSERT INTO department (name)
VALUES ('Sales'), ('Gameplay'), ('Testing'), ('HR')

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Lead', 100000, 1),
    ('Sales person', 60000, 1),
    ('Lead Gameplay dev', 160000, 2),
    ('Gameplay dev', 100000, 2),
    ('Gameplay intern', 30000, 2),
    ('Testing Manager', 70000, 3),
    ('Tester', 45000, 3),
    ('HR Manager', 90000, 4),
    ('HR employee', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Mike', 'Smith', 1, NULL),
    ('Joe', 'Guy', 2, 1),
    ('John', 'Doe', 2, 1),
    ('Mort', 'Dog', 3, NULL),
    ('Sarah', 'Shaw', 4, 4),
    ('Sam', 'Man', 5, 4),
    ('Bridget', 'Mendler', 6, NULL),
    ('Will', 'Smith', 7, 7),
    ('Andrea', 'Brown', 8, NULL),
    ('Josh', 'Padilla', 9, 9);