const payloadModel = require("./model");

export function generateRequestID() {
  var date = new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  var hour = String(date.getHours()).padStart(2, "0");
  var minute = String(date.getMinutes()).padStart(2, "0");
  var seconds = String(date.getSeconds()).padStart(2, "0");
  var ID =
    year + "" + month + "" + day + "_" + hour + "" + minute + "" + seconds;
  return ID;
}

export async function updateDocument(binaryData, ID)
{
  const Filename = `${ID}_Image.png`;
  let result = " ";
  try {
    const updatedDocument = await payloadModel.findOneAndUpdate(
      { imageID: ID }, // Search criteria
      { $set: { filename: Filename, imageData: binaryData } }, // Fields to update
      { new: true, upsert: false } 
    ).exec();

    if (updatedDocument) {
      console.log('Updated document:', updatedDocument);
      result = "Uploaded";
     
    } else {
      console.log('Record not found.');
      result ="Not Found";
    }
  } catch (error) {
    console.error(error);
    result = "Error";
  }

  return result;
}

export async function saveStatus(ID, Status)
{
  let result =" ";
  try {
    const payloadData = await payloadModel.findOneAndUpdate(
      { imageID: ID }, // Search criteria
      { $set: { status: Status} }, // Fields to update
      { new: true, upsert: false } 
    ).exec();
    
    if(payloadData)
    {
      console.log("Status successfully saved to the database")
      result = "Status Saved";
    }
    else
    {
      console.log("Record not found.")
      result = "Record not found"
    }
    
  } catch (error) {
    console.error(error);
  }

  return result;
}


