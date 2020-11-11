const connection = require('../database/connection');
const tableName = 'music_request';
const fs = require('fs');
var dateFormat = require('dateformat');
const { table } = require('console');

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
async function getMusic(idShow, id) {
  const musicList = await connection(tableName)
    .select('*')
    .where('idShow', idShow)
    .where('idRegister', id);

  const newListFormat = [];

  musicList.forEach((element) => {
    const { id, music, obs, artist } = element;
    newListFormat.push({ id, music, obs, artist });
  });

  return newListFormat;
}
async function getMusicAll(idShow) {
  const musicList = await connection(tableName)
    .select('*')
    .where('idShow', idShow);

  const newListFormat = [];

  musicList.forEach((element) => {
    const { id, music, obs, artist } = element;
    newListFormat.push({ id, music, obs, artist });
  });

  return newListFormat;
}

module.exports = {
  async add(request, response) {
    const { music, artist, idRegister, idShow, obs } = request.body;
    // const user_id = request.headers.authorization;

    const created = new Date();
    const modified = new Date();

    const [id] = await connection(tableName).insert({
      music,
      artist,
      idShow,
      idRegister,
      obs,
      created,
      modified,
    });

    return response.json({ id });
  },

  async allForUser(request, response) {
    const { id } = request.params;

    const myListEvents = await connection(tableName)
      .join('show', 'music_request.idShow', 'show.id')
      .join('file', 'show.flyer', 'file.id')
      .select(
        'music_request.id',
        'music_request.idShow',
        'music_request.idRegister',
        'show.date',
        'show.name',
        'file.path'
      )
      .where('idRegister', Number(id))
      .groupBy('music_request.idShow');

    const newTable = [];

    for (let index = 0; index < myListEvents.length; index++) {
      const element = myListEvents[index];

      const musicList = await getMusic(element.idShow, id);

      let day = dateFormat(new Date(element.date), 'dd/mm');
      let dayWeek = dateFormatWeek(
        dateFormat(new Date(element.date), 'dddd').toString()
      );

      let buff = fs.readFileSync(element.path);
      let base64data = buff.toString('base64');

      newTable.push({
        ...element,
        musicList,
        date: `${dayWeek} ${day}`,
        base64data,
      });
    }
    return response.json(newTable);
  },

  async all(request, response) {
    //  const dot_id = request.headers.authorization;

    const myListEvents = await connection(tableName)
      .join('show', 'music_request.idShow', 'show.id')
      .join('file', 'show.flyer', 'file.id')
      .join('register', 'music_request.idRegister', 'register.id')
      .select(
        'music_request.id',
        'music_request.idShow',
        { nameRegister: 'register.name' },
        'show.date',
        'show.name',
        'file.path'
      )
      .groupBy('music_request.idShow');

    const newTable = [];

    for (let index = 0; index < myListEvents.length; index++) {
      const element = myListEvents[index];

      const musicList = await getMusicAll(element.idShow);

      let day = dateFormat(new Date(element.date), 'dd/mm');
      let dayWeek = dateFormatWeek(
        dateFormat(new Date(element.date), 'dddd').toString()
      );

      let buff = fs.readFileSync(element.path);
      let base64data = buff.toString('base64');

      newTable.push({
        ...element,
        musicList,
        date: `${dayWeek} ${day}`,
        base64data,
      });
    }
    return response.json(newTable);
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
};
