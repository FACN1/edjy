const path = require('path');
require('env2')('./config.env');
const dbQueries = require('./db_queries.js');
const querystring = require('querystring');
const requestModule = require('request');
const jwt = require('jsonwebtoken');

const staticFiles = {
  method: 'GET',
  path: '/{file}',
  handler: {
    directory: {
      path: path.join(__dirname, '../public')
    }
  }
};

const loginButton = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    const loginContent = {
      text: 'Login'
    };
    return reply.view('login-btn', loginContent);
  }
};

// Send user to github to authenticate with github and grant permission.
// Then redirect back to '/welcome' route
const githubOAuth = {
  method: 'GET',
  path: '/login',
  handler: (request, reply) => {
    const base = 'https://github.com/login/oauth/authorize?';
    const oAuthParams = {
      client_id: process.env.CLIENT_ID,
      redirect_uri: 'http://localhost:4040/welcome'
    };
    const authReqUrl = base + querystring.stringify(oAuthParams);
    reply.redirect(authReqUrl);
  }
};

const welcome = {
  method: 'GET',
  path: '/welcome',
  handler: (request, reply) => {
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: request.query.code
    };
    const options = {
      method: 'POST',
      body: data,
      json: true,
      url: 'https://github.com/login/oauth/access_token'
    };
    // make a post request with temp Code
    requestModule(options, (error, response, body) => {
      if (error) return reply(error);

      const myToken = body.access_token;

      if (!body.access_token) {
        return reply('no access token found');
      }

      requestModule.get({
        url: 'https://api.github.com/user',
        headers: {
          'User-Agent': 'oauth_github_jwt',
          Authorization: `token ${body.access_token}`
        }
      },
      (error, response, body) => {
        const JWTOptions = {
          expiresIn: Date.now() + (24 * 60 * 60 * 1000),
          subject: 'github-data'
        };
        const parsedBody = body;

        const payload = {
          user: {
            username: parsedBody.login,
            img_url: parsedBody.avatar_url,
            user_id: parsedBody.id
          },
          accessToken: myToken
        };

        const secret = process.env.SECRET;

        jwt.sign(payload, secret, JWTOptions, (jwterror, token) => {
          if (jwterror) console.log(jwterror);
          return reply.redirect('/home').state('token', token, {
            path: '/home',
            isHttpOnly: false,
            isSecure: process.env.NODE_ENV === 'PRODUCTION'
          });
        });
      }
      );
    });
  }
};

const index = {
  method: 'GET',
  path: '/home',
  config: {
    auth: {
      mode: 'optional',
      strategy: 'jwt'
    }
  },
  handler: (request, reply) => {
    if(request.auth.isAuthenticated) {
      return dbQueries.getPosts((err, postsArray) => {
        if (err) {
          return reply(err);
        }
        const context = {
          posts: postsArray.reverse()
        };
        return reply.view('index', context);
      });
    }
    return reply.redirect('/');
  }
};

const add = {
  method: 'GET',
  path: '/add',
  handler: (request, reply) => {
    reply.view('add');
  }
};

const createPost = {
  method: 'post',
  path: '/create-post',
  handler: (request, reply) => {
    const data = request.payload;
    dbQueries.createPost(data, (err) => {
      if (err) {
        return reply(err);
      }
      return reply('You added a new post');
    });
  }
};

module.exports = [
  staticFiles, index, add, createPost, loginButton, githubOAuth, welcome
];
