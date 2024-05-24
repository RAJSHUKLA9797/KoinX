const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const transactionSchema = require("../schemas/transactionSchema");

const uploadCsvRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Function to rename columns
function renameColumns(headers) {
  const newHeaders = {};
  for (const header of headers) {
    // Convert to snake_case or camelCase
    const newHeader = header.replace(/[\s\/]/g, "_").toLowerCase();
    newHeaders[header] = newHeader;
  }
  return newHeaders;
}

uploadCsvRouter
  .route("/uploadCsv")
  .post(upload.single("csvFile"), async (req, res) => {
    try {
      const jsonArray = await csv().fromFile(req.file.path);

      if (jsonArray.length > 0) {
        // Rename columns
        const headers = Object.keys(jsonArray[0]);
        const renamedColumns = renameColumns(headers);

        const renamedJsonArray = jsonArray.map((row) => {
          const renamedRow = {};
          for (const key in row) {
            if (row.hasOwnProperty(key)) {
              const newKey = renamedColumns[key];
              renamedRow[newKey] = row[key];
            }
          }
          return renamedRow;
        });

        // Log the renamedJsonArray for debugging
        console.log(renamedJsonArray);
        await transactionSchema.insertMany(renamedJsonArray);
        console.log("Successfully saved default items to DB");
        res.json("success");
      } else {
        res.json("No data to insert");
      }
    } catch (err) {
      console.log(err);
      res.json("failed");
    }
  });

module.exports = uploadCsvRouter;
