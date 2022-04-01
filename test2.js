import fetch from 'node-fetch';
import fs from 'fs';

const image = fs.readFileSync('2b2t2.txt', 'utf8')
const bearer = fs.readFileSync('bearer.txt', 'utf8').replace("\n","")

let beginx = 913
let beginy = 422
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

    if (lines[rows][chars] == "r") {
        color = 2
    } else if (lines[rows][chars] == "g") {
        color = 8
    } else if (lines[rows][chars] == "b") {
        color = 12
    } else {
        color = 27
    }

    const response = await fetch("https://gql-realtime-2.reddit.com/query", {
    "headers": {
        "accept": "*/*",
        "authorization": bearer,
        "content-type": "application/json",
    },
    "body": `{\"operationName\":\"setPixel\",\"variables\":{\"input\":{\"actionName\":\"r/replace:set_pixel\",\"PixelMessageData\":{\"coordinate\":{\"x\":${x},\"y\":${y}},\"colorIndex\":${color},\"canvasIndex\":0}}},\"query\":\"mutation setPixel($input: ActInput!) {\\n  act(input: $input) {\\n    data {\\n      ... on BasicMessage {\\n        id\\n        data {\\n          ... on GetUserCooldownResponseMessageData {\\n            nextAvailablePixelTimestamp\\n            __typename\\n          }\\n          ... on SetPixelResponseMessageData {\\n            timestamp\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
    "method": "POST"
    })
    const data = await response.json();
    console.log(data)
    let date_ob = new Date();
    console.log(" at " + date_ob.getHours() + ":" + date_ob.getMinutes())
    await sleep(305000) //wait 5 mins and 5 seconds for safety
}
