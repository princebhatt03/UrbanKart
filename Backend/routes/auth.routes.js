const { googleLogin } = require('../controllers/google.controller');
const { googleAdminLogin } = require('../controllers/admin.google.controller');

const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('Test Pass');
});

router.get('/google', googleLogin);
router.get('/google-login', googleAdminLogin);

module.exports = router;
