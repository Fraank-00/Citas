const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No se proporciona token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token inválido o expirado:', err);
      return res.sendStatus(403); // Token inválido
    }
    req.user = user; // Agrega el usuario al objeto req
    next();
  });
}

module.exports = authenticateToken;
