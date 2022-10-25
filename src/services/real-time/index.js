const Pusher = require('pusher');
const router = require('router').Router();

const pusher = new Pusher({
    "appId": process.env.PUSHER_APP_ID,
    "key": process.env.PUSHER_KEY,
    "secret": process.env.PUSHER_SECRET,
    "cluster": process.env.PUSHER_CLUSTER,
    "encrypted": true
})

router.post('/update', async (req, res, next) => {
    const payload = req.body;
    try {
        pusher.trigger('update', 'issue', payload);
        res.send(payload)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router