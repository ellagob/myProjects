var express = require('express');
var router = express.Router();

const GenerateSearchKey = require('../controllers/CognitiveSearch/getCognitiveSearchKey');

router.route('/csk/:account?')
    .get(GenerateSearchKey.get);
    
module.exports = router;
//export default router