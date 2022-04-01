import fetch from 'node-fetch';

let x = 911
let y = 475
let color = 27

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

for (let i = 0; i < 10; i++) {
    const response = await fetch("https://gql-realtime-2.reddit.com/query", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "apollographql-client-name": "mona-lisa",
        "apollographql-client-version": "0.0.1",
        "authorization": "Bearer 1039344334193-Sd3EdwKuVJ52IxeIrjv9TESlZgJ0Ag",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "https://hot-potato.reddit.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": `{\"operationName\":\"setPixel\",\"variables\":{\"input\":{\"actionName\":\"r/replace:set_pixel\",\"PixelMessageData\":{\"coordinate\":{\"x\":${x},\"y\":${y}},\"colorIndex\":${color},\"canvasIndex\":0}}},\"query\":\"mutation setPixel($input: ActInput!) {\\n  act(input: $input) {\\n    data {\\n      ... on BasicMessage {\\n        id\\n        data {\\n          ... on GetUserCooldownResponseMessageData {\\n            nextAvailablePixelTimestamp\\n            __typename\\n          }\\n          ... on SetPixelResponseMessageData {\\n            timestamp\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
    "method": "POST"
    })
    const data = await response.json();
    console.log(data)
    y += 1

    
    await sleep(305000) //wait 5 mins and 5 seconds for safety
}