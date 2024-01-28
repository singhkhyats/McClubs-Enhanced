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
    <>
      <header>
        <h1>McGill Clubs Enhanced</h1>
      </header>

      <div>
        <h1> {data.length} Events are happening !</h1>
        <br></br>

        <main class="events">
          <div>
            {data.map((item) => (
              <>
                <div key={item.name}>
                  <h2>{item.date}</h2>
                  <h3>
                    {item.name} organised by {item.organiser}
                  </h3>
                  <p>{item.description}</p>
                </div>
                <br />
              </>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
