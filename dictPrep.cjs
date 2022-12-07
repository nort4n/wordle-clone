const fs = require("fs");
const dict = require("./gerDict.json");
const dictRev = [];
const umlaute = ["ö", "Ö", "Ä", "Ü", "ä", "ü", "ß"];
let flag = false;

for (let i = 0; i < dict.length; i++) {
    for (let j = 0; j < umlaute.length; j++) {
        if (dict[i].includes(umlaute[j])) {
            flag = true;
            continue;
        }
    }
    if (dict[i].length === 5 && !flag) {
        dictRev.push(dict[i]);
    }
    flag = false;
}

fs.writeFile("dictRev.json", JSON.stringify(dictRev), (err) =>
    console.log("error")
);
