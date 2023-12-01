// create_personal_details.js

exports.up = function (knex) {
    return knex.schema.createTable('Personal_Details', (table) => {
      table.increments('pid').primary();
      table.integer('salary');
      table.specificType('skills', 'text[]');
      table.jsonb('full_address');
  
      // Add foreign key reference to employees table
      table.integer('employee_id').unsigned().references('id').inTable('employees');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('PersonalDetails');
  };
  