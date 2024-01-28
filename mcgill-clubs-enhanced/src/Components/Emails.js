import { useEffect } from "react";

function Emails() {
  // import axios from "axios";
  const axios = require("axios");

  // Function to retrieve the ID of the last email
  const getAllEmails = async (mailAddress) => {
    try {
      const response = await fetch(
        `https://inboxes.com/api/v2/inbox/${mailAddress}`
      );
      console.log("resp", response);

      const emails = response.data.msgs;
      console.log("emails", emails);
      if (emails.length > 0) {
        return emails;
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
        return response;
      }
    } catch (error) {
      console.error("Error fetching email body:", error);
      return null;
    }
  };

  useEffect(() => {
    const mailAddress = "mcgillclubs@blondmail.com";
    fetch(`https://inboxes.com/api/v2/inbox/${mailAddress}`)
      .then((response) => response.json())
      .then((Data) => {
        console.log(Data);
      });
  }, []);

  // console.log(lastEmailBody);

  // Function to delete the last email
  const deleteLastEmail = async (uid) => {
    try {
      await axios.delete(`https://inboxes.com/api/v2/message/${uid}`);
      console.log(`Deleted last email with ID: ${uid}`);
    } catch (error) {
      console.error("Error deleting last email:", error);
    }
  };

  return null;
}

export default Emails;
