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

async function generateSAS(req, res, next) {
    try {
      const context = {};   
      context.scope = req.params.scope;

      if (req.params.scope) {

        if (req.params.scope == "storage"){
            const sasurl = await getSAS(context);
            res.send(sasurl); 
        }
        if (req.params.scope == "blob"){
            const sasurl = await getSASblob(context);
            res.send(sasurl); 
        }
        if (req.params.scope == "table"){
            const sasurl = await getSASTable(context);
            res.send(sasurl); 
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
   

async function getSAS(context) {
    try
    {
        //const serviceURL = getBlobServiceUrl();
        const serviceURL = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/`;

        const now = new Date();
        now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server
        //const starttimestr = now.toISOString();

        const tmr = new Date();
        tmr.setDate(tmr.getDate() + 1);        
        //const endtimestr = tmr.toISOString();

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
              permissions: AccountSASPermissions.parse('r').toString(),
              protocol: SASProtocol.HTTPSandHTTP,
              resourceTypes: AccountSASResourceTypes.parse('sco').toString(),
              services: AccountSASServices.parse('b').toString(),
              startsOn: now,
              version: '2019-10-10',
            },
            sharedKeyCredential,
          ).toString();
          
        return {accountname: STORAGE_ACCOUNT_NAME,
            sasToken,
            containerName: BLOB_CONTAINER,
            sasURL: `${serviceURL}?${sasToken}`};  

    }
    catch(exsas){     
        console.log(exsas);   
        return {accountname: '', sasToken: '', sasURL: exsas };
    }
}

//Modules for ContainerSASPermissions
async function getSASblob(context) {
    try
    {
        const serviceURL = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/`;
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

        ////Other options
        //cacheControl: "cache-control-override",
        //contentDisposition: "content-disposition-override",
        //contentEncoding: "content-encoding-override",
        //contentLanguage: "content-language-override",
        //contentType: "content-type-override",

        const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
        const sasToken = generateBlobSASQueryParameters(
            {
              expiresOn: tmr,
              permissions: ContainerSASPermissions.parse('r').toString(),
              protocol: SASProtocol.HTTPSandHTTP,
              containerName: BLOB_CONTAINER,   
              startsOn: now,
              version: '2019-10-10',
            },
            sharedKeyCredential,
          ).toString();
        
        const containerUrl="https://"+STORAGE_ACCOUNT_NAME+".blob.core.windows.net/"+BLOB_CONTAINER+"?"+sasToken;

        return { accountname: STORAGE_ACCOUNT_NAME,
            sasToken,
            containerUrl };  

    }
    catch(exsas){     
        console.log(exsas);   
        return {accountname: '', sasToken: '', containerUrl: exsas };
    }
}

async function getSASTable(context) {
  try
  {
      //const serviceURL = getBlobServiceUrl();
      const serviceURL = `https://${STORAGE_ACCOUNT_NAME}.table.core.windows.net/`;

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
        
      return {accountname: STORAGE_ACCOUNT_NAME,
          sasToken};  

  }
  catch(exsas){     
      console.log(exsas);   
      return {accountname: '', sasToken: '', sasURL: exsas };
  }
}

async function getSASTableAll() {
  try
  {
      //const serviceURL = getBlobServiceUrl();
      const serviceURL = `https://${STORAGE_ACCOUNT_NAME}.table.core.windows.net/`;

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
        
      return {accountname: STORAGE_ACCOUNT_NAME,
          sasToken};  

  }
  catch(exsas){     
      console.log(exsas);   
      return {accountname: '', sasToken: '' };
  }
}



//new UserDelegationKeyCredential(accountName: string, userDelegationKey: UserDelegationKey)

////Modules for ContainerSASPermissions / generateBlobSASQueryParameters 
////Using UserDelegationKey
////UserDelegationKeyCredential  /  UserDelegationKey
async function getSASADblob(context) {
  try
  {
      const serviceURL = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/`;
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

      ////Other options
      //cacheControl: "cache-control-override",
      //contentDisposition: "content-disposition-override",
      //contentEncoding: "content-encoding-override",
      //contentLanguage: "content-language-override",
      //contentType: "content-type-override",

      const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
      const sasToken = generateBlobSASQueryParameters(
          {
            expiresOn: tmr,
            permissions: ContainerSASPermissions.parse('r').toString(),
            protocol: SASProtocol.HTTPSandHTTP,
            containerName: BLOB_CONTAINER,   
            startsOn: now,
            version: '2019-10-10',
          },
          sharedKeyCredential,
        ).toString();
      
      const containerUrl="https://"+STORAGE_ACCOUNT_NAME+".blob.core.windows.net/"+BLOB_CONTAINER+"?"+sasToken;

      return { accountname: STORAGE_ACCOUNT_NAME,
          sasToken,
          containerUrl };  

  }
  catch(exsas){     
      console.log(exsas);   
      return {accountname: '', sasToken: '', containerUrl: exsas };
  }
}


//Modules for BlobSASPermissions


function getDataUTCFormat(datev){
    try
    {
        var dat = datev;
        var dd = dat.getDate();
        var mm = dat.getMonth() + 1;
        var yyyy = dat.getFullYear();
        var hh = dat.getHours();
        var nn = dat.getMinutes();
        var ss = dat.getSeconds();
        var dts = dat.toUTCString();
        var ts = dts.split(" ")[dts.split(" ").length-1];
        var fullstrdate=yyyy+"-"+mm+"-"+dd+"T"+hh+":"+nn+":"+ss+ts;        
        return fullstrdate;
    }
    catch(edt){
        var dts2 = dat.toUTCString();
        return dts2;
    }
}


module.exports.get = generateSAS;
//export default generateSAS
