const express = require('express');
const excelJS = require("exceljs");
const fs = require('fs');
const path = require('path')

const app = express();
const port = 3000;


app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


app.get('/listFiles', async (req, res) => {
  try {
    
    const directoryPath = path.join(__dirname, 'assets/');

      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return console.log('Unable to scan directory: ' + err);
        } 
        const filelists = [];
        let i=0;
        files.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          const stats = fs.statSync(filePath);
          console.log(`${file} - ${stats.size} bytes`);
          filelists[i] = {
            id: i,
            filePath: filePath,
            fileName: file,
            fileSize: `${stats.size} bytes`
          }
          i+=1;
        });

        const workbook = new excelJS.Workbook(); 
        const worksheet = workbook.addWorksheet("Files");

        // Define columns in the worksheet 
        worksheet.columns = [ 
            { header: "File Name", key: "fileName", width: 25 }, 
            { header: "File Path", key: "filePath", width: 100 }, 
            { header: "File Size", key: "fileSize", width: 50 }, 
        ];

        // Add data to the worksheet 
        filelists.forEach(filelist => { worksheet.addRow(filelist); });

        // Set up the response headers 
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "files.xlsx");

        // Write the workbook to the response object 
        workbook.xlsx.write(res).then(() => res.end());
        
      });

  } catch (error) {
    res.status(500).json({ error: 'Failed to list files' });
  }
});
