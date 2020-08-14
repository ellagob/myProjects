const {
    AccountSASPermissions,
    AccountSASResourceTypes,
    AccountSASServices,
    SASProtocol,
    generateAccountSASQueryParameters,
    generateBlobSASQueryParameters,
    ContainerSASPermissions,
    ServiceURL,
    StorageSharedKeyCredential,
    StorageURL,
    BlobSASPermissions
  } = require('@azure/storage-blob');

const { STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY, BLOB_CONTAINER, API_VERSION, TBL_BOOKMARKS } = require('../../config');


async function getTableSASAll() {
    try
    {
        const saskey = await getTableSASkey();
        return saskey;
    }
    catch(exsas){
        console.log(exsas);
        return "";
    }    
}


async function getTableSASkey(){
    return new Promise((resolve, reject) => {
        try
        {
            const now = new Date();
            now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server
      
            const tmr = new Date();
            tmr.setDate(tmr.getDate() + 1);        
      
            ////Storage Account Level Permissions
            //AccountSASPermissions, AccountSASServices, AccountSASResourceTypes
      
            //AccountSASPermissions.parse('rwdlacup')
            //r = Read  w = Write   d = Delete   l = List   a = Add
            //c = Create   u = Update    p = Process
      
            //AccountSASServices.parse('b')
            //b = Blob  q = Queue    t = Table    f = File
      
            //AccountSASResourceTypes.parse('sco')
            //s = Service    c = Container    o = Object
      
            ////To limit by IP Range use (Optional) 
            //ipRange: { start: '0.0.0.0', end: '255.255.255.255' },
      
            const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
            const sasToken = generateAccountSASQueryParameters(
                {
                  expiresOn: tmr,
                  permissions: AccountSASPermissions.parse('rwdlacu').toString(),
                  protocol: SASProtocol.HTTPSandHTTP,
                  resourceTypes: AccountSASResourceTypes.parse('sco').toString(),
                  services: AccountSASServices.parse('t').toString(),
                  startsOn: now,
                  version: '2019-10-10',
                },
                sharedKeyCredential,
              ).toString();
              
            const tblsasobj = {accountname: STORAGE_ACCOUNT_NAME,
                sasToken};
            resolve(tblsasobj);
    
        }
        catch(exuacc){
            reject(exuacc);
        }        
    });
}


module.exports = getTableSASAll;
//export default getTableSASAll

