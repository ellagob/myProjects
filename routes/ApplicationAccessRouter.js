var express = require('express');
var router = express.Router();

const getGDMSPermission = require('../controllers/CognitiveSearch/getUserPermission');

router.route('/gdms/:account?')
    .get(getGDMSPermission.get);
    
module.exports = router;
//export default router