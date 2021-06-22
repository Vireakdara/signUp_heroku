const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const app = express();


app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})


app.post("/", (req, res) => { // First capture data from main page using bodyparser
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.email;

    // Create array object (To fit the sturcture api) from mainchip
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    // Convert array object ot JSON
    const jsonData = JSON.stringify(data)
    const url = "https://us6.api.mailchimp.com/3.0/lists/3103f270a9"
    // Node document https.request()
    const options = {
        method: "POST",
        auth: "toshiro:120305d01c9a6440887a15cf31307f4e-us6"
    }

    const request = https.request(url, options, (response) => {

        console.log("stausCode:", response.statusCode);
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    // Send data to Mailchip
    request.write(jsonData);
    request.end();

})

app.post("/failure", (req, res) => {
    res.redirect("/")
})
app.post("/success", (req, res) => {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, () => {
    console.log("This server is running on port 3000");
})

// API Key
// 120305d01c9a6440887a15cf31307f4e-us6

// List Id
// 3103f270a9
