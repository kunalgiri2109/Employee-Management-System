exports.up = function (knex) {
    // Create the employees table
    return knex.schema.createTable('employees', function (table) {
      table.increments('id').primary();
      table.string('fullname').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.integer('contact').notNullable();
      table.date('dateOfBirth');
      table.jsonb('address').notNullable();
      table.boolean('isPermanent').defaultTo(false);
      table.specificType('skills', 'text ARRAY');
      table.specificType('location', 'geometry');
      table.string('deptName').notNullable();
      table.integer('deptId').notNullable()
        .references('deptId').inTable('departments')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    // Drop the employees table and the trigger
    return knex.schema.dropTable('employees');
  };
  