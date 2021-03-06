const express = require("express");
const request = require("request");
const stories = require("./stories");

const app = express();
app.use((req, res, next) => {
   console.log(
      "Request detiles.Method: ",
      req.method,
      "Original url: ",
      req.originalUrl,
   );
   next();
});
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");

   next();
});
app.get("/ping", (req, res) => {
   res.send("pong");
});

app.get("/stories", (req, res) => {
   res.json(stories);
});
app.get("/stories/:title", (req, res) => {
   const { title } = req.params;

   res.json(stories.filter(story => story.title.includes(title)));
});
app.get("/topstories", (req, res, next) => {
   request(
      { url: "https://hacker-news.firebaseio.com/v0/topstories.json" },
      (error, response, body) => {
         if (error || response.statusCode !== 200) {
            console.log("going to next");

            return next(new Error("Error requesting top stories"));
         }
         res.json(JSON.parse(body));
      },
   );
});
app.use((err, re, res, next) => {
   console.log("err", err);

   res.status(500).json({
      type: "error",
      message: err.message,
   });
});
const PORT = 3000;
app.listen(PORT, () => console.log(`listining on ${PORT}`));
