const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const url =
  "https://api.openweathermap.org/data/2.5/weather?q=Curitiba&units=imperial&appid=76c8fdc8db07e476c13e988cb7a5690d";

const port = process.env.PORT || 3333;
app.get("/dados", (req, res) => {
  try {
    axios.get(url).then((response) => {
      const data = response.data;
      const now = new Date();
      const year = now.getFullYear().toString().substr(-2);
      function farh_to_celsius(farh) {
        return ((farh - 32) * 5) / 9;
      }
      const weather = {
        temp: parseInt(farh_to_celsius(data.main.temp).toFixed(1)),
        state: (data.weather[0].main).toLowerCase(),
      };
      res.json({
        weather,
        time: {
          hour: now.getHours(),
          min: now.getMinutes(),
          sec: now.getSeconds(),
          year: parseInt(year),
          month: now.getMonth(),
          day: now.getDate(),
          weekday: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][now.getDay()],
        },
      });
    });
  } catch (error) {
    res.json({ error })
  }
});

// const char *ssid = "ALHN-B945";
// const char *password = "escola91148229";

app.listen(port, () => {
  console.log("Example app listening on port " + port);
});
