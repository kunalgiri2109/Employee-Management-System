// In the migration file (e.g., 20220101000000_create_departments_table.js)

exports.up = function (knex) {
    return knex.schema.createTable('departments', function (table) {
      table.increments('deptId').primary();
      table.string('deptName').notNullable(); // Department name, not nullable
      table.text('description');
      table.timestamps(true, true); 
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('departments');
  };
  