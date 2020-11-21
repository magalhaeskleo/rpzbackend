const connection = require('../../database/connection');
const tableName = 'register';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const handlebars = require('handlebars');
const mailer = require('../models/mailer');
const path = require('path');
const fs = require('fs');
const { use } = require('../models/mailer');
const { date } = require('yup');
const pathResolve = path.resolve('./src/html');
const source = fs.readFileSync(pathResolve + '/model.html', {
  encoding: 'utf-8',
});
const template = handlebars.compile(source);

const PERFIL = {
  adm: 0,
  musico: 1,
  geral: 3,
};

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}
async function getUser(email) {
  return await connection(tableName).select('*').where('email', email).first();
}

async function getUserForId(id) {
  return await connection(tableName).select('*').where('id', id).first();
}

function sendError(res, text) {
  return res.json({ error: text });
}

module.exports = {
  async add(req, res) {
    const { name, whatsapp, email, password } = req.body;
    const perfil = PERFIL.geral;

    try {
      const userExists = await getUser(email);

      if (userExists) {
        //'User already exists'
        return sendError(res, 'Este e-mail de usuário já esta cadastrado');
      }

      const created = new Date();
      const modified = new Date();

      const chave = await bcrypt.hash(password, 10);

      const [id] = await connection(tableName).insert({
        name,
        email,
        whatsapp,
        chave,
        perfil,
        created,
        modified,
      });

      const newUser = await getUserForId(id);

      if (newUser) {
        return res.json(getUserSimple(newUser));
      }
    } catch (error) {
      //'Registration failed'
      return sendError(res, 'Não foi possível realizar o registro');
    }
  },

  //*************************************************************** */

  async editPerfil(req, res) {
    const { perfilType } = req.body;
    const idUser = req.params.id;

    try {
      const userEdit = await getUserForId(idUser);
      const modified = new Date();

      await connection(tableName)
        .where('id', idUser)
        .update({
          ...userEdit,
          perfil: perfilType,
          modified,
        });

      const userUp = await getUserForId(idUser);

      const { id, name, email, whatsapp, perfil } = userUp;

      return res.json({ id, name, email, whatsapp, perfil });
    } catch (error) {
      return sendError(res, 'Operação não pode ser realizada tente mais tarde');
    }
  },

  async edit(req, res) {
    const { name, email, whatsapp, password } = req.body;
    const idUser = req.params.id;

    try {
      const userEdit = await getUserForId(idUser);

      const isTheKey = await bcrypt.compare(password, userEdit.chave);

      if (!isTheKey) {
        return sendError(res, 'Senha inválida');
      }

      if (email !== userEdit.email) {
        const userExists = await getUser(email);
        if (userExists) {
          return sendError(res, 'Usuário já cadastrado');
        }
      }
      const modified = new Date();

      await connection(tableName).where('id', idUser).update({
        name,
        email,
        whatsapp,
        perfil: userEdit.perfil,
        chave: userEdit.chave,
        created: userEdit.created,
        modified,
      });
      const userUp = await getUserForId(idUser);

      return res.json(getUserSimple(userUp));
    } catch (error) {
      return sendError(res, 'Operação não pode ser realizada tente mais tarde');
    }
  },

  //******************************************************************************** */
  async autentication(req, res) {
    const { email, password } = req.body;
    try {
      const userExists = await getUser(email);

      if (!userExists) {
        return sendError(res, 'Usuário não cadastrado');
      }
      const isTheKey = await bcrypt.compare(password, userExists.chave);

      if (!isTheKey) {
        return sendError(res, 'Senha inválida');
      }

      return res.json(getUserSimple(userExists));
    } catch (error) {
      return sendError(res, 'Operação não pode ser realizada tente mais tarde');
    }
  },

  //************************************************************************** */
  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const userExists = await getUser(email);

      if (!userExists) {
        return sendError(res, 'Usuário inexistente');
      }

      const token = crypto.randomBytes(20).toString('hex');
      const now = new Date();

      now.setHours(now.getHours() + 1);

      await connection(tableName)
        .where('id', userExists.id)
        .update({
          ...userExists,
          passwordReset: token,
          passwordResetExpires: now,
        });
      const agora = new Date();

      const optionsEmail = {
        to: 'magalhaeskleo@gmail.com',
        subject: `Recuperação de senha nova ${agora}`,
        html: template({ name: userExists.name, token: token }),
      };

      mailer.sendMail(optionsEmail, (err) => {
        if (err) {
          return sendError(
            res,
            'Não foi possivel encaminhar o senha para seu email de recuperação'
          );
        }
        return res.send({
          ok: 'Um email de recuperação foi encaminhado a sua caixa de mensagem',
        });
      });
    } catch (error) {
      return sendError(
        res,
        'Não foi possível recuperar a senha, tente novamente'
      );
    }
  },

  //************************************************************************* */
  async resetarPassWord(req, res) {
    const { token, email, password } = req.body;

    try {
      const userExists = await getUser(email);

      if (!userExists) {
        return sendError(res, 'Usuário inexistente');
      }

      if (token !== userExists.passwordReset) {
        return sendError(res, 'Token inválido');
      }

      const now = new Date();

      if (now > userExists.passwordResetExpires) {
        return sendError(
          res,
          'O Tempo para auteração expirou, solicite um novo token de recupeação'
        );
      }

      const modified = new Date();
      const chave = await bcrypt.hash(password, 10);

      await connection(tableName)
        .where('id', userExists.id)
        .update({
          ...userExists,
          chave,
          modified,
        });

      const userModify = await getUserForId(userExists.id);

      return res.json(getUserSimple(userModify));
    } catch (error) {
      return sendError(
        res,
        'Não foi possivel realizar o reset, tente novamente'
      );
    }
  },
  async delete(req, res) {
    const { id } = req.params.id;
    const userExist = getUserForId(id);

    if (userExist) {
      const ok = await connection(tableName).where('id', id).delete();
      return res.json({ ok: 'Show deletado com sucesso' });
    }
    {
      return endError(
        res,
        'Não foi possivel deletar o show tente novamente mais tarde'
      );
    }
  },
};

const getUserSimple = (form) => {
  const { id, name, email, whatsapp, perfil } = form;
  return {
    user: { id, name, email, whatsapp, perfil },
    token: generateToken({ id }),
  };
};
