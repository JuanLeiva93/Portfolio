const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });

  res.end(
    JSON.stringify({
      status: "ok",
      message: "Backend activo, pero el formulario ahora usa Formspree."
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});