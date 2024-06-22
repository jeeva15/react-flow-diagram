import React, { useState } from "react";
import ReactFlow, { Background } from "reactflow";

const initialNodes = [
  { id: "1", data: { label: "Node 1" }, position: { x: 100, y: 100 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 400, y: 100 } },
];

const getNewNodePosition = (connectedNode) => {
  // Calculate a new position (e.g., right to the connected node)
  return {
    x: connectedNode.position.x + 200,
    y: connectedNode.position.y,
  };
};

const addNodesWithPositions = (nodes) => {
  const newNodes = nodes.map((node, index) => {
    if (index === 0) {
      return node;
    }
    const connectedNode = nodes[index - 1];
    const newNodePosition = getNewNodePosition(connectedNode);
    return { ...node, position: newNodePosition };
  });
  return newNodes;
};

const Flow = () => {
  const [elements, setElements] = useState(() =>
    addNodesWithPositions(initialNodes)
  );

  console.log(elements);

  return (
    <div style={{ height: 1000, width: 1000 }}>
      <ReactFlow
        nodes={elements}
        fitView
        className="react-flow-subflows-example"
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;
