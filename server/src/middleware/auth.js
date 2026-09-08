import 'dotenv/config';
import jwt from 'jsonwebtoken';

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
};

const mapLiveUser = (decoded = {}, token) => ({
  liveToken: token,
  id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.staffID || decoded.staffId,
  username: decoded.userid || decoded.userID || decoded.username || decoded.emailID,
  userID: decoded.userid || decoded.userID,
  staffID: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.staffID || decoded.staffId,
  staffName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.staffName,
  staffRole: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.staffRole,
  roleName: decoded.RoleName || decoded.roleName,
  email: decoded.email || decoded.emailID,
  type: decoded.type,
  empId: decoded.empid || decoded.empId,
});

// The token here is issued by the Live API, not by us — we don't hold its signing
// secret, so we decode (not verify) it purely to read the staff/user claims.
export const requireAuth = (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }

    req.user = mapLiveUser(decoded, token);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const verifyRefreshToken = (req, res, next) => {
  req.refreshUser = { refreshToken: req.cookies?.refreshToken || null };
  next();
};

const normalizeRole = (roleName) => String(roleName || '').trim().toLowerCase();

// Must run after requireAuth. Usage: requireRole('admin')
export const requireRole = (...allowedRoles) => {
  const allowed = allowedRoles.map(normalizeRole);
  return (req, res, next) => {
    const role = normalizeRole(req.user?.roleName || req.user?.staffRole);
    if (!allowed.includes(role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role.' });
    }
    next();
  };
};
