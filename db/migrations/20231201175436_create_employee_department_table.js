//Employee table

// 20231213120000_create_employees_table.js

exports.up = function (knex) {
    return knex.schema
    .createTable('departments', function (table) {
        table.increments('deptId');
        table.string('deptName').primary();
      })
    .createTable('employees', function (table) {
      table.increments('id').primary()
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('fullname').notNullable();
      table.string('password').notNullable();
      table.date('date_of_joining').notNullable();
      table.string('address').notNullable();  
      table.string('email').notNullable();
      table.boolean('is_permanent').defaultTo(false);
      // table.specificType('location', 'geometry');
      table.string('department_name').notNullable()
      .references('deptName').inTable('departments');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('employees')
    .dropTable("departments");
  };
  