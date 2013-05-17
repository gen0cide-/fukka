// Generated by CoffeeScript 1.4.0
(function() {
  var ChatModel, ChatView, SlideModel, SlideView, setStatus,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  setStatus = function(msg) {
    return $("#status").html("Connection Status : " + msg);
  };

  SlideModel = (function(_super) {

    __extends(SlideModel, _super);

    function SlideModel() {
      return SlideModel.__super__.constructor.apply(this, arguments);
    }

    return SlideModel;

  })(Backbone.Model);

  SlideView = (function(_super) {

    __extends(SlideView, _super);

    function SlideView() {
      this.render = __bind(this.render, this);
      return SlideView.__super__.constructor.apply(this, arguments);
    }

    SlideView.prototype.el = $('#slides-div');

    SlideView.prototype.events = {};

    SlideView.prototype.initialize = function() {
      this.model.on('change', this.render);
      return this.model.view = this;
    };

    SlideView.prototype.render = function() {
      var id;
      id = this.model.get('id');
      $('#slides-div .slide:visible').hide();
      return $('#slides-div .slide:eq(' + id + ')').show();
    };

    return SlideView;

  })(Backbone.View);

  ChatModel = (function(_super) {

    __extends(ChatModel, _super);

    function ChatModel() {
      return ChatModel.__super__.constructor.apply(this, arguments);
    }

    return ChatModel;

  })(Backbone.Model);

  ChatView = (function(_super) {

    __extends(ChatView, _super);

    function ChatView() {
      this.render = __bind(this.render, this);
      return ChatView.__super__.constructor.apply(this, arguments);
    }

    ChatView.prototype.el = $('#chat-div');

    ChatView.prototype.events = {
      'submit form': 'onFormSubmit'
    };

    ChatView.prototype.initialize = function() {
      this.model.on('change', this.render);
      return this.model.view = this;
    };

    ChatView.prototype.render = function() {
      var html, msgs, template;
      msgs = this.model.get("msgs");
      template = $('#template-msgs').html();
      html = Mustache.render(template, {
        msgs: msgs
      });
      return this.$el.find(".msgs").prepend(html);
    };

    ChatView.prototype.onFormSubmit = function() {
      var form;
      form = this.$el.find('form');
      this.socket.emit("chat", {
        msg: form.find('input[name="msg"]').val()
      });
      return false;
    };

    return ChatView;

  })(Backbone.View);

  $(document).ready(function() {
    var chatModel, chatView, slideModel, slideView, socket;
    slideModel = new SlideModel();
    slideView = new SlideView({
      model: slideModel
    });
    slideModel.set({
      channel: 'slide',
      id: 0
    });
    chatModel = new ChatModel();
    chatView = new ChatView({
      model: chatModel
    });
    socket = io.connect("http://" + config.serverHost + ":" + config.port);
    chatView.socket = socket;
    socket.on("connect", function(data) {
      setStatus("connected");
      socket.emit("subscribe", {
        channel: "slide"
      });
      return socket.emit("subscribe", {
        channel: "chat"
      });
    });
    socket.on("reconnecting", function(data) {
      return setStatus("reconnecting");
    });
    socket.on("slide", function(data) {
      var numSlides;
      numSlides = $('#slides-div .slide').length;
      if ((data.id != null) && data.id < numSlides && data.id >= 0) {
        return slideModel.set(data);
      }
    });
    socket.on("chat", function(data) {
      return chatModel.set({
        msgs: data,
        random: Math.random()
      });
    });
    return $(document).keydown(function(event) {
      var diff, id, numSlides;
      diff = 0;
      if (event.which === 219) {
        diff = -1;
      } else if (event.which === 221) {
        diff = 1;
      }
      if (diff !== 0) {
        numSlides = $('#slides-div .slide').length;
        id = slideModel.get('id');
        id = id + diff;
        if (id < numSlides && id >= 0) {
          return socket.emit('slide', {
            channel: 'slide',
            id: id
          });
        }
      }
    });
  });

}).call(this);