const hapi = require('hapi');
const vision = require('vision');
const routes = require('./router.js');
const inert = require('inert');
const handlebars = require('handlebars');

const port = process.env.PORT || 4040;

const server = new hapi.Server();


server.connection({
  port
});

server.register([inert, vision], (err) => {
  if (err) throw err;
  server.state('session', {
    ttl: 24 * 60 * 60 * 1000,     // One day
    isSecure: true,
    path: '/',
    encoding: 'base64json'
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
    console.log('Server running at:', server.info.uri);
  });
});
