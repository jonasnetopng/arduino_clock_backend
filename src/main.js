const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  exposedHeaders: "Content-Range, X-Total-Count"
}));

const url =
  "https://api.openweathermap.org/data/2.5/weather?q=Curitiba&units=imperial&appid=76c8fdc8db07e476c13e988cb7a5690d";

const port = process.env.PORT || 3333;
app.get("/dados", (req, res) => {
  try {
    axios.get(url).then((response) => {
      const data = response.data;
      function farh_to_celsius(farh) {
        return ((farh - 32) * 5) / 9;
      }
      const weather = {
        temp: parseInt(farh_to_celsius(data.main.temp).toFixed(1)),
        state: (data.weather[0].main).toLowerCase(),
      };
      axios.get("http://worldtimeapi.org/api/timezone/America/Sao_Paulo").then((response) => {
        const { data: { utc_datetime, day_of_year, unixtime } } = response;
        const date = new Date(unixtime * 1000);
        const date_time = new Date(utc_datetime);
        const hour = date_time.getHours();
        const min = date_time.getMinutes();
        const sec = date_time.getSeconds();

        res.json({
          weather,
          time: {
            hour,
            min,
            sec,
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            day_of_year,
          },
          alarm: {
            hour: 23,
            min: 59,
          }
        });
      });
    });
  } catch (error) {
    res.json({ error })
  }
});

app.listen(port, () => {
  console.log("Example app listening on port " + port);
});
