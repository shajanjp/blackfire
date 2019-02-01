const fs = require('fs');
const {https} = require('follow-redirects');
const githubRoot = 'https://github.com/shajanjp/blackfire/raw/master/';

function makeFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`create ${folderPath}/`);
  }
}

function makeFile(filePath, content) {
  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
    console.log(`create ${filePath}`);
  });
}

/*
Downloads file from github server and places it in local dir
*/
function githubDownload(localFile, remoteFile) {
  https
    .get(`${githubRoot}${remoteFile}`, response => {
      let resBody = [];
      response
        .on('data', chunk => {
          resBody.push(chunk);
        })
        .on('end', () => {
          let allBody = Buffer.concat(resBody).toString();
          fs.writeFile(localFile, allBody, err => {
            if (err) {
              console.error(`couldn't download ${localFile}`);
            } else {
              console.log(`create ${localFile}`);
            }
          });
        });
    })
    .on('error', () => {
      console.log(`couldn't download ${localFile}`);
    });
}

module.exports = {
  makeFile,
  makeFolder,
  githubDownload,
};
