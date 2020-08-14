
const { SEARCH_SERVICE_NAME, ADMIN_KEY, SEARCH_KEY, INDEX_NAME, API_VERSION, TBL_BOOKMARKS, TBL_RECENTVIEWS } = require('../../config');
const getAzureTableContents = require('./getAzureTableContents.js');

async function getbookmarkContents(req, res, next) {
    try {
      const context = {};   
      context.account = req.params.account;

      if (req.params.account) {

        const tblEntContents = await getAzureTableContents(req.params.account, TBL_BOOKMARKS);
        res.send(tblEntContents);     
        
      }
      else
      {
        res.status(404).end();
      }

    } catch (err) {
      next(err);
    }
}
   

module.exports.get = getbookmarkContents;
//export default getbookmarkContents