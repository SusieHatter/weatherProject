const express = require("express");
const https = require("https");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const units = "metric";
  const apiKey = "40dec95d7c9898c1fcc039795934a278";
  const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&units=${units}&appid=${apiKey}`;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.list[0].main.temp;
      const description = weatherData.list[0].weather[0].description;
      const icon = weatherData.list[0].weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.send(`<h1>The temperature in ${query} is ${temp} degrees Celsius.</h1>
      <h3>The weather is currently ${description}</h3>
      <img src="${iconUrl}" alt="icon">`);
    });
  });
});

app.listen(3000, function () {
  console.log("Welcome!");
});
