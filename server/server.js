const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

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
      return { id: id, body: body };
    })
  );

  return result;
};

const parseEmails = async () => {
  const GPT_PROMPT = `This is an email newsletter sent by one of McGill clubs. Scrape through it and extract the one main event that is happening. if you find more than one event, prioritize the one that has a location and date specified. The output should be a list. all the list's elements headers such as "event name", "event description" etc should be in small case letters. and formatter exactly like below. for the extracted date use the following formatting: '2022-01-27T12:00' if there is a time and '2022-01-27' if there is no specific time. 
  - event name
  - event organiser
  - event description
  - event location
  - event date
  - event application deadline (if there is one)
  - event price  (if there is one)


    `;

  const GPT_KEYS = [
    "event name: ",
    "event organiser: ",
    "event description: ",
    "event location: ",
    "event date: ",
  ];
  const KEYS = ["name", "organiser", "description", "location", "date"];

  const emailBodies = await getEmailBodies("mcgillclubs@blondmail.com");

  const OpenAI = require("openai");
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const result = await Promise.all(
    emailBodies.map(async (email) => {
      const message = GPT_PROMPT + email.body;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0,
        max_tokens: 700,
      });

      const response_arr = response.choices[0].message.content.split("\n");
      let obj = {};
      for (let i = 0; i < response_arr.length; i++) {
        obj[KEYS[i]] = response_arr[i].split(GPT_KEYS[i])[1];
      }
      return obj;
    })
  );
  console.log(result);
  return result;

  //   const message = GPT_PROMPT + emailBodies[0].body;
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [{ role: "user", content: message }],
  //     temperature: 0,
  //     max_tokens: 1000,
  //   });

  //   console.log(response.choices[0].message.content);
};

// parseEmails();
parseEmails().then((r) => {
  app.get("/message", (req, res) => {
    res.json(r);
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
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
