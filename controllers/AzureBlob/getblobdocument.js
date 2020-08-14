const getAzureBlobDocument = require('./getAzureBlobDocument.js');
//var fs = require('fs');

async function getblob(req, res, next) {
    try {
      const context = {};   
      context.fn = req.params.fn;

      if (req.params.fn) {
        const bloburl = await getAzureBlobDocument(context);
        res.contentType("application/pdf");
        res.send(bloburl);
        ////res.status(200).json(bloburl);

        ////This is if creating the file first in server
        //const fnpath = await getAzureBlobDocument(context);
        //fs.readFile(fnpath,  function (err,data){
        //    res.contentType("application/pdf");
        //    res.send(data);
        //});
        ////res.send(fnpath);

      } else {
        res.status(404).end();
      }


    } catch (err) {
      next(err);
    }
  }
   


module.exports.get = getblob;
//export default getblob
