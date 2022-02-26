const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.post('/', authCtrl.create)
// router.route('/').post(authCtrl.create);



module.exports = router