const app = require('express')();
const http = require('http').createServer(app);
const io = socketIO(server);
const fetch = require('node-fetch');
const port = process.env.PORT || 3000;

app.get('/', function(req, res){
  let url = 'https://guarded-anchorage-28885.herokuapp.com/tweets-latest/'
  fetch(url)
  .then(res => res.json())
  .then(data => {
      res.send({ data });
  })
  .catch(err => {
      res.send(err);
  });
})

io.on('connection', (socket) => {
    console.log('Client connected');
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
    socket.on('disconnect', () => console.log('Client disconnected'));
});

http.listen(port, () => {
    console.log(`started on port: ${port}`);
});
