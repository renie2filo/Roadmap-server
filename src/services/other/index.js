const router = require('express').Router();

router.get('/business-redirect', async (req, res, next) => {
    try {
        res.redirect('https://filotrack.com/business')
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router