module.exports = {
  '/api': {
    target: 'http://0.0.0.0:3031',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
};
