var express = require('express');
var router = express.Router();

const blobdocument = require('../controllers/AzureBlob/getblobdocument');

router.route('/blob/:fn?')
    .get(blobdocument.get);
    
module.exports = router;
//export default router