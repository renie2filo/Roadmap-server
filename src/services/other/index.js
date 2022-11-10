const router = require('express').Router();

router.get('/business-redirect', async (req, res, next) => {
    try {
        res.status(301).redirect("https://filotrack.com")
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router