var express = require('express');
var router = express.Router();

const GetBookmarkContents = require('../controllers/StorageTable/getbookmarkContents');

router.route('/bookmark/:account?')
    .get(GetBookmarkContents.get);
    
module.exports = router;
//export default router