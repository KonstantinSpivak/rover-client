
let socket = require('socket.io-client')('http://35.204.119.24:3000');

let v4l2camera = require("v4l2camera");
//

let isVideoStream = false;
socket.on('connect', function () {
    isVideoStream = true;
    console.log('Connect');
});

socket.on('disconect', function () {
    isVideoStream = false;
    console.log('disconect');
});

socket.on('error', function (e) {
    console.log('Error');
    console.log(e);
});

let cam = new v4l2camera.Camera("/dev/video0");
if (cam.configGet().formatName !== "MJPG") {
    console.log("NOTICE: MJPG camera required");
    console.log(cam.configGet().formatName);
    process.exit(1);
}
cam.start();
cam.capture(function (success) {
    var frame = cam.frameRaw();
    if (isVideoStream) {
        socket.emit('live-stream', frame.toString('base64'));
    }

    cam.stop();
});
