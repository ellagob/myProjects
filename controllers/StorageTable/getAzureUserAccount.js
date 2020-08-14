const { STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY, STORAGE_ACCOUNT_ENDPOINT, TBL_USERS } = require('../../config');
const { createTableService } = require('azure-storage');

async function getAzureUserAccount(accountemail) {

    if (accountemail != ""){
        try
        {
            const useracct = await getUserAccount(accountemail);
            return useracct;
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

async function getUserAccount(accemail){
    return new Promise((resolve, reject) => {
        const storageaccountname = STORAGE_ACCOUNT_NAME;
        const storageaccountkey = STORAGE_ACCOUNT_KEY;
        try
        {
            const tableSvc = createTableService(storageaccountname, storageaccountkey);
            //const tableSvc = createTableService("DefaultEndpointsProtocol=https;AccountName=gdmspoc2;AccountKey=x4BV2eou0wjq3QAgzhhVSF1/EtpKdiULR/6xdUYla4q5ZQBtxRMFkgoEjKR949M7Sxs6ZI/29ZYm8QSVEVP/wA==;EndpointSuffix=core.windows.net");

            tableSvc.retrieveEntity(TBL_USERS, 'gdms', accemail, function(error, result, response){
                if(!error){
                    // result contains the entity
                    //console.log(result);
                    //console.log(response.body);
                    if (response.isSuccessful == true){
                        resolve(response.body);
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


module.exports = getAzureUserAccount;
//export default getAzureUserAccount

