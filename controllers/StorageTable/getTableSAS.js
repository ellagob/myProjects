const { STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY } = require('../../config');
const { createTableService, TableUtilities } = require('azure-storage');


async function getTableSAS(tablename) {
    if (tablename != ""){
        try
        {
            const saskey = await getTableSASkey(tablename);
            return saskey;
        }
        catch(exsas){
            console.log(exsas);
            return "";
        }    
    }
    else
    {
        return "";
    }
}


async function getTableSASkey(tblname){
    return new Promise((resolve, reject) => {
        const storageaccountname = STORAGE_ACCOUNT_NAME;
        const storageaccountkey = STORAGE_ACCOUNT_KEY;
        try
        {
            const tableSvc = createTableService(storageaccountname, storageaccountkey);
            const now = new Date();
            now.setMinutes(now.getMinutes() - 100); 
    
            const tmr = new Date();
            tmr.setDate(tmr.getMinutes() + 100);        
            //tmr.setDate(tmr.getDate() + 1);        

            //Permissions: TableUtilities.SharedAccessPermissions.QUERY | TableUtilities.SharedAccessPermissions.ADD | TableUtilities.SharedAccessPermissions.DELETE,
            //Permissions: TableUtilities.SharedAccessPermissions.QUERY | TableUtilities.SharedAccessPermissions.ADD |  TableUtilities.SharedAccessPermissions.DELETE,

            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: TableUtilities.SharedAccessPermissions.QUERY | TableUtilities.SharedAccessPermissions.ADD |  TableUtilities.SharedAccessPermissions.DELETE,
                    Start: now,
                    Expiry: tmr
                },              
            };

            var tableSAS = tableSvc.generateSharedAccessSignature(tblname, sharedAccessPolicy);
            var host = tableSvc.host;

            const tblsasobj = {saskey: tableSAS, sashost: host };
            resolve(tblsasobj);
    
        }
        catch(exuacc){
            reject(exuacc);
        }
    });
}






module.exports = getTableSAS;
//export default getTableSAS

