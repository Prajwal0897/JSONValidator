const express = require('express');
const bodyParser = require('body-parser');
const deepDiff = require('deep-diff');

const app = express();
const port = 3000;

app.use(bodyParser.json());

function findDifferences(myjson, ondcjson) {
    return deepDiff(myjson, ondcjson);
}

app.post('/validate', (req, res) => {
    const { myjson, ondcjson } = req.body;

    const differences = findDifferences(myjson, ondcjson);

    if (!differences) {
        res.status(200).json({ message: 'JSON responses are identical.' });
    } else {
        res.status(400).json({ message: 'JSON responses are not identical.', differences });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
