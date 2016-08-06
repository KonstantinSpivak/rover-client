var opts = {
    extraHeaders: {
        host: 'spyvak.name',
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        accept: '*/*',
        referer: 'http://spyvak.name/rover',
        'accept-encoding': 'gzip, deflate, sdch',
        'accept-language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
        rovergo: 'ok'
    }
};
var socket = require('socket.io-client')('http://spyvak.name', opts);
var ss = require('socket.io-stream');
var fs = require("fs");
var v4l2camera = require("v4l2camera");
//
var stream = ss.createStream();
var filename = 'profile.jpg';
var interval = 0;
socket.on('connect', function(){
    interval = setInterval(function() {
        fs.readFile(filename, function(err, buffer){
                socket.emit('live-stream', buffer.toString('base64'));
        });
    }, 500)
    console.log('connet good')
});
socket.on('live-stream', function(data){
    console.log(data)
});
socket.on('live-stream-to-client', function (img) {
    console.log('foobar')
    //remove this
});

socket.on('disconnect', function(){
    clearInterval(interval);
    interval = 0;
    console.log('disckonect')
});

socket.on('rover-ready', function(data){
    console.log(data)
});

socket.on('cameraOn', function (data) {
  console.log(data)
});

var cam = new v4l2camera.Camera("/dev/video0");
if (cam.configGet().formatName !== "MJPG") {
    console.log("NOTICE: MJPG camera required");
    process.exit(1);
}
cam.start();
cam.capture(function (success) {
    var frame = cam.frameRaw();
    require("fs").createWriteStream("result.jpg").end(Buffer(frame));
    cam.stop();
});