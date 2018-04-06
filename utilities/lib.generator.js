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

function githubDownload(localFile, remoteFile) {
  https.get(`${githubRoot}${remoteFile}`, (response) => {
    response.on('data', (data) => {
      fs.writeFile(localFile, data, 'utf8', (err) => {
        if (!err) { console.log(`create ${localFile}`); } else { console.error(`couldn't download ${localFile}`); }
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
	githubDownload
}