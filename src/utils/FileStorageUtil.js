import RNFS from "react-native-fs";
//For More Info and Features, Ref: https://github.com/itinance/react-native-fs

//Make A New  Directory to Store on the Private (or) External Directory
export function makeDir(folderName, successCb, failureCb, isPrivate) {
  let dirPath = "";
  if (!isPrivate) {
    dirPath = RNFS.ExternalDirectoryPath + "/" + folderName;
  } else {
    dirPath = RNFS.DocumentDirectoryPath + "/" + folderName;
  }

  RNFS.exists(dirPath)
    .then(isExists => {
      if (!isExists) {
        RNFS.mkdir(dirPath)
          .then(() => {
            console.log("External Dir Created:" + dirPath);
            RNFS.exists(dirPath).then(isExists => {
              if (isExists) {
                // console.log("Ext Directory Created!");
                successCb();
              }
            });
          })
          .catch(err => {
            failureCb(err);
            // console.log("RNFS MkDir:" + err);
          });
      }
    })
    .catch(err => {
      // console.log("RNFS Already Exists:" + err)
      successCb(err);
    });
}

export function createTxtFile(fileName, content, successCb, failureCb) {
  var filePath = RNFS.DocumentDirectoryPath + "/" + fileName + ".txt";

  RNFS.writeFile(filePath, content, "utf8")
    .then(success => {
      console.log("FILE WRITTEN!");
      successCb(filePath);
    })
    .catch(err => {
      //   console.log(err.message);
      failureCb(err);
    });
}

export function writeToFile(filePath, content, successCb, failureCb) {
  RNFS.appendFile(filePath, content, "utf8")
    .then(success => {
      console.log("Content Appended to File!");
      successCb();
    })
    .catch(err => {
      //   console.log(err.message);
      failureCb(err);
    });
}

export function moveFile(filePath, fileName, successCb, failureCb) {
  let destPath = RNFS.ExternalDirectoryPath + "/AFLS/" + fileName;

  RNFS.moveFile(filePath, destPath)
    .then(() => {
      console.log("File Moved!");
      successCb();
    })
    .catch(err => {
      //   console.log("RNFS Move:" + err);
      failureCb(err);
    });
}

export function deleteFilePath(filePath, successCb, failureCb) {
  RNFS.unlink(filePath)
    .then(() => {
      console.log("File Path Deleted!");
      successCb();
    })
    .catch(err => {
      //   console.log("RNFS unlink:" + err);
      failureCb(err);
    });
}
