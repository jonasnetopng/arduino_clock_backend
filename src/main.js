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
        function timeConverter(UNIX_timestamp) {
          var a = new Date(UNIX_timestamp * 1000);
          var hour = a.getHours();
          var min = a.getMinutes();
          var sec = a.getSeconds();
          if (hour < 10) {
            hour = "0" + hour;
          }
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          var time = hour + ":" + min + ":" + sec;
          return time;
        }

        const { data } = response;
        console.log(data)
        console.log(timeConverter(data.unixtime))

        res.json({
          weather,
          time: {
            time: timeConverter(data.unixtime),
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

// const char *ssid = "ALHN-B945";
// const char *password = "escola91148229";

app.listen(port, () => {
  console.log("Example app listening on port " + port);
});
