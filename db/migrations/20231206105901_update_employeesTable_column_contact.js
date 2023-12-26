exports.up = function(knex) {
    return knex.schema.alterTable('employees', function(table) {
      table.string('contact', 10).alter();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('employees', function(table) {
      table.string('contact').alter();
    });
  };
  