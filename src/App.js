import { useCallback, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import update from "immutability-helper";
import "./App.css";
import Box from "./Box";
import data from "./mock-data.json";

function App() {
  const [items, setItems] = useState([...data.boxes]);
  const moveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) =>
      update(prevItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevItems[dragIndex]],
        ],
      })
    );
  }, []);
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        {items.map((item, index) => {
          return (
            <Box key={index} index={index} id={index} item={item} moveItem={moveItem} />
          );
        })}
      </DndProvider>
    </div>
  );
}

export default App;
