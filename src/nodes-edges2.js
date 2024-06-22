import myData from "./json/graph.json";
import { MarkerType } from "reactflow";

const newNodes = [];
const newEdges = [];

myData.objects.forEach((data) => {
  const nodeLabel = data.label.split(".");
  newNodes.push({
    id: "id_" + data._gvid,
    data: { label: nodeLabel[1] },
    position: { x: 0, y: 0 },
  });
});

let i = 1;
myData.edges.forEach((data) => {
  newEdges.push({
    id: "ec-" + i,
    source: "id_" + data.head,
    target: "id_" + data.tail,
    animated: true,
  });

  i++;
});

console.log("=edges=>", newEdges);

export const initialNodes = [...newNodes];
export const initialEdges = [...newEdges];

// export const initialNodes = [
//   {
//     id: "1",
//     type: "input",
//     data: { label: "input" },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: "11a",
//     type: "group",
//     data: { label: "node 2" },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: "2",
//     data: { label: "node 2" },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: "2a",
//     data: { label: "node 2a" },
//     position: { x: 0, y: 0 },
//     parentId: "11a",
//   },
//   {
//     id: "2b",
//     data: { label: "node 2b" },
//     position: { x: 0, y: 0 },
//     parentId: "11a",
//   },
//   {
//     id: "2c",
//     data: { label: "node 2c" },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: "2d",
//     data: { label: "node 2d" },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: "3",
//     data: { label: "node 3" },
//     position: { x: 200, y: 0 },
//   },
// ];

// export const initialEdges = [
//   { id: "e12", source: "1", target: "2", animated: true },
//   { id: "e13", source: "1", target: "3", animated: true },
//   { id: "e22a", source: "2", target: "2a", animated: true },
//   { id: "e22b", source: "2", target: "2b", animated: true },
//   { id: "e22c", source: "2", target: "2c", animated: true },
//   { id: "e2c2d", source: "2c", target: "2d", animated: true },
// ];
