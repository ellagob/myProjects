const { STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY, STORAGE_ACCOUNT_ENDPOINT, TBL_USERS } = require('../../config');
const { createTableService, TableQuery } = require('azure-storage');

async function getAzureTableContents(accountemail, tablename) {

    if (accountemail != ""){
        try
        {
            const entityobjs = await getEntities(accountemail, tablename);
            return entityobjs;
        }
        catch(exabd){
            console.log(exabd);
            return "";
        }    
    }
    else
    {
        return "";
    }

}

async function getEntities(accountemail, tablename){
    return new Promise((resolve, reject) => {
        const storageaccountname = STORAGE_ACCOUNT_NAME;
        const storageaccountkey = STORAGE_ACCOUNT_KEY;
        try
        {
            const tableSvc = createTableService(storageaccountname, storageaccountkey);
            //const tableSvc = createTableService("DefaultEndpointsProtocol=https;AccountName=gdmspoc2;AccountKey=x4BV2eou0wjq3QAgzhhVSF1/EtpKdiULR/6xdUYla4q5ZQBtxRMFkgoEjKR949M7Sxs6ZI/29ZYm8QSVEVP/wA==;EndpointSuffix=core.windows.net");

            const querytable = new TableQuery().where('PartitionKey eq ?',accountemail);
            //querytable.where('Partition eq ?',accountemail);
            //querytable.top(100);
    


            tableSvc.queryEntities(tablename, querytable, null, function(error, result, response){
                if(!error){
                    // result contains the entity
                    //console.log(result);
                    //console.log(response.body);
                    if (response.isSuccessful == true){
                        //resolve(response.body);
                        resolve(result);
                    }
                    else
                    {
                        resolve("not found");
                    }
                }
                else
                {                    
                    resolve("not found");
                }
            });    
        }
        catch(exuacc){
            reject(exuacc);
        }
    });
}


module.exports = getAzureTableContents;
//export default getAzureTableContents

