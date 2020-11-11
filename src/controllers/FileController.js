const connection = require('../database/connection');
const tableName = 'file';

module.exports = {
  async all(request, response) {
    //  const dot_id = request.headers.authorization;

    const tableItens = await connection(tableName).select('*');

    return response.json(tableItens);
  },
  async index(request, response) {
    //  const dot_id = request.headers.authorization;

    const { id } = request.params;
    const tableItens = await connection(tableName)
      .select('*')
      .where('id', id)
      .first();

    return response.json(tableItens);
  },
  async delete(request, response) {
    //  const dot_id = request.headers.authorization;

    const { id } = request.params;
    const tableIten = await connection(tableName)
      .select('*')
      .where('id', id)
      .first();

    if (tableIten) {
      await connection(tableName).where('id', id).delete();
      return response.json({ ok: 'Registro deletado com sucesso' });
    } else {
      return response.json({
        error: 'Registro não encontrado ou já foi excluido',
      });
    }
  },

  async add(request, response) {
    //  const dot_id = request.headers.authorization;

    const {
      fieldname,
      originalname,
      encoding,
      mimetype,
      key,
      destination,
      filename,
      path,
      size,
    } = await request.file;

    const created = new Date();
    const modified = new Date();
    const [id] = await connection(tableName).insert({
      fieldname,
      originalname,
      encoding,
      mimetype,
      key,
      destination,
      filename,
      path,
      size,
      created,
      modified,
    });

    return response.json({ id });
  },
};
