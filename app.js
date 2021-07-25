const express = require("express");
const https = require("https");
const app = express();
const { apiKey } = require("./config.js");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", express.static("public"));

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&units=${units}&appid=${apiKey}`;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.list[0].main.temp;
      const description = weatherData.list[0].weather[0].description;
      const icon = weatherData.list[0].weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Suez+One&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="assets/styles.css" />
    <title>Weather App</title>
  </head>
  <body>
    <h1>The temperature in ${query} is ${temp} degrees Celsius.</h1>
    <h3>The weather is currently ${description}</h3>
    <img src="${iconUrl}" alt="icon">
  </body>
</html>
      `);
    });
  });
});

app.listen(3000, function () {
  console.log("Welcome!");
});
