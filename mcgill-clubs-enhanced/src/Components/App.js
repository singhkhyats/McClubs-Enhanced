import "./App.css";
import Gpt from "./Gpt";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("trying");
        axios
          .get("http://localhost:8000/message")
          .then((res) => setData(res.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1> {data.length} Events are happening !</h1>
      <br></br>
      <div>
        {data.map((item) => (
          <div key={item.name}>
            <h1>{item.date}</h1>
            <h2>
              {item.name} organised by {item.organiser}
            </h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
