const express = require('express');
const app = express();
var crypto = require('crypto')
const morgan = require('morgan');
const ExpressPeerServer = require('peer').ExpressPeerServer;
// const http = require('http');
// const socket = require('socket.io');

const PORT = process.env.PORT || 3000;

var server = app.listen(PORT,()=>{console.log(`Application started at port ${PORT}`);})

// configuring server for socket.IO
var io = require('socket.io').listen(server)

var files = {};
listOfUsers = [];

// configuring Handlebars
// var engines = require('consolidate');
// app.engine('pug', engines.pug);
// app.engine('handlebars', engines.handlebars);

app.set('view engine', 'pug');
app.set('view engine', 'hbs');

morgan.token('host', function(req, res) {
	return req.hostname;
});

app.use(morgan(':method :host :url :status :res[content-length] - :response-time ms'));


// const io = socket(server)

// server.listen(PORT, () => {
//     // console.log("Running on : http://localhost:3000")
//     console.log("p2pChat Running on : http://localhost:3000/p2pChat")
// })

const options = {
    debug: true
}

const peerserver = ExpressPeerServer(server, options);

app.use(express.static(__dirname + '/scripts'))

app.use('/p2pServer', peerserver);

app.get('/p2p', (req, res) => {
    res.render('temp.hbs', { users })
})

app.get('/p2pChat', (req, res) => {
    res.render('index.hbs');
})

peerserver.on('connection', (client) => {
    console.log("Client connected : ", client)
    // users.push(client)
    // console.log("Users Available : ", users)
});


// Old Code ->


// io.on('connection', (socket) => {
//     console.log("Connection Established :", socket.id)

//     // console.log("Type of socket.id -->", typeof(socket.id)) <= string
//     // When the connection is made succesfully
//     socket.emit('connected')

//     socket.on('addUser', (data) => {
//         console.log(data)
//         let obj = {
//             username: data.username,
//             peerId: data.peerId
//         }
//         console.log("Object at serevr ->", obj)
//         listOfUsers.push(obj)
//         // usersockets[data.user] = socket.id
//         // // console.log(typeof (usersockets));   console.log(usersockets)


//         io.emit('alertAllAboutNewUser', {
//             list: listOfUsers
//         })
//     })

//     socket.on('disconnect', (reason) => {
//         let username = null;
//         console.log('user disconnected, socketID : ', socket.id);

//         io.emit('jaRhahu', {
//             disconnect: true
//         })

//     });

// })


// New Code from Peerchat Application ->


io.on('connection', (socket) => {
    console.log("Connection Established :", socket.id)

    // console.log("Type of socket.id -->", typeof(socket.id)) <= string
    // When the connection is made succesfully
    socket.emit('connected')

    socket.on('addUser', (data) => {
        console.log(data)
        let obj = {
            username: data.username,
            peerId: data.peerId,
            socketId: socket.id     // added sccket.id field in a listOfUsers object.
        }
        console.log("Object at serevr ->", obj)
        listOfUsers.push(obj)
        // usersockets[data.user] = socket.id
        // // console.log(typeof (usersockets));   console.log(usersockets)


        io.emit('alertAllAboutNewUser', {
            list: listOfUsers
        })
    })


    // When a scket/ Peer is being disconnected
    socket.on('disconnect', (reason) => {
        console.log('user disconnected, socketID : ', socket.id);

        // joGyaUskiId = socket.id;

        listOfUsers = listOfUsers.filter(obj => obj.socketId == socket.id)
        console.log(listOfUsers)

        //    remove user from listOfUsers and the emit alert all
        io.emit('alertAllAboutNewUser', {
            list: listOfUsers
        })

    });

});


app.get('/p2pfileTransfer', function(req, res){
    res.render('sender.pug', {});
  });
  
  
  app.get('/p2pfileTransfer/get/:secure', function(req, res){
  
    if (files[req.params.secure]) {
      res.render('receiver.pug', {name:files[req.params.secure].name,token:req.params.secure});
    } else {
      res.render('receiver.pug', {name:0});
    }
  
  });
  
  
  app.get('/p2pfileTransfer/file/get/:secure', function(req, res){
  
    if (files[req.params.secure]) {
      io.sockets.emit('start', {token:req.params.secure});
      io.sockets.emit('moreData', {place:0, percent:0, token:req.params.secure});
  
      res.setHeader('Content-disposition', 'attachment; filename=' + files[req.params.secure].name);
      res.setHeader('Content-Length', files[req.params.secure].fileSize);
  
      var intervalID = setInterval(function(){
        if (files[req.params.secure].data.length){
          res.write(files[req.params.secure].data, 'binary');
          files[req.params.secure].data = '';
        }
        if (files[req.params.secure].isLoaded) { 
          res.end(); 
          clearInterval(intervalID);
          delete files[req.params.secure];
        }
      }, 1000);
    } 
    
    else {
      res.redirect('/p2pfileTransfer/get/file-not-found')
    }
  });
  
  
  io.on('connection', function (socket) {
  
    socket.on('save', function (d) {
      crypto.randomBytes(12, function(ex, buf) {
        var token = buf.toString('hex');
        files[token] = {
          name: d.name,
          fileSize: d.size,
          data: "",
          downloaded: 0,
          isLoaded: false
        };
        socket.emit('url', {token:token});
      });
    });
  
    socket.on('upload', function (d){
      files[d.token].downloaded += d.data.length;
      files[d.token].data += d.data;
      
      if(files[d.token].downloaded == files[d.token].fileSize) {
        files[d.token].isLoaded = true;
        socket.emit('done', {name:files.name});
      } else {
        var place = files[d.token].downloaded / 524288
          , percent = (files[d.token].downloaded / files[d.token].fileSize) * 100;
        socket.emit('moreData', {place:place, percent:percent, token:d.token});
      }
    });
  });
