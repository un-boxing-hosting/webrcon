function RconService() {

  var ConnectionStatus = {
    'CONNECTING': 0,
    'OPEN': 1,
    'CLOSING': 2,
    'CLOSED': 3
  };

  var Service = {
    Socket: null,
    Address: null,
    Callbacks: {}
  };

  var LastIndex = 1001;

  Service.Connect = function (addr, pass) {
    this.Socket = new WebSocket("ws://" + addr + "/" + pass);
    this.Address = addr;

    this.Socket.onmessage = function (e) {
      var data = angular.fromJson(e.data);

      //
      // This is a targetted message, it has an identifier
      // So feed it back to the right callback.
      //
      if (data.Identifier > 1000) {
        var cb = Service.Callbacks[data.Identifier];
        if (cb != null) {
          cb.scope.$apply(function () {
            cb.callback(data);
          });
        }
        Service.Callbacks[data.Identifier] = null;

        return;
      }

      //
      // Generic console message, let OnMessage catch it
      //
      if (Service.OnMessage != null) {
        Service.OnMessage(data);
      }
    };

    this.Socket.onopen = this.OnOpen;
    this.Socket.onclose = this.OnClose;
    this.Socket.onerror = this.OnError;
  }

  Service.Disconnect = function () {
    if (this.Socket) {
      this.Socket.close();
      this.Socket = null;
    }

    this.Callbacks = {};
  }

  Service.Command = function (msg, identifier) {
    if (this.Socket === null)
      return;

    if (!this.IsConnected())
      return;

    if (identifier === null)
      identifier = -1;

    var packet = {
      Identifier: identifier,
      Message: msg,
      Name: "WebRcon"
    };

    this.Socket.send(JSON.stringify(packet));
  };

  //
  // Make a request, call this function when it returns
  //
  Service.Request = function (msg, scope, callback) {
    LastIndex++;
    this.Callbacks[LastIndex] = {
      scope: scope,
      callback: callback
    };
    Service.Command(msg, LastIndex);
  }

  //
  // Returns true if websocket is connected
  //
  Service.IsConnected = function () {
    if (this.Socket == null)
      return false;

    return this.Socket.readyState === ConnectionStatus.OPEN;
  }

  //
  // Helper for installing connectivity logic
  //
  // Basically if not connected, call this function when we are
  // And if we are - then call it right now.
  //
  Service.InstallService = function (scope, func) {
    scope.$on("OnConnected", function () {
      func();
    });

    if (this.IsConnected()) {
      func();
    }
  }

  Service.getPlayers = function (scope, success) {
    this.Request("playerlist", scope, function (response) {
      var players = JSON.parse(response.Message);

      if (typeof success === 'function') {
        success.call(scope, players);
      }
    });
  }

  Service.getBans = function (scope, success) {
    this.Request("banlistex", scope, function (response) {
      //split response.Message by comma and then by \n and put into array
      var regex = /\"(.*?)\"/g;
      var bans = response.Message.split("\n");
      var SteamID = [];
      var Name = [];
      var Reason = [];
      var i = 0;
      //loop through bans array
      for (var i = 0; i < bans.length; i++) {
        //if bans[i] contains a steamid
        if (bans[i].includes("7656")) {
          //push steamid to steamid array
          SteamID.push(bans[i].split(" ")[1]);
          //match name using regex and push to name array
          Name.push(bans[i].match(regex)[0].replace(/"/g, ''));
          //push reason to reason array
          Reason.push(bans[i].split("\"")[3]);
        }
      }
      //create a new array
      var bans = [];
      console.log(bans)
      //loop through steamid array
      for (var i = 0; i < SteamID.length; i++) {
        //push steamid, name, reason, expires to bans array

        bans.push({
          SteamID: SteamID[i],
          Name: Name[i],
          Reason: Reason[i]
        });
      }

      if (typeof success === 'function') {
        success.call(scope, bans);
      }
    });
  }

  Service.getPlugins = function (scope, success) {
    this.Request("c.plugins -json", scope, function (response) {
      console.log(response.Message);
      var list = JSON.parse(response.Message);
      //var list = response.Message.split("\n");
      console.log(list);
      var plugins = list.Plugins[1].Plugins;
      console.log(plugins);
      //var plugins = [];
      /* for (var i = 0; i < list.length; i++) {
        //split "" and () from list[i]

        var pluginName = list[i].split("\"")[1]
        //spilt ( ) from list[i]

        var pluginVersion = list[i].split(/[()]/);
        var authorString = `${pluginVersion[2]}`
        var cmdString = `${pluginVersion[4]}`
        var cmdString2 = `${cmdString.split(" - ")[1]}`;
        var cmdName = cmdString2.split(".cs")[0];
        var author = authorString.split("by ")[1];
        // pluginVersion = pluginVersion.split(")")[0];
        // console.log(pluginName);
        // console.log(pluginVersion);
        // console.log(author);
        if (pluginName == undefined) {
          pluginName = list[i].split(" ");
          // console.log(pluginName +"1");
          plugins.push({
            Name: pluginName[3],
            Version: pluginName[5],
            Author: pluginName[5],
            CmdName: pluginName[3]
          });
          continue;
        }
        */
        /* plugins.push({
          Name: pluginName,
          Version: pluginVersion[1],
          Author: author,
          CmdName: cmdName
        }); */

      //}
      //plugins.shift(); 
      //console.log(plugins);

      if (typeof success === 'function') {
        success.call(scope, plugins);
      }
    });
  }

  return Service;
}