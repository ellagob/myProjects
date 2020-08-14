
const { SEARCH_SERVICE_NAME, ADMIN_KEY, SEARCH_KEY, INDEX_NAME, API_VERSION, TBL_BOOKMARKS, TBL_RECENTVIEWS } = require('../../config');
const getAzureUserAccount = require('../StorageTable/getAzureUserAccount.js');


async function getGDMSPermission(req, res, next) {
    try {
      const context = {};   
      context.account = req.params.account;

      if (req.params.account) {

        ////Check if user account (email) has access
        const retuseracct = await getAzureUserAccount(req.params.account);
        if (retuseracct == "not found"){
            res.send("Access Denied"); 
        } else {
            if (retuseracct.Active === true){
                res.send("Access Granted");     
            }
            else
            {
                res.send("Access Denied"); 
            }            
        }
        
      }
      else
      {
        res.status(404).end();
      }

    } catch (err) {
      next(err);
    }
}
   

module.exports.get = getGDMSPermission;
//export default getGDMSPermission