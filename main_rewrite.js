import fetch from 'node-fetch';
import fs from 'fs';

let image = fs.readFileSync('92_2.txt', 'utf8')

let beginx = 565
let beginy = 80
let x = beginx
let y = beginy
let color = 8
let rows = 0
let chars = 0
let canvasIndex = 3

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


for (let u = 0; u < 1; u++) {
    console.log("Starting!")
    chars, rows = 0
    x = beginx + chars
    y = beginy + rows
    let image = fs.readFileSync('92_2.txt', 'utf8')
    for (let i = 0; i < (chars+1)*image.length; i++) {
        let image = fs.readFileSync('92_2.txt', 'utf8')
        const lines = image.split('\n')
        let accountsList = fs.readFileSync('accounts.txt', 'utf8').split("\n")
        let bearer = fs.readFileSync('bearer.txt', 'utf8')
        let accounts = bearer.split('\n')
        console.log(lines[rows])

        for (const account of accounts) {
            x = chars + beginx
            y = rows + beginy
            if (lines[rows][chars] == "r") { // red
                color = 2
            } else if (lines[rows][chars] == "g") { // light green
                color = 8
            } else if (lines[rows][chars] == "b") { // dark blue
                color = 12
            } else if (lines[rows][chars] == "o") { // orange
                color = 3
            } else if (lines[rows][chars] == "x") { // gray
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
            } else if (lines[rows][chars] == "q") { // black
                color = 27
            } else { // if it doesnt recognize the character it just puts white
                color = 31
            }


            let goodAccountResponse = await fetch("https://gql-realtime-2.reddit.com/query", {
                "headers": {
                "accept": "*/*",
                "authorization": "Bearer -dWVwrJ2llqhft1Oi9Lu4DA-W8he8qg",//account.trim(),
                "content-type": "application/json",
                },
                "body": `{\"operationName\":\"pixelHistory\",\"variables\":{\"input\":{\"actionName\":\"r/replace:get_tile_history\",\"PixelMessageData\":{\"coordinate\":{\"x\":${x},\"y\":${y}},\"colorIndex\":${color},\"canvasIndex\":${canvasIndex}}}},\"query\":\"mutation pixelHistory($input: ActInput!) {\\n  act(input: $input) {\\n    data {\\n      ... on BasicMessage {\\n        id\\n        data {\\n          ... on GetTileHistoryResponseMessageData {\\n            lastModifiedTimestamp\\n            userInfo {\\n              userID\\n              username\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
                "method": "POST",
            });
            let goodAccount = await goodAccountResponse.json();
            console.log(goodAccount.data.act.data[0].data.userInfo.username + `: ${x},${y} & color: ${color}`)

            if (accountsList.includes(goodAccount.data.act.data[0].data.userInfo.username) == false) {
                console.log("place pixel")
                const postResponse = await fetch("https://gql-realtime-2.reddit.com/query", {
                "headers": {
                    "accept": "*/*",
                    "authorization": account.trim(),
                    "content-type": "application/json",
                },
                "body": `{\"operationName\":\"setPixel\",\"variables\":{\"input\":{\"actionName\":\"r/replace:set_pixel\",\"PixelMessageData\":{\"coordinate\":{\"x\":${x},\"y\":${y}},\"colorIndex\":${color},\"canvasIndex\":${canvasIndex}}}},\"query\":\"mutation setPixel($input: ActInput!) {\\n  act(input: $input) {\\n    data {\\n      ... on BasicMessage {\\n        id\\n        data {\\n          ... on GetUserCooldownResponseMessageData {\\n            nextAvailablePixelTimestamp\\n            __typename\\n          }\\n          ... on SetPixelResponseMessageData {\\n            timestamp\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
                "method": "POST"
                })
                const postData = await postResponse.json();
                const postString = JSON.stringify(postData)
                console.log(postData)
                if (postString.includes("error")) {
                    console.log("error: ")
                    console.log(postString)
                    console.log(lines[rows].length)
                } else {
                    chars += 1
                    if (chars >= lines[rows].length) {
                        chars = 0
                        rows += 1
                        console.log("next line")
                    }
                    await sleep(305000/accounts.length)
                }
            }
            else if (accountsList.includes(goodAccount.data.act.data[0].data.userInfo.username) === true) {
                console.log("already good pixel")
                chars += 1
            }
            else {
                console.log("error!")
                console.log(accountsList + ": " + goodAccount.data.act.data[0].data.userInfo.username)
            }
            console.log(i)
        }
        //await sleep(302000)
    }
    chars = 0
    rows = 0
}