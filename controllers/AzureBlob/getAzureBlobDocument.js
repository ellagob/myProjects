const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
//const streamToBlob = require('stream-to-blob');
//const toBlobURL = require('stream-to-blob-url');
const { createWriteStream} = require('fs');
//const { join } = require('path');
const { STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY, BLOB_CONTAINER } = require('../../config');


async function getAzureBlobDocument(context) {

    if (context.fn != ""){
        try
        {
            const documentname = context.fn;
            const storageaccountname = STORAGE_ACCOUNT_NAME;
            const storageaccountkey = STORAGE_ACCOUNT_KEY;
            const blobcontainername = BLOB_CONTAINER;
            
            //const storageaccountname = "gdmspoc2";
            //const storageaccountkey = "x4BV2eou0wjq3QAgzhhVSF1/EtpKdiULR/6xdUYla4q5ZQBtxRMFkgoEjKR949M7Sxs6ZI/29ZYm8QSVEVP/wA==";
            //const blobcontainername = "container-documents";
            ////const accountconnurl = "DefaultEndpointsProtocol=https;AccountName=gdmspoc2;AccountKey=x4BV2eou0wjq3QAgzhhVSF1/EtpKdiULR/6xdUYla4q5ZQBtxRMFkgoEjKR949M7Sxs6ZI/29ZYm8QSVEVP/wA==;EndpointSuffix=core.windows.net";
            const blobclienturl = `https://${storageaccountname}.blob.core.windows.net/`;
        
            const sharedKeyCredential = new StorageSharedKeyCredential(storageaccountname, storageaccountkey);
            const blobservice = new BlobServiceClient(blobclienturl, sharedKeyCredential);
        
            const blobcontainerclient = blobservice.getContainerClient(blobcontainername);
        
            const blobfile = blobcontainerclient.getBlobClient(documentname);        
            ////console.log("this.blobfile:" + blobfile);
            //const blobfile = blobcontainerclient.getBlockBlobClient(documentname);        

            //const downloadBlockBlobResponse = await blobfile.download(0);
            ////console.log(downloadBlockBlobResponse);

            const arybuff = await blobfile.downloadToBuffer();

            ////Client only
            ////const azureblobbody = await downloadBlockBlobResponse.blobBody;
            
            ////NodeJS - no need since we download the buffer
            //const azureStreambody = downloadBlockBlobResponse.readableStreamBody;

            ////Web/Client only
            //const bloburlb64 = await blobToURL(azureblobbody);
            //return bloburlb64;


            //Using download but creating the file in server first
            //Working proto
            //const filepath = join(__dirname, 'test3.pdf');
            //await downloadToFile(filepath,downloadBlockBlobResponse);
            //return filepath;
                                    
            //const streamstr = await streamToString(downloadBlockBlobResponse.readableStreamBody);
            //return streamstr;

            //return azureStreambody;


            return arybuff;
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


async function blobToURL(blobvalue){
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = () => {
        const dataUrl = fileReader.result;  
        var base64data = dataUrl; 
        resolve(base64data);   
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(blobvalue);
    });
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      //readableStream.setEncoding(null);
      readableStream.on("data", data => {
        chunks.push(data.toString());
      });
      //readableStream.on('readable', function() {
      //  while ((chunk=readableStream.read()) != null) {
      //    data += chunk;
      //  }
      //});

      readableStream.on("end", () => {
        resolve(chunks.join(""));
        //resolve(chunks.toString());
      });
      readableStream.on("error", reject);
    });
}

function downloadToFile(path, blob) {
    console.log(path);
    return new Promise((resolve, reject) => {
      const fileStream = createWriteStream(path);
      blob.readableStreamBody.on('error', reject);
      fileStream.on('error', reject);
      fileStream.on('close', resolve);
      blob.readableStreamBody.pipe(fileStream);
    });
}


module.exports = getAzureBlobDocument;
//export default getAzureBlobDocument

