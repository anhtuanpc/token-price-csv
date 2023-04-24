var fs = require("fs");
var csv = require("csv-parser");
const axios = require("axios");

const TX_TYPE = {
  IN: "DEPOSIT",
  OUT: "WITHDRAW",
};

async function main() {
  await readStream();
}

async function readStream() {
  let data = {};

  fs.createReadStream("./transactions_demo.csv")
    .pipe(csv())
    .on("data", function (row) {
      let token = row.token;
      if (data[row.token] === undefined) {
        data[row.token] = 0;
      }
      if (TX_TYPE.IN === row.transaction_type) {
        data[row.token] += parseFloat(row.amount);
      } else {
        data[row.token] -= parseFloat(row.amount);
      }
    })
    .on("end", function () {
      writeResultFile(data);
      console.log("Data loaded");
    });
}

function writeResultFile(data) {
  const resultFileName = "result.txt";
  fs.writeFile(`./${resultFileName}`, JSON.stringify(data), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
