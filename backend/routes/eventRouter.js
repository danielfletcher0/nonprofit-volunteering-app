const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    const str = [{
        "name": "Foo Bar",
        "event": "Tester"
    }];
    res.end(JSON.stringify(str));
});

router.post('/addEvent', (req, res) => {
    res.end('NA');
});

module.exports = router;