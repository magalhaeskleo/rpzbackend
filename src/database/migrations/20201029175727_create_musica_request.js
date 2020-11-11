exports.up = function (knex) {
  return knex.schema.createTable('music_request', function (table) {
    table.increments('id').primary();
    table.string('music', 255).notNullable();
    table.string('artist', 255).notNullable();
    table.string('obs', 255).notNullable();

    // Foreign
    table.string('idShow', 255).notNullable();
    table.foreign('idShow').references('id').inTable('show');
    table.string('idRegister', 255).notNullable();
    table.foreign('idRegister').references('id').inTable('register');

    table.date('created').notNullable();
    table.date('modified').notNullable();
  });
};
exports.down = function (knex) {
  knex.schema.dropTable('music_request');
};
