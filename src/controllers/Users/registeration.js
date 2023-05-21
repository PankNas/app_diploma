import MemberModel from '../../models/Users/Member.js';
import ModeratorModel from '../../models/Users/Moderator.js';
import AdmModel from '../../models/Users/Adm.js';
import AccessCodeModel from "../../models/Users/AccessCode.js";

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
  const doc = new ModeratorModel({
    email: request.body.email,
    role: 'moderator',
    fullName: request.body.fullName,
    avatarUrl: request.body.avatarUrl,
    passwordHash: passHash,
    codeAccess: request.body.codeAccess,
  });

  await AccessCodeModel.updateOne(
    {},
    {user: doc}
  );

  return doc;
}

export const registerAdm = async (request, passHash) => {
  const access = await AccessCodeModel.findOne();

  const doc = new AdmModel({
    email: request.body.email,
    role: 'adm',
    fullName: request.body.fullName,
    avatarUrl: request.body.avatarUrl,
    passwordHash: passHash,
    codeAccess: request.body.codeAccess,
  });

  access.codeAdm.user = doc;
  await access.save();

  return doc;
}
