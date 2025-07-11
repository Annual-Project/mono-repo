import prisma from "../config/db.js";

import AuthUtils from "../../../shared/utils/AuthUtils.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import RolesStore from "../../../shared/stores/RolesStore.js";
import PermissionsStore from "../../../shared/stores/PermissionsStore.js";

class AuthService {

  static async signup(email) {
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userFound) {
      throw new BadRequestError('Email already in use');
    }

    const salt = AuthUtils.generateSalt(16, 'hex');

    const user = await prisma.user.create({
      data: {
        email,
        salt,
      },
    });

    if (!user) {
      throw new InternalServerError('Internal error during signup');
    }

    // Generation du challenge avec une durée de 5 minutes
    const { challenge, signature } = AuthUtils.generateSignedChallenge();

    if (!challenge || !signature) {
      throw new InternalServerError('Error generating challenge during signup');
    }

    return {
      salt,
      pow: {
        challenge,
        signature,
        difficulty: process.env.CHA_DIFF,
      },
    };
  }

  static async signupValidate(body, ip, userAgent) {
    if (!ip || !userAgent) {
      throw new BadRequestError('IP address or User-Agent header is missing');
    }

    const userFound = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    // Verification du challenge avec la signature
    const signedChallenge = AuthUtils.verifySignedChallenge(body.challenge, body.signature);

    if (!signedChallenge) {
      throw new ForbiddenError('Invalid challenge or signature');
    }

    // Verification de la preuve de travail (proof)
    const proofVerify = AuthUtils.verifyProofOfChallenge(body.challenge, body.proof);

    if (!proofVerify) {
      throw new ForbiddenError('Invalid proof of challenge');
    }

    const { accessToken, refreshToken } = AuthUtils.generateJWTTokens({
      sub: userFound.id,
      fingerprint: {
        ip,
        userAgent,
      },
    });

    const userFoundAgain = await prisma.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        password: body.hashPassword,
        accessToken,
        refreshToken,
      },
    });

    if (!userFoundAgain) {
      throw new InternalServerError('Error during user update after signup validation');
    }

    const userPermissions = await prisma.permission.findMany({
      where: {
        users: {
          some: {
            userId: userFound.id,
          },
        },
      },
      select: {
        name: true,
      },
    });

    const userRoles = await prisma.role.findMany({
      where: {
        users: {
          some: {
            userId: userFound.id,
          },
        },
      },
      select: {
        name: true,
      },
    });

    await PermissionsStore.setPermissions(userFound.id, userPermissions.map(p => p.name));
    await RolesStore.setRoles(userFound.id, userRoles.map(r => r.name));

    // debugging logs
    console.log('Roles:', await RolesStore.getRoles(userFound.id));
    console.log('Permissions:', await PermissionsStore.getPermissions(userFound.id));

    return { accessToken, refreshToken };
  }

  static async signin(email) {
    const userFound = await prisma.user.findUnique({
      where: {
        email,
        isActive: true,
      },
    });

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    // Generation du challenge avec une duree de 5 minutes
    const { challenge, signature } = AuthUtils.generateSignedChallenge();

    if (!challenge || !signature) {
      throw new InternalServerError('Error generating challenge during signin');
    }

    return {
      salt: userFound.salt,
      pow: {
        challenge,
        signature,
        difficulty: process.env.CHA_DIFF,
      },
    };
  }

  static async signinValidate(body, ip, userAgent) {
    if (!ip || !userAgent) {
      throw new BadRequestError('IP address or User-Agent header is missing');
    }

    const userFound = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    const { id, salt, password } = userFound;

    if (!salt) {
      throw new NotFoundError('User not found or salt missing');
    }

    if (password !== body.hashPassword) {
      throw new ForbiddenError('Invalid password');
    }

    // Verification du challenge avec la signature
    const signedChallenge = AuthUtils.verifySignedChallenge(body.challenge, body.signature);

    if (!signedChallenge) {
      throw new ForbiddenError('Invalid challenge or signature');
    }

    // Verification de la preuve de travail (proof)
    const proofVerify = AuthUtils.verifyProofOfChallenge(body.challenge, body.proof);

    if (!proofVerify) {
      throw new ForbiddenError('Invalid proof of challenge');
    }

    const { accessToken, refreshToken } = AuthUtils.generateJWTTokens({
      sub: id,
      fingerprint: {
        ip,
        userAgent,
      },
    });

    const userFoundAgain = await prisma.user.update({
      where: {
        id,
      },
      data: {
        accessToken,
        refreshToken,
      },
    });

    if (!userFoundAgain) {
      throw new InternalServerError('Error during user update after signin validation');
    }

    const userPermissions = await prisma.permission.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
      },
      select: {
        name: true,
      },
    });

    const userRoles = await prisma.role.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
      },
      select: {
        name: true,
      },
    });

    await PermissionsStore.setPermissions(userFound.id, userPermissions.map(p => p.name));
    await RolesStore.setRoles(userFound.id, userRoles.map(r => r.name));

    // debugging logs
    console.log('Roles:', await RolesStore.getRoles(userFound.id));
    console.log('Permissions:', await PermissionsStore.getPermissions(userFound.id));

    return { accessToken, refreshToken };
  }

  static async logout(userId) {
    if (!userId) return;

    await RolesStore.clearUserCache(userId);
    await PermissionsStore.clearUserCache(userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: null,
        refreshToken: null,
      },
    });
  }

  static async generate(auth) {
    if (!auth) {
      throw new ForbiddenError('Authentication required');
    }

    const { userId } = auth;
    const { accessToken, refreshToken } = AuthUtils.generateJWTTokens({
      sub: userId,
      fingerprint: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const userFoundAgain = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        accessToken,
        refreshToken,
      },
    });

    if (!userFoundAgain) {
      throw new InternalServerError('Error during user update after token generation');
    }

    return { accessToken, refreshToken };
  }

  static async changePassword(
    {
      email, hashOldPassword, hashNewPassword, hashNewConfirmPassword,
      newSalt, signature, challenge, proof
    },
    ip, userAgent
  ) {
    if (!ip || !userAgent) {
      throw new BadRequestError('IP address or User-Agent header is missing');
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (hashOldPassword !== user.password) {
      throw new ForbiddenError('Old password does not match');
    }

    if (hashNewPassword !== hashNewConfirmPassword) {
      throw new BadRequestError('New password and confirmation do not match');
    }

    // Verification du challenge avec la signature
    const signedChallenge = AuthUtils.verifySignedChallenge(challenge, signature);

    if (!signedChallenge) {
      throw new ForbiddenError('Invalid challenge or signature');
    }

    // Verification de la preuve de travail (proof)
    const proofVerify = AuthUtils.verifyProofOfChallenge(challenge, proof);

    if (!proofVerify) {
      throw new ForbiddenError('Invalid proof of challenge');
    }

    const { accessToken, refreshToken } = AuthUtils.generateJWTTokens({
      sub: user.id,
      fingerprint: {
        ip,
        userAgent,
      },
    });

    const newUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashNewPassword,
        salt: newSalt,
        accessToken,
        refreshToken,
      },
    });

    if (!newUser) {
      throw new InternalServerError('Error updating user password');
    }

    return { accessToken, refreshToken };
  }

};

export default AuthService;
