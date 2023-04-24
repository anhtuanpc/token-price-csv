var fs = require("fs");
var csv = require("csv-parser");
const axios = require("axios");

async function main() {
  const tokenData = readResultFile();
  for (let token in tokenData) {
    const price = await getTokenPrice(token);
    console.log(`price: ${price}`);
    const usdPrice = tokenData[token] * price;
    console.log(`Portfolio for token ${token} is ${usdPrice} USD`);
  }
}

function readResultFile() {
  const resultFileName = "result.txt";
  return JSON.parse(fs.readFileSync(`./${resultFileName}`, "utf-8"));
}

async function getTokenPrice(token) {
  const URL = `https://api.binance.com/api/v3/ticker/price?symbol=${token}USDT`;

  let resultPrice;
  await axios
    .get(URL)
    .then((response) => {
      resultPrice = response.data.price;
    })
    .catch((error) => {
      console.log(error);
      return 0; //default price
    })
    .finally(() => {
      console.log(`Get price of pair ${token}USDT successfully!`);
    });

  return parseFloat(resultPrice);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
