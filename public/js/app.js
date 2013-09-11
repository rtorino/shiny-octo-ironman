(function (io, $, fabric, _) {
  var socket = io.connect(window.location.href);
  var canvas = new fabric.Canvas('canvas', { isDrawingMode : false });

  socket.on('connect', function (){
    console.info('successfully established a working and authorized connection');

    var freeDrawing = new FreeDrawing(socket);

    socket.on('data', function (data) {
      freeDrawing.loadFromJSON(data.drawing);
    });

    socket.on('user welcome', function (data) {
      freeDrawing.setCurrentUsers(data.currentUsers);
    });

    socket.on('user joined', function (user) {
      freeDrawing.addPeople(user.username);
    });

    socket.on('user left', function (user) {
      freeDrawing.handleUserLeft(user.username);
    });

    socket.on('message', function (message) {
      freeDrawing.appendNewMessage(message);
    });
  }); 

  socket.on('error', function (reason){
    console.error('Unable to connect Socket.IO', reason);
  });

  function FreeDrawing (socket) {
    this.socket = socket;
    this.canvas = canvas;
    this.$canvasToImage = $('#rasterize-to-image');
    this.$selector = $('#selector');
    this.$pencil = $('#pencil');
    this.$eraser = $('#eraser');
    this.$clear = $('#clear');
    this.$colorPicker = $('#color-picker').colorpicker();
    this.$penWidthAdjuster = $('#slider').slider({ min: 1, max : 100,  value: 1,
                                                  formater: function(value) {
                                                    return 'Pen width: '+value;
                                                  }
                                              });
    this.$peopleList = $('#people-list');
    this.peopleTpl = _.template('<li class="list-group-item"><img class="avatar" src="/img/avatar-placeholder.png" alt="avatar"/><span class="name"><%= username %></span><span class="status online"/>');
    this.$messageList = $('#message-list');
    this.$messageInput = $('input#message');
    this.messageTpl = _.template('<li class="list-group-item"><img class="avatar" src="/img/avatar-placeholder.png" /><span class="name"><%= source %></span><span class="time"><%= time %></span><div class="message"><%= message %></div></li>');
    this.initialize();
  }

  FreeDrawing.prototype.initialize = function () {
    var _this = this;

    // set defaults
    this.setDefaults();

    // rasterize canvas to image
    this.$canvasToImage.click(function (evt) {
      if (!fabric.Canvas.supports('toDataURL')) {
        alert('This browser doesn\'t provide means to serialize canvas to an image');
      }
      else {
        window.open(_this.canvas.toDataURL('png'));
      }
    });

    // toggle canvas drawing mode
    this.$selector.click(function (evt) {
      if ($(this).hasClass('active')) {
        _this.canvas.isDrawingMode = true;    
      } else {
        _this.canvas.isDrawingMode = false;
      }
    });

    // toggle canvas drawing mode
    this.$pencil.click(function (evt) {
      if ($(this).hasClass('active')) {
        _this.canvas.isDrawingMode = false;    
      } else {
        _this.canvas.isDrawingMode = true;
      }    
    });

    // toggle canvas drawing mode
    this.$eraser.click(function (evt) {
      if ($(this).hasClass('active')) {
        _this.canvas.isDrawingMode = true;    
      } else {
        _this.canvas.isDrawingMode = false;
      }
    });

    // toggle canvas drawing mode
    this.$clear.click(function (evt) {
      _this.canvas.clear();
      _this.setDefaults();
      _this.socket.emit('data', { data : JSON.stringify(_this.canvas) });
    });

    this.$colorPicker.on('changeColor', function (evt){
      _this.canvas.freeDrawingBrush.color = evt.color.toHex();
    });

    this.$penWidthAdjuster.on('slide', function (evt) {
      _this.canvas.freeDrawingBrush.width = parseInt(evt.value, 10) || 1;
    });

    this.canvas.on('object:selected', function () {
      if (_this.$eraser.hasClass('active')) {
        _this.canvas.remove(_this.canvas.getActiveObject());
      }
    });

    // emit data to server on path created
    this.canvas.on('path:created', function () {
      _this.socket.emit('data', { data : JSON.stringify(_this.canvas) });
    });

    // emit data to server on object removed
    this.canvas.on('object:removed', function () {
      _this.socket.emit('data', { data : JSON.stringify(_this.canvas) });
    });

    // emit data to server on object modified
    this.canvas.on('object:modified', function () {
      _this.socket.emit('data', { data : JSON.stringify(_this.canvas) });
    });

    $('#drawing-tools button').click(function () {
      $('#drawing-tools button').not(this).removeClass('active');
      $(this).toggleClass('active');
    });

    this.$messageInput.keypress(function(e) {
      if (e.keyCode == 13) {
        if (_this.$messageInput.val() === '') {
          return false;
        } else {
          _this.socket.emit('message', { message : _this.$messageInput.val() });
          _this.$messageInput.val('');
          e.stopPropagation();
          e.stopped = true;
          e.preventDefault();
        }
      }
    });
  };

  FreeDrawing.prototype.setDefaults = function () {
    this.$selector.addClass('active');
    this.canvas.isDrawingMode = false;
  };

  FreeDrawing.prototype.loadFromJSON = function (drawing) {
    this.canvas.clear();
    this.canvas.loadFromJSON(drawing.data);
    this.canvas.renderAll();
  };

  FreeDrawing.prototype.addPeople = function (username) {
    this.$peopleList.append(this.peopleTpl({ "username" : username }));
  }

  FreeDrawing.prototype.appendNewMessage = function (message) {
    this.$messageList.append(this.messageTpl(message));
    this.$messageList.scrollTop(this.$messageList[0].scrollHeight);
  }

  FreeDrawing.prototype.handleUserLeft = function (username) {
    $("#people-list li:contains('" + username + "')").remove();
  }

  FreeDrawing.prototype.setCurrentUsers = function (users) {
    var _this = this;
    this.$peopleList.empty();
    JSON.parse(users).forEach(function(username) {
      _this.addPeople(username);
    });
  };
})(io, jQuery, fabric, _);

