exports.up = function (knex) {
  return knex.schema.createTable('register', function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('whatsapp', 255).notNullable();
    table.integer('perfil', 1).notNullable();
    table.string('chave', 255).notNullable();
    table.date('created').notNullable();
    table.date('modified').notNullable();
  });
};
exports.down = function (knex) {
  knex.schema.dropTable('register');
};
