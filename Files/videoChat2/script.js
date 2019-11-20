$(() => {
    // alert("me yaha hu")

    var startChat = true;

    navigator.webkitGetUserMedia({ video: true, audio: true }, gotMedia, () => { })

    function gotMedia(stream) {

        const yourId = $('#yourId');
        const connectButton = $('#connect');
        const otherId = $('#otherId');
        // const video = $('#vChat');


        var response = confirm("You Want to initiate Communication ?");
        if (response == true) {
            startChat = true;
        } else {
            startChat = false;
        }

        var peer = new SimplePeer({
            initiator: startChat,
            trickle: false, // WHY ?
            stream: stream
        })

        peer.on('error', (err) => {
            console.log("Error")
            console.log(err)
        })

        // waitToConnect.click(function () {
        //     startChat = false;
        //     console.log(startChat)
        // })

        connectButton.click(function () {

            // var otherIdValue = otherId.val()
            // console.log(otherIdValue)
            // console.log("start chat is - ", startChat)
            var otherIdValueParsed = JSON.parse(otherId.val())
            console.log(otherIdValueParsed)
            peer.signal(otherIdValueParsed)

        })

        peer.on('signal', function (data) {

            alert("someone wants to connect !")
            // console.log(startChat)
            // console.log("Data");
            // console.log(data);
            // console.log("JSON.Stringify(Data)");
            // console.log(JSON.stringify(data))
            var yourIdStringified = JSON.stringify(data);
            yourId.val(yourIdStringified)
            console.log("generated ypur unique id ->", yourIdStringified)   

        })

        peer.on('stream', function (data) {

            // video.srcObject = stream;
            // video[0].play()
            var video = document.getElementById('vChat')
            video.srcObject = stream;
            video.play()
        })


    }


})
