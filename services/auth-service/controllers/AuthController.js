import AuthService from "../services/AuthService.js";

class AuthController {

  static async signup(req, res) {
    const { email } = req.validated.body;

    const challenge = await AuthService.signup(email);

    return res.status(200).json(challenge);
  }

  static async signupValidate(req, res) {
    const body = req.validated.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken } = await AuthService.signupValidate(body, ip, userAgent);

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

  static async verifyTokens(req, res) {
    if (!req.auth)
      return res.status(200).json({
        ok: false,
    });

    return res.status(200).json({
      ok: true,
    });
  }

  static async signin(req, res) {
    const { email } = req.validated.body;

    const challenge = await AuthService.signin(email);

    return res.status(200).json(challenge);
  }

  static async signinValidate(req, res) {
    const body = req.validated.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken } = await AuthService.signinValidate(body, ip, userAgent);

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

    await AuthService.logout(userId);

    res.clearCookie('accessTokenM');
    res.clearCookie('refreshTokenM');

    res.status(200).json({
      ok: true
    });

  }
  
  static async generate(req, res) {
    const auth = req.auth;

    const { accessToken, refreshToken } = await AuthService.generate(auth);

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
    const body = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken } = await AuthService.changePassword(body, ip, userAgent);

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
