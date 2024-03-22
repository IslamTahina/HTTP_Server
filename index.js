const http = require("http");
const fs = require("fs");
const path = require("path");

// Root directory fpr public assets (can be changed to any directory)
const rootDir = __dirname + "/public";

// Object containing the mime type and encoding of the requested file
const mimeTypesAndEncoding = {
  ".html": { mime: "text/html", encoding: "utf8" },
  ".css": { mime: "text/css", encoding: "utf8" },
  ".js": { mime: "text/javascript", encoding: "utf8" },
  ".png": { mime: "image/png", encoding: "binary" },
  ".jpg": { mime: "image/jpg", encoding: "binary" },
  ".jpeg": { mime: "image/jpeg", encoding: "binary" },
  ".gif": { mime: "image/gif", encoding: "binary" },
  ".svg": { mime: "image/svg+xml", encoding: "binary" },
  ".ico": { mime: "image/x-icon", encoding: "binary" },
  ".json": { mime: "application/json", encoding: "utf8" },
};


// Request listener function that will be called when a request is received
const requestlistener = async (req, res) => {
  // Getting the requested file path
  let requestedFile = rootDir + req.url;

  // Getting the extension of the requested file
  const ext = path.extname(requestedFile) || "html";

  // Modifying the requested URL extension to be index.html if the URL is a directory or add .html if the url does not have an extension
  if (ext === "html") {
    if (req.url === "/") {
      requestedFile += "/index.html";
    } else if (!requestedFile.includes(".html")) {
      if (await fs.existsSync(requestedFile + "/index.html")) {
        requestedFile += "/index.html";
      } else {
        requestedFile += ".html";
      }
    }
  }
  // Extracting the mime type and encoding from the request URL extension
  const { encoding, mime } = mimeTypesAndEncoding[ext] || { encoding: "utf8", mime: "text/html" };
  if (await fs.existsSync(requestedFile)) {
    // Reading the file content
    const content = await fs.readFileSync(requestedFile, { encoding, flag: "r" });
    // Setting the response header
    res.writeHead(200, { "Content-Type": mime });
    // Sending the file content
    res.end(content, encoding);
  } else {
    // Setting the response header
    res.writeHead(404, { "Content-Type": "text/html" });
    // Sending the response
    res.end(
      `File <style>kbd{background:black; color:white; padding:5px; font-size: 18pt}</style> <kbd>${req.url}</kbd> Not Found`
    );
  }
};

// creating the server and listening to port 8000
const server = http.createServer(requestlistener);
server.listen("8000", "localhost");
