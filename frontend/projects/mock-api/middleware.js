/**
 * This middleware is used to modify the request object before it is routed to db.json
 */

module.exports = (req, res, next) => {
  // if (req.method === 'POST') {
  //   req.method = 'GET';
  // }
  console.log('[Middleware] Request method:', req.method);
  // throw new Error('Error from middleware');

  next();
};
