navigator.webkitGetUserMedia({
    video: true,
    audio: false
}, function (stream) {

    // })

    var Peer = require('simple-peer')
    var peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false, // WHY ?
        stream: stream
    })

    peer.on('signal', function (data) {
        alert("signal event hua")
        document.getElementById('yourId').value = JSON.stringify(data)
    })

    document.getElementById('connect').addEventListener('click', function () {
        var otherId = JSON.parse(document.getElementById('otherId').value)
        peer.signal(otherId)
    })

    document.getElementById('send').addEventListener('click', function () {
        var yourMessage = document.getElementById('yourMessage').value
        console.log("sending ->", yourMessage)
        peer.send(yourMessage)
    })

    peer.on('data', function (data) {
        document.getElementById('messages').textContent += data + '\n'
    })

    peer.on('stream', function (data) {
        var video = document.createElement('video')
        document.body.appendChild(video)

        // video.src = window.URL.createObjectURL(stream)
        video.srcObject = stream;
        video.play()
    })

}, function (err) {
    console.log(err)
})