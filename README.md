Stream logs to a web interface.

Real-Time Web Application with Node.js, Socket.io, and Redis.

1. Install dependencies
```
npm install
```

2. Start Redis
```
download redis
make
src/redis-server
```

3. Start Node.js
```
npm start
```

4. To push logs to the service
```
$ tail -f /var/log/acess.log | node ./build/fukka.js
```

Done. Connect to

http://localhost:3939/

To edit the code
```
coffee -o build -cw src
```

