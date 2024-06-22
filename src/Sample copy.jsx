import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Background,
  useReactFlow,
} from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";

import dagre from "dagre";

import { initialNodes, initialEdges } from "./nodes-edges";

import CustomGroupNode from "./CustomGroupNode.jsx";
import CustomNode from "./CustomNode.jsx";

import "reactflow/dist/style.css";
const nodeTypes = { customGroup: CustomGroupNode, customNode: CustomNode };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const elk = new ELK();

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    let i = 1;
    if (node.nodeType === "vpc") {
      // node.position = {
      //   x: nodeWithPosition.x - (i * 200) / 2,
      //   y: nodeWithPosition.y - (i * 200) / 2,
      // };
      //node.icon = <FunctionIcon />;
      i++;
      console.log(i);
    } else {
      // console.log("w==>", nodeWithPosition.x - nodeWidth / 2);
      // console.log("h==>", nodeWithPosition.y - nodeHeight / 2);
      // node.position = {
      //   // x: nodeWithPosition.x - nodeWidth / 2,
      //   //y: nodeWithPosition.y - nodeHeight / 2,
      //   x: 10,
      //   y: 20,
      // };
    }

    return node;
  });

  return { nodes, edges };
};

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": 100,
    "elk.spacing.nodeNode": 80,
  };

  const getLayoutedElements = useCallback((options) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: "root",
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
    };

    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children.forEach((node) => {
        if (node.nodeType !== "group") {
          node.position = { x: node.x, y: node.y };
        }
      });

      setNodes(children);
      window.requestAnimationFrame(() => {
        fitView();
      });
    });
  }, []);

  return { getLayoutedElements };
};

// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//   initialNodes,
//   initialEdges
// );

const LayoutFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { getLayoutedElements } = useLayoutedElements();

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  return (
    <div style={{ height: 1000, width: 1000 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow-subflows-example"
      >
        <Background />
        <Panel position="top-right">
          <button
            onClick={() =>
              getLayoutedElements({
                "elk.algorithm": "layered",
                "elk.direction": "DOWN",
              })
            }
          >
            vertical layout
          </button>
          <button
            onClick={() =>
              getLayoutedElements({
                "elk.algorithm": "layered",
                "elk.direction": "RIGHT",
              })
            }
          >
            horizontal layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default LayoutFlow;
