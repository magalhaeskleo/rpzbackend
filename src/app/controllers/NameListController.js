const connection = require('../../database/connection');
const tableName = 'name_for_list';
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

async function getRegister(id) {
  const register = await connection(tableName)
    .join('register', 'name_for_list.idRegister', 'register.id')
    .where('idShow', id);

  return register;
}

module.exports = {
  async add(request, response) {
    const { idRegister, idShow } = request.body;

    const created = new Date();
    const modified = new Date();

    const tableItem = await connection(tableName)
      .select('*')
      .where('idShow', Number(idShow))
      .where('idRegister', Number(idRegister))
      .first();

    if (!tableItem) {
      const [id] = await connection(tableName).insert({
        idShow,
        idRegister,
        created,
        modified,
      });
      return response.json({ id });
    } else {
      const tableRegister = await connection('register')
        .select('*')
        .where('id', idRegister)
        .first();
      const { name } = tableRegister;

      return response.json({ name });
    }
  },

  async index(request, response) {
    const { idRegister, idShow } = request.body;

    const tableItem = await connection(tableName)
      .select('*')
      .where('idShow', idShow)
      .where('idRegister', idRegister)
      .first();

    return response.json(tableItem);
  },

  async allForUser(request, response) {
    const { id } = request.params;

    const tableItem = await connection(tableName)
      .join('show', 'name_for_list.idShow', 'show.id')
      .join('file', 'show.flyer', 'file.id')
      .select('show.id', 'file.path', 'show.date', 'show.name')
      .where('idRegister', Number(id))
      .orderBy('show.date', 'asc');

    const newTable = [];

    tableItem.forEach((element) => {
      let day = new Date(element.date);
      let dayFormat = dateFormat(day, 'dd/mm/yyyy');
      let dayWeek = dayWeekList[day.getDay()];

      let newElement = {
        id: element.id,
        name: element.name,
        path: element.path,
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
    const myListEvents = await connection(tableName)
      .join('show', 'name_for_list.idShow', 'show.id')
      .join('file', 'show.flyer', 'file.id')
      .select('show.id', 'file.path', 'show.date', 'show.name')
      .groupBy('name_for_list.idShow')
      .orderBy('show.date', 'asc');

    const newTable = [];
    for (let index = 0; index < myListEvents.length; index++) {
      const element = myListEvents[index];

      const registers = await getRegister(element.id);

      let day = new Date(element.date);
      let dayFormat = dateFormat(day, 'dd/mm/yyyy');
      let dayWeek = dayWeekList[day.getDay()];

      let buff = fs.readFileSync(element.path);
      let base64data = buff.toString('base64');

      newTable.push({
        ...element,
        registers,
        date: `${dayWeek} ${dayFormat}`,
        base64data,
      });
    }

    return response.json(newTable);
  },
};
