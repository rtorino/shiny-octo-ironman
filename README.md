DIRTy App! 
==================

## Synopsis

This is a [Node.js](http://nodejs.org/) application built using [express](http://expressjs.com/) web application framework, [MongoDB](http://www.mongodb.org/) for the storage and [Socket.IO](http://socket.io/). This application is mainly composed of three modules. The **user authentication module** which uses [passportjs](http://passportjs.org/), the **drawing module** which is built using HTML5 canvas API and last but not the least is the **chat module**. As the project name says, this is a Data Intensive Real Time application and this is what Node.js is being intended for. :)

## Motivation

This application can have multiple use cases (e.g. online classroom, discuss project document) but generally it is a real-time collaboration tool. This can be use to discuss something via chat or if there are things you cannot express via chat, you can draw it on the board. 

## Installation

**NOTE:** You need to have node.js, mongodb and installed and running.

```sh
  $ git clone git://github.com/madhums/nodejs-express-mongoose-demo.git
  $ npm install
  $ npm start
```

Then visit [http://localhost:3000/](http://localhost:3000/)

## Dependencies

1. [express](http://expressjs.com/) - Sinatra inspired web development framework for node.js.
2. [jade](http://jade-lang.com/) - Node template engine.
3. [mongodb](http://www.mongodb.org/) - Open-source document database, and the leading NoSQL database.
4. [passport](http://passportjs.org/) - Simple, unobtrusive authentication for Node.js.
5. [passport-local](https://github.com/jaredhanson/passport-local) - Username and password authentication strategy for Passport and Node.js. 
6. [mongoose](http://mongoosejs.com/) - elegant mongodb object modeling for node.js
7. [connect-flash](https://github.com/jaredhanson/connect-flash) - Flash message middleware for Connect and Express.
8. [pwd](https://github.com/visionmedia/node-pwd) - Hash and compare passwords with pbkdf2
9. [view-helpers](https://github.com/madhums/node-view-helpers) - Express view helper methods
8. [connect-mongo](http://kcbanner.github.com/connect-mongo/) - MongoDB session store for Connect.
9. [socket.io](http://socket.io/) - Realtime application framework for Node.JS, with HTML5 WebSockets and cross-browser fallbacks support.
10. [passport.socketio](https://github.com/jfromaniello/passport.socketio) - Access passport.js authenticated user information from socket.io connection
11. [underscore](http://underscorejs.org/) - JavaScript's utility _ belt

## Directory structure
```
-app/
  |__controllers/
  |__models/
  |__mailer/
  |__views/
-config/
  |__routes.js
  |__config.js
  |__passport.js (auth config)
  |__imager.js (imager config)
  |__express.js (express.js configs)
  |__middlewares/ (custom middlewares)
-public/
```

## To Do

1. Add HTML5 local storage API feature
2. Ability to add shape objects
3. Add sticky notes feature on the board
4. Implement Undo and Redo functionality
5. ..and a lot more... :) 

## License
(The MIT License)

Copyright (c) 2013 Raymond Torino < [rbtorino@outlook.com](mailto:rbtorino@outlook.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
