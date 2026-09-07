import 'dotenv/config';
import axios from 'axios';
import https from 'https';
import LiveApiTokenModel from '../../models/liveApiTokenModel.js';

const LIVE_BASE = process.env.LIVE_API_BASE_URL;

const createHttpsAgent = () => new https.Agent({
  keepAlive: false,
  maxCachedSessions: 0,
  rejectUnauthorized: true,
  minVersion: 'TLSv1.2',
});

const postToLiveApi = (path, payload, headers = {}) => axios.post(`${LIVE_BASE}${path}`, payload, {
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  },
  timeout: 30000,
  httpsAgent: createHttpsAgent(),
  proxy: false,
  withCredentials: true,
});

const extractTokenPayload = (payload = {}) => {
  const accessToken = payload?.accessToken || payload?.data?.accessToken || payload?.token || payload?.data?.token || null;
  const refreshToken = payload?.refreshToken || payload?.data?.refreshToken || null;

  let expiresAt = null;
  try {
    if (accessToken) {
      const parts = String(accessToken).split('.');
      if (parts.length >= 2) {
        const jwtPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        expiresAt = jwtPayload?.exp ? new Date(jwtPayload.exp * 1000) : null;
      }
    }
  } catch {
    expiresAt = null;
  }

  return { accessToken, refreshToken, expiresAt };
};

export const login = async (req, res) => {
  const loginID = String(req.body?.loginID || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!loginID || !password) {
    return res.status(400).json({ success: false, message: 'loginID and password are required.' });
  }

  try {
    const liveRes = await postToLiveApi('/api/auth/login', { loginID, password });

    const setCookieHeaders = liveRes.headers['set-cookie'];
    if (setCookieHeaders) {
      res.setHeader('Set-Cookie', setCookieHeaders);
    }

    return res.status(liveRes.status).json(liveRes.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const payload = error.response?.data || { success: false, message: 'Failed to request OTP.' };
    console.error('[Auth:Login]', status, error.response?.data || error.message);
    return res.status(status).json(payload);
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const staffID = Number(req.body?.staffID);
  const cookies = req.headers.cookie || '';

  if (!staffID || !otp) {
    return res.status(400).json({ success: false, message: 'staffID and otp are required.' });
  }

  try {
    const liveRes = await axios.post(`${LIVE_BASE}/api/auth/verify-otp`, { staffID, otp: String(otp) }, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
      timeout: 30000,
      httpsAgent: createHttpsAgent(),
      proxy: false,
    });

    const tokenData = extractTokenPayload(liveRes.data);
    if (tokenData.accessToken) {
      await LiveApiTokenModel.upsert({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        updatedBy: req.body?.loginID || 'verify-otp',
      });
    }

    const setCookieHeaders = liveRes.headers['set-cookie'];
    if (setCookieHeaders) {
      res.setHeader('Set-Cookie', setCookieHeaders);
    }

    return res.status(liveRes.status).json(liveRes.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const payload = error.response?.data || { success: false, message: 'Failed to verify OTP.' };
    console.error('[Auth:VerifyOtp]', status, error.response?.data || error.message);
    return res.status(status).json(payload);
  }
};

export const refresh = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!accessToken) {
    return res.status(401).json({ success: false, message: 'Access token is required.' });
  }

  try {
    // devcmsapi's cms_at/cms_rt cookies are Secure-flagged, so browsers drop them when this
    // backend is served over plain HTTP (local dev). We already persist both tokens
    // server-side on every login/refresh, so use that as the source of truth for the
    // Live API session's cookie instead of relaying whatever the browser has.
    const stored = await LiveApiTokenModel.getLatest();
    if (!stored?.refresh_token) {
      return res.status(401).json({ success: false, message: 'Refresh token not found' });
    }

    const liveRes = await axios.post(`${LIVE_BASE}/api/auth/refresh`, {}, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken,
        Cookie: `cms_at=${stored.access_token}; cms_rt=${encodeURIComponent(stored.refresh_token)}`,
      },
      timeout: 30000,
      httpsAgent: createHttpsAgent(),
      proxy: false,
    });

    const tokenData = extractTokenPayload(liveRes.data);
    if (tokenData.accessToken) {
      await LiveApiTokenModel.upsert({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        updatedBy: 'refresh',
      });
    }

    const setCookieHeaders = liveRes.headers['set-cookie'];
    if (setCookieHeaders) {
      res.setHeader('Set-Cookie', setCookieHeaders);
    }

    return res.status(liveRes.status).json(liveRes.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const payload = error.response?.data || { success: false, message: 'Failed to refresh token.' };
    console.error('[Auth:Refresh]', status, error.response?.data || error.message);
    return res.status(status).json(payload);
  }
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ success: true, message: 'Logged out.' });
};

export const me = (req, res) => {
  return res.json({ success: true, data: req.user });
};
