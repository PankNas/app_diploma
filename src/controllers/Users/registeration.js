import MemberModel from '../../models/Users/Member.js';
import ModeratorModel from '../../models/Users/Moderator.js';
import AdmModel from '../../models/Users/Adm.js';

import {findCodeAdm, findCodeModerator} from "./AccessCodeController.js";

export const registerMember = async (request, passHash) =>
  new MemberModel({
    email: request.body.email,
    role: 'member',
    fullName: request.body.fullName,
    avatarUrl: request.body.avatarUrl,
    passwordHash: passHash,
  });

export const registerModerator = async (request, passHash) => {
  const code = await findCodeModerator(request.body.codeAccess)

  if (!code) throw new Error('Неверный код доступа');

  return new ModeratorModel({
    email: request.body.email,
    role: 'moderator',
    fullName: request.body.fullName,
    avatarUrl: request.body.avatarUrl,
    passwordHash: passHash,
    codeAccess: request.body.codeAccess,
  });
}

export const registerAdm = async (request, passHash) => {
  const code = await findCodeAdm(request.body.codeAccess)

  if (!code) throw new Error('Неверный код доступа');

  return new AdmModel({
    email: request.body.email,
    role: 'adm',
    fullName: request.body.fullName,
    avatarUrl: request.body.avatarUrl,
    passwordHash: passHash,
    codeAccess: request.body.codeAccess,
  });
}
