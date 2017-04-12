const path = require('path');
require('env2')('./config.env');
const dbQueries = require('./db_queries.js');

const staticFiles = {
  method: 'GET',
  path: '/{file}',
  handler: {
    directory: {
      path: path.join(__dirname, '../public')
    }
  }
};

const login = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    const loginContent = {
      text: 'Login'
    };
    return reply.view('login-btn', loginContent);
  }
};

const index = {
  method: 'GET',
  path: '/home',
  handler: (request, reply) => {
    dbQueries.getPosts((err, postsArray) => {
      if (err) {
        return reply(err);
      }
      const context = {
        posts: postsArray.reverse()
      };
      return reply.view('index', context);
    });
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
  staticFiles, index, add, createPost, login
];
