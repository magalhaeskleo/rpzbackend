const connection = require('../../database/connection');
const tableName = 'file';
const fs = require('fs');

module.exports = {
  async fileSimpleList(req, res) {
    const tableItens = await connection(tableName)
      // .limit(5)
      // .offset((Number(page) - 1) * 5)
      .select('*')
      .where('activated', 0);

    const newTable = [];

    tableItens.forEach((item) => {
      newTable.push({
        id: item.id,
        originalname: item.originalname.split('.')[0],
      });
    });

    return res.json(newTable);
  },

  async all(request, response) {
    const { page } = request.query;

    const [count] = await connection(tableName).count().where('activated', 0);
    response.header('X-Total-Flyer-Count', count['count(*)']);

    const tableItens = await connection(tableName)
      .limit(5)
      .offset((Number(page) - 1) * 5)
      .select('*')
      .where('activated', 0);

    const newTable = [];

    tableItens.forEach((element) => {
      let buff = fs.readFileSync(element.path);
      let base64data = buff.toString('base64');
      newTable.push({
        base64data,
        id: element.id,
        originalname: element.originalname.split('.')[0],
      });
    });

    return response.json(newTable);
  },
  async index(request, response) {
    const { id } = request.params;

    const tableItens = await connection(tableName)
      .select('*')
      .where('id', id)
      .first();

    let buff = fs.readFileSync(tableItens.path);
    let base64data = buff.toString('base64');

    return response.json({ id: tableItens.id, base64data });
  },

  async delete(request, response) {
    const { id } = request.params;

    const userExists = await connection(tableName)
      .select('*')
      .where('id', id)
      .first();

    if (!userExists) {
      return response.json({
        error: 'Registro não encontrado ou já foi excluido',
      });
    }
    const modified = new Date();

    const up = await connection(tableName)
      .where('id', id)
      .update({
        ...userExists,
        activated: 1,
        modified,
      });

    if (up) {
      return response.json({ ok: 'Registro deletado com sucesso' });
    }
  },

  async add(request, response) {
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
    const veio = await connection(tableName).insert({
      fieldname,
      originalname,
      encoding,
      mimetype,
      key,
      destination,
      filename,
      activated: 0,
      path,
      size,
      created,
      modified,
    });
    if (veio) {
      return response.json({ ok: 'Flyer encaminhado com sucesso' });
    } else {
      return response.json({ error: 'Não foi possivel registrar a operação' });
    }
  },
};
