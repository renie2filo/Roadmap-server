const router = require('express').Router();

router.get('/business-redirect', async (req, res, next) => {
    try {
        res.send('<script>window.location.href="https://filotrack.com";</script>')
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router