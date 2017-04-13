const hapi = require('hapi');
const vision = require('vision');
const routes = require('./router.js');
const inert = require('inert');
const handlebars = require('handlebars');
const hapiAuth = require('hapi-auth-jwt2');

const port = process.env.PORT || 4040;

const server = new hapi.Server({
  connections: {
    state: {
      isSameSite: 'Lax'
    }
  }
});


server.connection({
  port
});

server.register([inert, vision, hapiAuth], (err) => {
  if (err) throw err;

  const validate = (token, validateRequest, callback) => {
    if (!token) {
      return callback(null, false);
    }
    return callback(null, true);
  };
  server.auth.strategy('jwt', 'jwt', 'required', {
    key: process.env.SECRET,
    validateFunc: validate,
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.views({
    engines: {
      hbs: handlebars
    },
    relativeTo: __dirname,
    helpersPath: '../views/helpers',
    path: '../views',
    layout: 'layout',
    partialsPath: '../views/partials',
    layoutPath: '../views/layout'
  });

  server.route(routes);

  server.start((error) => {
    if (error) throw error;
    // console.log('Server running at:', server.info.uri);
  });
});
