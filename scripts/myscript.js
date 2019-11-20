let socket = io()

socket.on('connected', () => {
    console.log("Socket ID :", socket.id)
})


// old code ->


// $(() => {

//     // alert("LOCKED and LOADED !")

//     let myId = $('#myId');
//     let connectButtton = $('#connectButtton');
//     let chatWindow = $('#chatWindow');
//     let send = $('#send');
//     let msg = $('#msg');
//     let destPeerID = $('#destPeerID');
//     let chatList = $('#chatList');
//     let loginButton = $('#loginButton');
//     let username = $('#username');
//     let afterLogIn = $('#afterLogIn');
//     let loginDiv = $('#loginDiv');
//     let userList = $('#userList');
//     let myUsername = $('#myUsername');
//     let vChatButtton = $('#vChatButtton');
//     let vChatWindow = $('#vChatWindow');

//     // Creating a new Peer
//     var peer = new Peer({
//         host: location.hostname,
//         port: 3000,
//         path: '/p2pServer',
//     });


//     // // configuring PeerJSServer on Heroku
//     // // Creating a new Peer
//     // var peer = new Peer({
//     //     secure: true,
//     //     host: 'the-peer-chat.herokuapp.com',
//     //     port: 443,
//     //     path: '/p2pServer',
//     // });

//     // When a new Peer is Created
//     peer.on('open', function (id) {
//         console.log('My peer ID is: ' + id);
//         myId.text(id)

//     });

//     loginButton.click(() => {

//         let usernameValue = username.val();
//         if (usernameValue == "") {
//             alert("Please Provide a username.")
//             return;
//         }
//         console.log("user ->", usernameValue)
//         myUsername.text(usernameValue)

//         loginDiv.removeClass("d-flex").addClass("d-none");
//         afterLogIn.show("fast");

//         // Only if a user allows!
//         socket.emit('addUser', {
//             username: usernameValue,
//             peerId: myId.text()
//         })

//         socket.on('alertAllAboutNewUser', (data) => {
//             console.log("Data is -->", data);
//             console.log(data.list)
//             refreshUserList(data.list)
//         })


//     })

//     // Error Handling
//     peer.on('error', function (err) {
//         console.log("ERROR ->", err);
//         console.log("Error Type: ", err.type);
//         alert("Error Encountered : " + err.type);
//     })


//     // Recieving a connection
//     peer.on('connection', function (connectionObject) {
//         // console.log("someone tried conecteing")
//         console.log("connectionObject", connectionObject)
//         console.log("Peer ID: " + connectionObject.peer + " , tried Connectiong You.")

//         connectionObject.on('open', function () {

//             // Receive Messages
//             connectionObject.on('data', function (data) {
//                 // console.log('Received', data);
//                 chatList.append(`<li>${data}</li>`);
//             });

//         });

//     });


//     // Clikcing on the Connect Button
//     connectButtton.click(() => {

//         destPeerIDValue = destPeerID.val();
//         if (destPeerIDValue == "") {
//             alert("Please Provide a PeerID.")
//             return;
//         }
//         var conn = peer.connect(destPeerIDValue);
//         if (!conn) {
//             alert("Please Provide a VALID PeerID.");
//             return
//         }
//         conn.on('open', function () {

//             // Send Messages
//             send.click(() => {
//                 let textToSend = msg.val();

//                 if (textToSend == "") {
//                     // EMPTY MSSG BODY
//                     alert("Why send an empty Message ?")
//                     return
//                 }

//                 updatedTextToSend = myUsername.text() + " : " + textToSend;

//                 // send to other users
//                 conn.send(updatedTextToSend);

//                 // Also add at your screen
//                 chatList.append(`<li style="text-align: right;">${textToSend}</li>`);

//                 msg.val("");
//             })
//         });

//     });

//     // Recieving a call
//     peer.on('call', function (call) {
//         // Answer the call, providing our mediaStream
//         console.log("inside Recieving Call ")

//         // make videoChat visible
//         vChatWindow.show();
//         call.answer();

//         call.on('stream', function (stream) {
//             // `stream` is the MediaStream of the remote peer.
//             // Here you'd add it to an HTML video/canvas element.

//             console.log("inside on 'stream'---")

//             // attach 
//             var video = document.getElementById('vChat')
//             video.srcObject = stream;
//             video.play()

//         });

//     });


//     vChatButtton.click(() => {
//         console.log("Inside VchatButton.Click()");

//         // make videoChat visible
//         vChatWindow.show();

//         navigator.webkitGetUserMedia({
//             video: true,
//             audio: true
//         }, function (stream) {

//             destPeerIDValue = destPeerID.val();
//             if (destPeerIDValue == "") {
//                 alert("Please Provide a PeerID.")
//                 vChatWindow.hide();
//                 return;
//             }
//             var call = peer.call(destPeerIDValue, stream);
//             if (!call) {
//                 alert("Please Provide a VALID PeerID.");
//                 vChatWindow.hide();
//                 return
//             }

//             // attach your own stream
//             var video = document.getElementById('vChatMyStream')
//             video.srcObject = stream;
//             video.play()

//         }, function (err) {
//             console.log("Error ->", err)
//             // console.log(err)
//         })
//     })



//     function refreshUserList(listOfUsers) {
//         userList.text("")
//         listOfUsers.forEach(myFunction);
//         function myFunction(item) {
//             // console.log(item)
//             userList.append(`<li><b>${item.username}</b> : <u><i>${item.peerId}</i></u></li>`)
//         }
//     }

// })


// New Code from PeerChatApplication ->




$(() => {

    // alert("LOCKED and LOADED !")

    let myId = $('#myId');
    let connectButtton = $('#connectButtton');
    let chatWindow = $('#chatWindow');
    let send = $('#send');
    let msg = $('#msg');
    let destPeerID = $('#destPeerID');
    let chatList = $('#chatList');
    let loginButton = $('#loginButton');
    let username = $('#username');
    let afterLogIn = $('#afterLogIn');
    let loginDiv = $('#loginDiv');
    let userList = $('#userList');
    let myUsername = $('#myUsername');
    let vChatButtton = $('#vChatButtton');
    let vChatWindow = $('#vChatWindow');
    let vChatend = $('#vChatend');



    // Creating a new Peer for local machine
    var peer = new Peer({
        host: location.hostname,
        port: 3000,
        path: '/p2pServer',
    });


    // configuring PeerJSServer on Heroku
    // Creating a new Peer

    // var peer = new Peer({
    //     secure: true,
    //     host: 'the-peer-chat.herokuapp.com',
    //     port: 443,
    //     path: '/p2pServer',
    // });


    // When a new Peer is Created
    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
        myId.text(id)

    });

    loginButton.click(() => {

        let usernameValue = username.val();
        if (usernameValue == "") {
            alert("Please Provide a username.")
            return;
        }
        console.log("user ->", usernameValue)
        myUsername.text(usernameValue)

        loginDiv.removeClass("d-flex").addClass("d-none");
        afterLogIn.show("fast");

        // Only if a user allows!
        socket.emit('addUser', {
            username: usernameValue,
            peerId: myId.text()
        })

        socket.on('alertAllAboutNewUser', (data) => {
            console.log("enter alert all `on` event")
            console.log("Data is -->", data);
            console.log(data.list)
            refreshUserList(data.list)
        })

        // peer.on('disconnected', function () {
        // });


    })

    // Error Handling
    peer.on('error', function (err) {
        console.log("ERROR ->", err);
        console.log("Error Type: ", err.type);
        alert("Error Encountered : " + err.type);
    })


    // Recieving a connection
    peer.on('connection', function (connectionObject) {
        // console.log("someone tried conecteing")
        console.log("connectionObject", connectionObject)
        console.log("Peer ID: " + connectionObject.peer + " , tried Connectiong You.")

        connectionObject.on('open', function () {

            // Receive Messages
            connectionObject.on('data', function (data) {
                // console.log('Received', data);
                chatList.append(`<li>${data}</li>`);
            });

        });

    });


    // Clikcing on the Connect Button
    connectButtton.click(() => {

        destPeerIDValue = destPeerID.val();
        if (destPeerIDValue == "") {
            alert("Please Provide a PeerID.")
            return;
        }
        var conn = peer.connect(destPeerIDValue);
        if (!conn) {
            alert("Please Provide a VALID PeerID.");
            return
        }
        conn.on('open', function () {

            // Send Messages
            send.click(() => {
                let textToSend = msg.val();

                if (textToSend == "") {
                    // EMPTY MSSG BODY
                    alert("Why send an empty Message ?")
                    return
                }

                updatedTextToSend = myUsername.text() + " : " + textToSend;

                // send to other users
                conn.send(updatedTextToSend);

                // Also add at your screen
                chatList.append(`<li style="text-align: right;">${textToSend}</li>`);

                msg.val("");
            })
        });

    });


    // Recieving a call
    peer.on('call', function (call) {
        // Answer the call, providing our mediaStream
        console.log("inside Recieving Call ")

        // make videoChat visible
        vChatWindow.show();
        call.answer();

        // Ending video Call from Reciver side
        vChatend.click(() => {
            console.log("end Chat clickedddd");
            call.close();
        })

        call.on('close', function () {
            console.log("in call.on(close)");
            var video = document.getElementById('vChat')
            video.srcObject = null;

        })

        call.on('stream', function (stream) {
            // `stream` is the MediaStream of the remote peer.
            // Here you'd add it to an HTML video/canvas element.
            console.log("inside on 'stream'---")

            // attach 
            var video = document.getElementById('vChat')
            video.srcObject = stream;
            video.play()

        });

    });


    vChatButtton.click(() => {
        console.log("Inside VchatButton.Click()");
        // make videoChat visible
        vChatWindow.show();

        navigator.webkitGetUserMedia({
            video: true,
            audio: true
        }, function (stream) {

            destPeerIDValue = destPeerID.val();
            if (destPeerIDValue == "") {
                alert("Please Provide a PeerID.")
                vChatWindow.hide();
                return;
            }
            var call = peer.call(destPeerIDValue, stream);

            if (!call) {
                alert("Please Provide a VALID PeerID.");
                vChatWindow.hide();
                return
            }

            // attach your own stream
            var video = document.getElementById('vChatMyStream')
            video.srcObject = stream;
            video.play()


            vChatend.click(() => {
                console.log("end Chat milane vale ke liye clickedddd");
                call.close();
                var video = document.getElementById('vChatMyStream')
                video.srcObject = null;

            })

        }, function (err) {
            console.log("Error ->", err)
            // console.log(err)
        })
    })

    function refreshUserList(listOfUsers) {
        userList.text("")
        listOfUsers.forEach(myFunction);
        function myFunction(item) {
            // console.log(item)
            userList.append(`<li><b>${item.username}</b> : <u><i>${item.peerId}</i></u></li>`)
        }
    }

})
