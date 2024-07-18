import { useState, useEffect } from 'react';
import { Web5 } from '@web5/api';
import Image from 'next/image';

export default function Home() {
  const [did, setDid] = useState('');
  const [web5, setWeb5] = useState(null);
  const [recordId, setRecordId] = useState('');
  const [record, setRecord] = useState(null);
  const imageName = 'image.png'; // Assuming this image is in your public folder

  // Hardcoded username and message
  const username = "John Doe";
  const message = "Hello, Web5!";

  useEffect(() => {
    async function initializeWeb5() {
      try {
        const { web5, did: userDid } = await Web5.connect();
        setDid(userDid);
        setWeb5(web5);
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    }

    initializeWeb5();
  }, []);

  const createMessage = async () => {
    if (!web5) {
      console.error("Web5 not initialized");
      return;
    }

    const messageData = {
      username,
      message,
      image: imageName
    };

    try {
      const { record } = await web5.dwn.records.create({
        data: messageData,
        message: {
          dataFormat: "application/json"
        },
      });

      const newRecordId = record.id;
      setRecordId(newRecordId);
      console.log("Record created with ID:", newRecordId);

      // Attempt to write the record to the DWN
      await record.send(did);
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const fetchRecord = async () => {
    if (!web5 || !recordId) {
      console.error("Web5 not initialized or no record ID");
      return;
    }

    try {
      const { record } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: recordId
          }
        }
      });

      if (record) {
        const recordData = await record.data.json();
        setRecord(recordData);
        console.log("Fetched record data:", recordData);
      } else {
        console.error("Record not found");
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };

  return (
    <div>
      <h1>Web5 Next.js App</h1>
      <p>Your DID: {did}</p>
      <button onClick={createMessage} disabled={!web5}>
        Create Message
      </button>
      <button onClick={fetchRecord} disabled={!web5 || !recordId}>
        Fetch Record
      </button>
      {recordId && <p>Record ID: {recordId}</p>}
      {record && (
        <div>
          <h2>Record Data:</h2>
          <p>Username: {record.username}</p>
          <p>Message: {record.message}</p>
          <Image src={`/${record.image}`} alt="Record Image" width={300} height={300} />
        </div>
      )}
    </div>
  );
}