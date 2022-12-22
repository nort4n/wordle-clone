const fs = require("fs");
const dict = require("./gerDict.json");
const dictRev = [];

for (let i = 0; i < dict.length; i++) {
    if (dict[i].length === 6) {
        dictRev.push(dict[i]);
    }
}

console.log(dictRev.length);

fs.writeFile("dictRev.json", JSON.stringify(dictRev), (err) =>
    console.log("error")
);
