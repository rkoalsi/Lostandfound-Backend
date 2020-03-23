const express = require('express');
const app = express()
const port = 3010
const path = require('path')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.listen(port, () => {console.log(`You are now listening on port: ${port}`)} )