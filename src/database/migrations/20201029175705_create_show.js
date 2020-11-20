exports.up = function (knex) {
  return knex.schema.createTable('show', function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('obs', 255).notNullable();
    table.string('init', 10).notNullable();
    table.string('soundCheck', 10).notNullable();
    table.date('date').notNullable();
    table.string('flyer', 255).notNullable();
    table.foreign('flyer').references('id').inTable('file');
    table.date('created').notNullable();
    table.date('modified').notNullable();
  });
};
exports.down = function (knex) {
  knex.schema.dropTable('show');
};
