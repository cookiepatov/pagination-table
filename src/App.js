import PaginationTable from "./elements/PaginationTable.js";
function App() {
  const link = './data/data200.json'
  return (
    <PaginationTable dataUrl={link} maxElements={50}/>
  );
}

export default App;
