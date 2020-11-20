exports.up = function (knex) {
  return knex.schema.createTable('file', function (table) {
    table.increments('id').primary();
    table.string('fieldname', 255).notNullable();
    table.string('originalname', 255).notNullable();
    table.string('encoding', 255).notNullable();
    table.string('mimetype', 255).notNullable();
    table.string('key', 255).notNullable();
    table.integer('activated', 1).notNullable();
    table.string('destination', 255).notNullable();
    table.string('filename', 255).notNullable();
    table.string('path', 255).notNullable();
    table.string('size', 255).notNullable();
    table.date('created').notNullable();
    table.date('modified').notNullable();
  });
};
exports.down = function (knex) {
  knex.schema.dropTable('file');
};
