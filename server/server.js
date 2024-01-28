const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

// import axios from "axios";
const axios = require("axios");

// Function to retrieve the ID of the last email
const getAllIds = async (mailAddress) => {
  try {
    const response = await axios.get(
      `https://inboxes.com/api/v2/inbox/${mailAddress}`
    );
    const emails = response.data.msgs;
    if (emails.length > 0) {
      return emails.map((email) => email.uid);
    } else {
      console.log("No emails found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    return null;
  }
};

// Function to retrieve the ID of the last email
const getLastEmailId = async (mailAddress) => {
  try {
    const response = await axios.get(
      `https://inboxes.com/api/v2/inbox/${mailAddress}`
    );
    const emails = response.data.msgs;
    if (emails.length > 0) {
      return emails[0].uid;
    } else {
      console.log("No emails found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    return null;
  }
};

// Function to retrieve the body of the last email
const getLastEmailBody = async (mailAddress) => {
  try {
    let email = await getLastEmailId(mailAddress);
    if (email) {
      const response = await axios.get(
        `https://inboxes.com/api/v2/message/${email}`
      );
      return response.data.text;
    }
  } catch (error) {
    console.error("Error fetching email body:", error);
    return null;
  }
};

// Function to retrieve the body of the last email
const getEmailBodyFromId = async (id) => {
  try {
    const response = await axios.get(
      `https://inboxes.com/api/v2/message/${id}`
    );
    return response.data.text;
  } catch (error) {
    console.error("Error fetching email body:", error);
    return null;
  }
};

const getEmailBodies = async (mailAddress) => {
  const Ids = await getAllIds(mailAddress);
  const result = await Promise.all(
    Ids.map(async (id) => {
      const body = await getEmailBodyFromId(id);
      console.log("id is ", id);
      return { id: id, body: body };
    })
  );
  console.log(result.length);
  return result;
};

getEmailBodies("mcgillclubs@blondmail.com").then((r) => {
  app.get("/message", (req, res) => {
    res.json(r);
  });
});

// Function to delete the last email
const deleteLastEmail = async (uid) => {
  try {
    await axios.delete(`https://inboxes.com/api/v2/message/${uid}`);
    console.log(`Deleted last email with ID: ${uid}`);
  } catch (error) {
    console.error("Error deleting last email:", error);
  }
};
