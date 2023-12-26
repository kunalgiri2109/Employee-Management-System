exports.up = function(knex) {
    return knex.schema.alterTable('employees', function(table) {
      table.renameColumn('deptName', 'department');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('employees', function(table) {
      table.renameColumn('deptName', 'department');
    });
  };
  