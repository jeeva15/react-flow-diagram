import React from "react";
import { ReactFlowProvider } from "reactflow";
//import Sample from "./Sample";
import LayoutFlow from "./layout";
//import ParentChildFlow from "./ParentChildFlow"

const App = () => {
  return (
    <>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </>
  );
};

export default App;
