import http from "http";
import app from "../../app";

const server = http.createServer(app);

const port = process.env.PORT || 5000;

if (!process.env.PORT) process.env.PORT = port;

server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(port, () => {
  console.log(`\x1b[32m`, `Server listening on ${port}`, `\x1b[0m`);
});
