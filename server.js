const express = require('express');
const bodyParser = require('body-parser');
const deepDiff = require('deep-diff');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// function findDifferences(myjson, ondcjson) {
//     return deepDiff(myjson, ondcjson);
// }

app.post('/validate', (req, res) => {
    const { myjson, ondcjson } = req.body;

    const differences = findKeyDifferences(myjson, ondcjson);

    if (Object.keys(differences).length === 0) {
        res.status(200).json({ message: 'JSON responses have identical keys.' });
    } else {
        res.status(400).json({ message: 'JSON responses have differing keys.', differences });
    }
});

function findKeyDifferences(obj1, obj2) {
    const keys1 = getObjectKeys(obj1);
    const keys2 = getObjectKeys(obj2);

    const uniqueKeys1 = keys1.filter(key => !keys2.includes(key));
    const uniqueKeys2 = keys2.filter(key => !keys1.includes(key));

    const nestedDifferences = findNestedKeyDifferences(obj1, obj2);

    return {
        uniqueKeysInObj1: uniqueKeys1,
        uniqueKeysInObj2: uniqueKeys2,
        nestedDifferences,
    };
}

function findNestedKeyDifferences(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return {};
    }

    const keys1 = getObjectKeys(obj1);
    const keys2 = getObjectKeys(obj2);

    const uniqueKeys1 = keys1.filter(key => !keys2.includes(key));
    const uniqueKeys2 = keys2.filter(key => !keys1.includes(key));

    const nestedDifferences = {};

    keys1.forEach(key => {
        if (obj2.hasOwnProperty(key)) {
            nestedDifferences[key] = findKeyDifferences(obj1[key], obj2[key]);
        } else {
            nestedDifferences[key] = {
                uniqueKeysInObj1: getObjectKeys(obj1[key]),
                uniqueKeysInObj2: [],
                nestedDifferences: {},
            };
        }
    });

    keys2.forEach(key => {
        if (!obj1.hasOwnProperty(key)) {
            nestedDifferences[key] = {
                uniqueKeysInObj1: [],
                uniqueKeysInObj2: getObjectKeys(obj2[key]),
                nestedDifferences: {},
            };
        }
    });

    return nestedDifferences;
}

function getObjectKeys(obj) {
    return obj ? (Array.isArray(obj) ? [] : Object.keys(obj)) : [];
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
