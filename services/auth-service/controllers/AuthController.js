import prisma from "../config/db.js";
import AuthService from "../../../shared/services/AuthService.js";

import BadRequestError from '../exceptions/BadRequestError.js';
import ForbiddenError from '../exceptions/ForbiddenError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import InternalServerError from '../exceptions/InternalServerError.js';
import RolesStore from "../../../shared/stores/RolesStore.js";
import PermissionsStore from "../../../shared/stores/PermissionsStore.js";

class AuthController {

  static async signup(req, res) {

    const { email } = req.body;

    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userFound) {
      // Utilisation de BadRequestError pour indiquer une requête invalide
      throw new BadRequestError('Email already in use');
    }

    const salt = AuthService.generateSalt(16, 'hex');

    const user = await prisma.user.create({
      data: {
        email,
        salt,
      },
    });

    if (!user) {
      // Exception à définir : une exception spécifique pour les erreurs internes pourrait être utile
      throw new InternalServerError('Internal error during signup');
    }

    // Generation du challenge avec une duree de 5 minutes
    const { challenge, signature } = AuthService.generateSignedChallenge();

    if (!challenge || !signature) {
      throw new InternalServerError('Error generating challenge during signup');
    }

    return res.status(200).json({
      salt,
      pow: {
        challenge,
        signature,
        difficulty: process.env.CHA_DIFF,
      },
    });

  }

  static async signupValidate(req, res) {

    const body = req.body;

    const userFound = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    // Verification du challenge avec la signature
    const signedChallenge = AuthService.verifySignedChallenge(body.challenge, body.signature);

    if (!signedChallenge) {
      throw new ForbiddenError('Invalid challenge or signature');
    }

    // Verification de la preuve de travail (proof)
    const proofVerify = AuthService.verifyProofOfChallenge(body.challenge, body.proof);

    if (!proofVerify) {
      throw new ForbiddenError('Invalid proof of challenge');
    }

    const { accessToken, refreshToken } = AuthService.generateJWTTokens({
      sub: userFound.id,
      fingerprint: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.cookie('accessTokenM', `Bearer ${accessToken}`, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenM', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });

    const userFoundAgain = await prisma.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        password: body.hashPassword,
        accessToken,
        refreshToken,
      },
    });

    if (!userFoundAgain) {
      throw new InternalServerError('Error during user update after signup validation');
    }

    //! ======================================
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

    // console.log('User permissions:', userPermissions);
    // console.log('User roles:', userRoles);

    await PermissionsStore.setPermissions(userFound.id, userPermissions.map(p => p.name));
    await RolesStore.setRoles(userFound.id, userRoles.map(r => r.name));

    console.log('Roles:', await RolesStore.getRoles(userFound.id));
    console.log('Permissions:', await PermissionsStore.getPermissions(userFound.id));
    //! ======================================

    res.status(200).json({
      accessToken,
      refreshToken,
    });

  }

  static async verifyTokens (req, res) {

    if (!req.auth)
      return res.status(200).json({
        ok: false,
      });

    return res.status(200).json({
      ok: true,
    });

  }

  static async signin(req, res) {

    const { email } = req.body;

    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    // Generation du challenge avec une duree de 5 minutes
    const { challenge, signature } = AuthService.generateSignedChallenge();

    if (!challenge || !signature) {
      throw new InternalServerError('Error generating challenge during signin');
    }

    return res.status(200).json({
      salt: userFound.salt,
      pow: {
        challenge,
        signature,
        difficulty: process.env.CHA_DIFF,
      },
    });

  }

  static async signinValidate(req, res) {

    const body = req.body;

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
    const signedChallenge = AuthService.verifySignedChallenge(body.challenge, body.signature);

    if (!signedChallenge) {
      throw new ForbiddenError('Invalid challenge or signature');
    }

    // Verification de la preuve de travail (proof)
    const proofVerify = AuthService.verifyProofOfChallenge(body.challenge, body.proof);

    if (!proofVerify) {
      throw new ForbiddenError('Invalid proof of challenge');
    }

    const { accessToken, refreshToken } = AuthService.generateJWTTokens({
      sub: id,
      fingerprint: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
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

    //! ======================================
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

    // console.log('User permissions:', userPermissions);
    // console.log('User roles:', userRoles);

    await PermissionsStore.setPermissions(userFound.id, userPermissions.map(p => p.name));
    await RolesStore.setRoles(userFound.id, userRoles.map(r => r.name));

    console.log('Roles:', await RolesStore.getRoles(userFound.id));
    console.log('Permissions:', await PermissionsStore.getPermissions(userFound.id));
    //! ======================================

    res.cookie('accessTokenM', `Bearer ${accessToken}`, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenM', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });

    res.status(200).json({
      accessToken,
      refreshToken,
    });

  }
  
  static async logout(req, res) {

    const userId = Number.parseInt(req.auth?.userId);

    res.clearCookie('accessTokenM');
    res.clearCookie('refreshTokenM');

    if (userId) {
      await RolesStore.clearUserCache(req.auth?.userId);
      await PermissionsStore.clearUserCache(req.auth?.userId);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          accessToken: null,
          refreshToken: null,
        },
      });
    }

    res.status(200).json({
      ok: true
    });

  }
  
  static async generate(req, res) {

    if (!req.auth) {
      throw new ForbiddenError('Authentication required');
    }

    const { userId } = req.auth;
    const { accessToken, refreshToken } = AuthService.generateJWTTokens({
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

    res.cookie('accessTokenM', `Bearer ${accessToken}`, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenM', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });

    res.status(200).json({
      accessToken,
      refreshToken,
    });

  }

  static async changePassword(req, res) {

    const { email, hashOldPassword, hashNewPassword, hashNewConfirmPassword, newSalt, signature, challenge, proof } = req.body;

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
    const signedChallenge = AuthService.verifySignedChallenge(challenge, signature);

    if (!signedChallenge) {
      throw new ForbiddenError('Invalid challenge or signature');
    }

    // Verification de la preuve de travail (proof)
    const proofVerify = AuthService.verifyProofOfChallenge(challenge, proof);

    if (!proofVerify) {
      throw new ForbiddenError('Invalid proof of challenge');
    }

    const { accessToken, refreshToken } = AuthService.generateJWTTokens({
      sub: user.id,
      fingerprint: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
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

    res.cookie('accessTokenM', `Bearer ${accessToken}`, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenM', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    });

    res.status(200).json({
      accessToken,
      refreshToken,
    });  

  }

  static async signupConfirmEmail(req, res) {}

};

export default AuthController;
