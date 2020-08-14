
const { SEARCH_SERVICE_NAME, ADMIN_KEY, SEARCH_KEY, INDEX_NAME, API_VERSION, TBL_BOOKMARKS, TBL_RECENTVIEWS, STORAGE_ACCOUNT_NAME } = require('../../config');
const getAzureUserAccount = require('../StorageTable/getAzureUserAccount.js');
const getTableSAS = require('../StorageTable/getTableSAS.js');
const getTableSASAll = require('../StorageTable/getTableSASAll.js');

async function generateSearchKey(req, res, next) {
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
                context.groups = retuseracct.Groups;
                context.permission = retuseracct.Permission;

                const retSASbm = await getTableSAS(TBL_BOOKMARKS);
                if (retSASbm != "") {
                    context.sasbookmark = retSASbm.saskey;
                    context.sashost = retSASbm.sashost;
                }
                else
                {
                    context.sasbookmark = "";
                    context.sashost = "";
                }

                const retSASrv = await getTableSAS(TBL_RECENTVIEWS);
                if (retSASrv != "") {
                    context.sasrecent = retSASrv.saskey;
                    context.sashost = retSASrv.sashost;
                }
                else
                {
                    context.sasrecent = "";
                    context.sashost = "";
                }
    
                const retSAStable = await getTableSASAll();
                if (retSAStable != "") {
                    context.sastable = retSAStable.sasToken;
                }
                else
                {
                    context.sastable = "";
                }

                const cogsearchkey = await getSearchKey(context);
                res.send(cogsearchkey);     
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
   

async function getSearchKey(context) {
    try
    {
        //Check if requester has admin rights so return
        const adminkeyval = "";

        return {searchservice: SEARCH_SERVICE_NAME,
            adminkey: adminkeyval,
            searchkey: SEARCH_KEY,
            indexname: INDEX_NAME,
            storageaccount: STORAGE_ACCOUNT_NAME,
            usergroups: context.groups,
            useraccess: context.permission,
            sasbookmark: context.sasbookmark,
            sasrecent: context.sasrecent,
            sashost: context.sashost,
            bookmarktable: TBL_BOOKMARKS,
            recentviewtable: TBL_RECENTVIEWS,
            sastablecommon: context.sastable,
        };  

    }
    catch(exsas){     
        console.log(exsas);   
        return {searchservice: '', adminkey: '', searchkey: '', indexname: '' };
    }
}


module.exports.get = generateSearchKey;
//export default generateSearchKey