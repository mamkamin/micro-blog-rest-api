const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Le users resources\n");
});

module.exports = router;