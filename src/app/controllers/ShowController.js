const connection = require('../../database/connection');
const tableName = 'show';
const fs = require('fs');

var dateFormat = require('dateformat');

const dayWeekList = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

module.exports = {
  async allFilter(request, response) {
    //  const dot_id = request.headers.authorization;

    const tableItens = await connection(tableName)
      .join('file', 'show.flyer', 'file.id')
      .select(
        'show.id',
        'show.date',
        'show.obs',
        'show.init',
        'show.soundCheck',
        'show.flyer',
        'show.name',
        'file.key',
        'file.originalname',
        'file.path',
        'show.created',
        'show.modified'
      );

    const newTable = [];

    tableItens.forEach((element) => {
      let day = new Date(element.date);
      let dayFormat = dateFormat(day, 'dd/mm/yyyy');
      let dayWeek = dayWeekList[day.getDay()];

      let newElement = {
        id: element.id,
        name: element.name,
        date: `${dayWeek} ${dayFormat}`,
      };

      newTable.push({ ...newElement });
    });

    return response.json(newTable);
  },
  async allAfterNow(request, response) {
    //  const dot_id = request.headers.authorization;
    const now = new Date();

    const { page } = request.query;

    const [count] = await connection(tableName)
      .where('show.date', '>=', now)
      .count();
    response.header('X-Total-Shows-Count', count['count(*)']);

    const tableItens = await connection(tableName)
      .join('file', 'show.flyer', 'file.id')
      .limit(5)
      .offset((Number(page) - 1) * 5)
      .select(
        'show.id',
        'show.date',
        'show.obs',
        'show.init',
        'show.soundCheck',
        'show.flyer',
        'show.name',
        'file.key',
        'file.originalname',
        'file.path',
        'show.created',
        'show.modified'
      )
      .where('show.date', '>=', now)
      .orderBy('show.date', 'asc');

    const newTable = [];

    tableItens.forEach((element) => {
      let day = new Date(element.date);
      let dayFormat = dateFormat(day, 'dd/mm/yyyy');
      let dayWeek = dayWeekList[day.getDay()];

      let newElement = {
        ...element,
        date: `${dayWeek} ${dayFormat}`,
      };

      let buff = fs.readFileSync(newElement.path);
      let base64data = buff.toString('base64');
      newTable.push({ ...newElement, base64data });
    });

    return response.json(newTable);
  },

  async all(request, response) {
    //  const dot_id = request.headers.authorization;

    const tableItens = await connection(tableName)
      .join('file', 'show.flyer', 'file.id')
      .select(
        'show.id',
        'show.date',
        'show.obs',
        'show.init',
        'show.soundCheck',
        'show.flyer',
        'show.name',
        'file.key',
        'file.originalname',
        'file.path',
        'show.created',
        'show.modified'
      )
      .orderBy('show.date', 'asc');

    const newTable = [];

    tableItens.forEach((element) => {
      let day = new Date(element.date);
      let dayFormat = dateFormat(day, 'dd/mm/yyyy');
      let dayWeek = dayWeekList[day.getDay()];

      let newElement = {
        ...element,
        date: `${dayWeek} ${dayFormat}`,
      };

      let buff = fs.readFileSync(newElement.path);
      let base64data = buff.toString('base64');

      newTable.push({ ...newElement, base64data });
    });

    return response.json(newTable);
  },

  async index(request, response) {
    //  const dot_id = request.headers.authorization;
    const { id } = request.params;

    const tableItens = await connection(tableName)
      .join('file', 'show.flyer', 'file.id')
      .select(
        'show.id',
        'show.date',
        'show.obs',
        'show.init',
        'show.soundCheck',
        'show.flyer',
        'file.key',
        'file.originalname',
        'file.path',
        'show.created',
        'show.modified'
      )
      .where('show.id', id)
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

    let { dateShow, flyer, name, obs, init, soundCheck } = await request.body;

    const created = new Date();
    const modified = new Date();
    const date = new Date(dateShow);

    date.setHours(23, 55, 55);

    const [id] = await connection(tableName).insert({
      date,
      flyer,
      name,
      created,
      modified,
      obs,
      init,
      soundCheck,
    });

    return response.json({ id });
  },
};
