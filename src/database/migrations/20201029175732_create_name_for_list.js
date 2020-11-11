exports.up = function (knex) {
  return knex.schema.createTable('name_for_list', function (table) {
    table.increments('id').primary();
    table.string('idShow', 255).notNullable();
    table.foreign('idShow').references('id').inTable('show');
    table.string('idRegister').notNullable();
    table.foreign('idRegister').references('id').inTable('register');
    table.date('created').notNullable();
    table.date('modified').notNullable();
  });
};
exports.down = function (knex) {
  knex.schema.dropTable('name_for_list');
};
