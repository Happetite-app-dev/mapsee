const fs = require("fs");
const http2 = require("http2");
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    iss: "7UKUS52487",
    iat: Math.round(new Date().getTime() / 1000),
  },
  fs.readFileSync("AuthKey_T2RZXV4XG9.p8", "utf8"),
  {
    header: {
      alg: "ES256",
      kid: "T2RZXV4XG9",
    },
  }
);

const IS_PRODUCTION = false; // TODO: your check
const client = http2.connect(
  IS_PRODUCTION
    ? "https://api.push.apple.com"
    : "https://api.sandbox.push.apple.com"
);

const deviceToken = "ExponentPushToken[hPRX6vJ9Zy_qtwOxDeYrHe]";

const headers = {
  ":method": "POST",
  ":scheme": "https",
  "apns-topic": "mapsee2207031", // TODO: your application bundle ID
  ":path": "/3/device/" + deviceToken,
  authorization: `bearer ${token}`,
};

const request = client.request(headers);

request.setEncoding("utf8");

request.write(
  JSON.stringify({
    aps: {
      alert: {
        title: "\uD83D\uDCE7 You've got mail!",
        body: "Hello world! \uD83C\uDF10",
      },
    },
  })
);

request.on("response", (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

let data = "";
request.on("data", (chunk) => {
  data += chunk;
});

request.on("end", () => {
  console.log(`\n${data}`);
  client.close();
});

request.end();
