import { google } from "googleapis";
import { useState } from "react";

const CLIENT_ID = "your_client_id";
const CLIENT_SECRET = "your_client_secret";
const REDIRECT_URI = "http://localhost:3000"; // or whatever URL you want to redirect to after the user grants permission

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const DriveService = () => {
  const [data, setData] = useState({});

  const authenticate = () => {
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const authUrl = auth.generateAuthUrl({ scope: SCOPES });

    window.location.href = authUrl;
  };

  const saveToDrive = async () => {
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    // Get the access token from the URL params after the user grants permission
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      const { tokens } = await auth.getToken(code);

      auth.setCredentials(tokens);

      const drive = google.drive({ version: "v3", auth });

      const fileMetadata = {
        name: "mydata.json",
        mimeType: "application/json",
      };

      const media = {
        mimeType: "application/json",
        body: JSON.stringify(data),
      };

      const res = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });

      console.log("File created: ", res.data.id);
    } else {
      authenticate();
    }
  };

  return (
    <>
      <button onClick={() => setData({ name: "John", age: 30 })}>
        Set data
      </button>
      <button onClick={saveToDrive}>Save to Drive</button>
    </>
  );
};

export default DriveService;
