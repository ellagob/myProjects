var express = require('express');
var router = express.Router();

const GeneratesasToken = require('../controllers/AzureBlob/getSASToken');

router.route('/sas/:scope?')
    .get(GeneratesasToken.get);
    
module.exports = router;
//export default router