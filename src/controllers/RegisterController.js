const { request } = require('http');
const connection = require('../database/connection');
const tableName = 'register';
const crypto = require('crypto');

const Perfil = ['adm', 'musico', 'geral'];

module.exports = {
  async add(request, response) {
    // const dot_id = request.headers.authorization;

    const { name, email, whatsapp, perfil } = request.body;

    const created = new Date();
    const modified = new Date();
    const chave = crypto.randomBytes(6).toString('HEX');

    const [id] = await connection(tableName).insert({
      name,
      email,
      whatsapp,
      chave,
      perfil,
      created,
      modified,
    });
    if (id) {
      return response.json(chave);
    } else {
      return response.json({ error: 'Não foi possivel realizar o registro' });
    }
  },

  async upDate(request, response) {
    // const dot_id = request.headers.authorization;
    const idUser = request.params.id;
    const { name, email, whatsapp } = request.body;

    const tableItem = await connection(tableName)
      .select('*')
      .where('id', Number(idUser))
      .first();

    const modified = new Date();

    if (tableItem) {
      const id = await connection(tableName).where('id', idUser).update({
        name,
        email,
        whatsapp,
        perfil: tableItem.perfil,
        chave: tableItem.chave,
        created: tableItem.created,
        modified,
      });

      const register = await connection(tableName)
        .select('*')
        .where('id', Number(id))
        .first();

      return response.json({ register });
    } else {
      return response.json({ error: 'Não foi possivel realizar a alteração' });
    }
  },

  async all(request, response) {
    //  const dot_id = request.headers.authorization;

    const tableItens = await connection(tableName).select('*');

    return response.json(tableItens);
  },

  async loginConfirm(request, response) {
    const { chave } = request.body;
    const user = JSON.parse(request.headers.authorization);

    const tableItens = await connection(tableName)
      .select('*')
      .where('chave', chave)
      .first();

    if (!tableItens || chave != user.chave) {
      return response.json({
        error: 'Chave incorreta',
      });
    } else {
      if (tableItens.perfil === 0) {
        return response.json({ ...tableItens });
      }
      return response.json({
        id: tableItens.id,
        name: tableItens.name,
        email: tableItens.email,
        whatsapp: tableItens.whatsapp,
      });
    }
  },
  async login(request, response) {
    const { chave } = request.body;
    // const user_id = request.headers.authorization;

    const tableItens = await connection(tableName)
      .select('*')
      .where('chave', chave)
      .first();

    if (!tableItens) {
      return response.json({
        error: 'Não ha registro para os parametros informados',
      });
    } else {
      if (tableItens.perfil === 0) {
        return response.json(tableItens);
      } else {
        return response.json({
          id: tableItens.id,
          name: tableItens.name,
          email: tableItens.email,
          whatsapp: tableItens.whatsapp,
        });
      }
    }
  },
  async index(request, response) {
    //  const dot_id = request.headers.authorization;
    const user = request.params;

    const tableItens = await connection(tableName)
      .select('*')
      .where('id', user.id)
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
};
