import "./App.css";
import Gpt from "./Gpt";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:8000/message").then((res) => console.log(res));
  //   // .then((data) => setMessage(data.message))
  //   // .then(console.log(message));
  // }, [message]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("trying");
        axios
          .get("http://localhost:8000/message")
          .then((res) => setData(res.data));
        // .then((r) => console.log("rRRRRRR", r));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); //

  return (
    <div>
      <h1>React ChatGPT Integration{data.length}</h1>
      <div>
        <h1>List of Objects</h1>
        <ul>
          {data.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </div>
      <Gpt />
    </div>
  );
}

export default App;
