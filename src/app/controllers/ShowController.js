const connection = require('../../database/connection');
const tableName = 'show';
const fs = require('fs');

var dateFormat = require('dateformat');

function dateFormatWeek(day) {
  if (day === 'Monday') {
    return 'Segunda';
  }
  if (day === 'Tuesday') {
    return 'Terça';
  }
  if (day === 'Wednesday') {
    return 'Quarta';
  }
  if (day === 'Thursday') {
    return 'Quinta';
  }
  if (day === 'Friday') {
    return 'Sexta';
  }
  if (day === 'Saturday') {
    return 'Sabado';
  }
  if (day === 'Sunday') {
    return 'Domingo';
  }
}

module.exports = {
  async allFilter(request, response) {
    //  const dot_id = request.headers.authorization;

    const tableItens = await connection(tableName)
      .join('file', 'show.flyer', 'file.id')
      .select(
        'show.id',
        'show.date',
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
      let day = dateFormat(new Date(element.date), 'dd/mm');
      let dayWeek = dateFormatWeek(
        dateFormat(new Date(element.date), 'dddd').toString()
      );

      let newElement = {
        id: element.id,
        name: element.name,
        date: `${dayWeek} ${day}`,
      };

      newTable.push({ ...newElement });
    });

    return response.json(newTable);
  },
  async allAfterNow(request, response) {
    //  const dot_id = request.headers.authorization;
    const now = new Date();
    const tableItens = await connection(tableName)
      .join('file', 'show.flyer', 'file.id')
      .select(
        'show.id',
        'show.date',
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
      let day = dateFormat(new Date(element.date), 'dd/mm');
      let dayWeek = dateFormatWeek(
        dateFormat(new Date(element.date), 'dddd').toString()
      );

      let newElement = {
        ...element,
        date: `${dayWeek} ${day}`,
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
        'show.flyer',
        'show.name',
        'file.key',
        'file.originalname',
        'file.path',
        'show.created',
        'show.modified'
      )
      .orderBy('show.date', 'desc');

    const newTable = [];

    tableItens.forEach((element) => {
      let day = dateFormat(new Date(element.date), 'dd/mm');
      let dayWeek = dateFormatWeek(
        dateFormat(new Date(element.date), 'dddd').toString()
      );

      let newElement = {
        ...element,
        date: `${dayWeek} ${day}`,
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

    let { dateShow, flyer, name } = await request.body;

    const day = dateShow.split('/')[0];
    const month = dateShow.split('/')[1];
    const yer = dateShow.split('/')[2];

    const created = new Date();
    const modified = new Date();

    const date = new Date(`${yer}-${month}-${day}`);

    const [id] = await connection(tableName).insert({
      date,
      flyer,
      name,
      created,
      modified,
    });

    return response.json({ id });
  },
};
