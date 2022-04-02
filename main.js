import fetch from 'node-fetch';
import fs from 'fs';

const image = fs.readFileSync('white.txt', 'utf8')
const bearer = fs.readFileSync('bearer.txt', 'utf8')
const accounts = bearer.split('\n')

let beginx = 969
let beginy = 486
let x = beginx
let y = beginy
let color = 8
let rows = 0
let chars = 0

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

for (let i = 0; i < image.length; i++) {
    for (const account of accounts) {
        const lines = image.split('\n')
        x = chars + beginx
        y = rows + beginy

        if (chars > lines[rows].length) {
            rows += 1
            chars = 0
        } else {
            chars += 1
        }
        
        if (rows > lines.length){
            rows = 0
            chars = 0
        }

        if (lines[rows][chars] == "r") { // red
            color = 2
        } else if (lines[rows][chars] == "g") { // light green
            color = 8
        } else if (lines[rows][chars] == "b") { // dark blue
            color = 12
        } else if (lines[rows][chars] == "o") { // orange
            color = 3
        } else if (lines[rows][chars] == "g") { // gray
            color = 29
        } else if (lines[rows][chars] == "w") { // white
            color = 31
        } else if (lines[rows][chars] == "y") { // yellow
            color = 4
        } else if (lines[rows][chars] == "1") { // dark green
            color = 6
        } else if (lines[rows][chars] == "2") { // light blue
            color = 14
        } else if (lines[rows][chars] == "3") { // dark purple
            color = 18
        } else if (lines[rows][chars] == "p") { // purple
            color = 19
        } else if (lines[rows][chars] == "4") { // light pink
            color = 23
        } else if (lines[rows][chars] == "5") { // brown
            color = 25 
        } else if (lines[rows][chars] == "6") { // light gray
            color = 30
        } else { // if it doesnt recognize the character it just puts black
            color = 27
        }

        const postResponse = await fetch("https://gql-realtime-2.reddit.com/query", {
        "headers": {
            "accept": "*/*",
            "authorization": account,
            "content-type": "application/json",
        },
        "body": `{\"operationName\":\"setPixel\",\"variables\":{\"input\":{\"actionName\":\"r/replace:set_pixel\",\"PixelMessageData\":{\"coordinate\":{\"x\":${x},\"y\":${y}},\"colorIndex\":${color},\"canvasIndex\":0}}},\"query\":\"mutation setPixel($input: ActInput!) {\\n  act(input: $input) {\\n    data {\\n      ... on BasicMessage {\\n        id\\n        data {\\n          ... on GetUserCooldownResponseMessageData {\\n            nextAvailablePixelTimestamp\\n            __typename\\n          }\\n          ... on SetPixelResponseMessageData {\\n            timestamp\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
        "method": "POST"
        })
        const postData = await postResponse.json();
        console.log(postData)
        let date_ob = new Date();
        console.log(" at " + date_ob.getHours() + ":" + date_ob.getMinutes() + " account: " + account)
    }
    await sleep(305000) //wait 5 mins and 5 seconds for safety
}