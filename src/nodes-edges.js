import myData from "./json/graph2.json";
import { MarkerType } from "reactflow";

const position = { x: 0, y: 0 };
//const edgeType = "smoothstep";
const newNodes = [];

//type names
const vpcTypeNames = ["aws_vpc"];
const subnetTypeNames = ["aws_subnet"];

let elmInVPC = 0;
let elmOutVPC = 0;
let elmInVP;
let totalElm = 0;

const vpcsArr = [];
const subnetArr = [];

const getSubnetParent = (gvid) => {
  let parent = null;
  myData.edges.some((data) => {
    if (data.tail === gvid) {
      if (subnetArr.includes(data.head)) {
        parent = data.head;
        return data.head;
      } else {
        //1 level down search for subnet - to be refactored
        myData.edges.some((data2) => {
          if (data2.tail === data.head && subnetArr.includes(data2.head)) {
            parent = data2.head;
            return data2.head;
          }
        });
      }
    }
  });
  return parent;
};

const getVPCParent = (gvid) => {
  let parent = null;
  myData.edges.some((data) => {
    if (data.tail === gvid) {
      if (vpcsArr.includes(data.head)) {
        parent = data.head;
        return data.head;
      }
    }
  });
  return parent;
};

myData.objects.forEach((data) => {
  const node = data.label.split(".");

  // collect all vpcs
  if (vpcTypeNames.includes(node[0])) {
    vpcsArr.push(data._gvid);
  }
  // collect all subnets
  else if (subnetTypeNames.includes(node[0])) {
    subnetArr.push(data._gvid);
  }
});

let subnetCount = 0;
let nodeInSubnetCount = [];
myData.objects.forEach((data) => {
  const nodeLabel = data.label.split(".");

  let attrArr = {};

  const spaceBwSubnets = subnetCount > 0 ? (subnetCount + 1) * 30 : 30;

  if (vpcsArr.includes(data._gvid)) {
    newNodes.push({
      id: "id_" + data._gvid,
      data: { label: nodeLabel[1] },
      type: "customGroup",
      className: "light",
      data: { label: nodeLabel[1], type: "vpc" },
      style: {
        width: subnetArr.length * 300 + subnetArr.length * 40,
        height: 560, // Todo: dynamically assign based on no.of subnets
        border: "1px solid #8E44AD",
        justifyContent: "right",
        display: "flex",
        borderRadius: "5px",
        textAlign: "center",
      },
      //position: { x: 200, y: 0 }, // Todo: dynamically assign based on no.of vpc and subnets
      position,
      nodeType: "vpc",
    });
  } else if (subnetArr.includes(data._gvid)) {
    console.log(
      "==>" + subnetCount,
      spaceBwSubnets,
      subnetCount * 300 + spaceBwSubnets
    );
    newNodes.push({
      id: "id_" + data._gvid,
      data: { label: nodeLabel[1] },
      type: "customGroup",
      className: "light",
      data: { label: nodeLabel[1], type: "subnet" },
      style: {
        backgroundColor: "rgba(199, 240, 206, 0.2)",
        width: 300,
        height: 420,
        border: "1px solid #006600",
        justifyContent: "right",
        display: "flex",
        borderRadius: "5px",
      },
      //position: { x: subnetCount * 300 + spaceBwSubnets, y: 60 },
      position,
      parentNode: "id_" + 24, //todo: dynamically assign this
      nodeType: "subnet",
    });
    nodeInSubnetCount[data._gvid] = 0;

    subnetCount++;
  }
});

myData.objects.forEach((data) => {
  const nodeLabel = data.label.split(".");
  let attrArr = {};
  if (!vpcsArr.includes(data._gvid) && !subnetArr.includes(data._gvid)) {
    const parentSubnetId = getSubnetParent(data._gvid);

    const spaceBwNodes = nodeInSubnetCount[parentSubnetId] ? 50 : 50;

    if (parentSubnetId) {
      newNodes.push({
        id: "id_" + data._gvid,
        data: { label: nodeLabel[1] },
        parentId: "id_" + parentSubnetId,
        type: "customNode",
        data: { label: nodeLabel[1], type: nodeLabel[0] },
        extent: "parent",
        className: "light",
        // asssigning positions for subnet nodes
        // position: {
        //   x: 100,
        //   y: nodeInSubnetCount[parentSubnetId] * 90 + spaceBwNodes,
        // },
        position,
      });

      // Assuming all the subnets are already assigned by now
      if (nodeInSubnetCount[parentSubnetId]) {
        nodeInSubnetCount[parentSubnetId] =
          nodeInSubnetCount[parentSubnetId] + 1;
      } else {
        nodeInSubnetCount[parentSubnetId] = 1;
      }
    } else {
      //element inside VPC
      const vpcParent = getVPCParent(data._gvid);
      //let spaceBwNodesOut = elmInVPC > 0 ?
      if (vpcParent) {
        newNodes.push({
          id: "id_" + data._gvid,
          data: { label: nodeLabel[1] },
          parentId: "id_" + vpcParent,
          type: "customNode",
          data: { label: nodeLabel[1], type: nodeLabel[0] },
          // position: {
          //   x: elmInVPC * (720 / 2) + 60,
          //   y: 500,
          // },
          position,
        });
        elmInVPC++;
      } else {
        // elements outside VPC
        newNodes.push({
          id: "id_" + data._gvid,
          data: { label: nodeLabel[1] },
          type: "customNode",
          data: { label: nodeLabel[1], type: nodeLabel[0] },
          // position: {
          //   x: 10,
          //   y: elmOutVPC * 120,
          // },
          position,
        });
        elmOutVPC++;
      }
    }
  }

  totalElm++;
});

console.log("== in subnetCount" + subnetCount);

const newEdges = [];
let i = 1;
myData.edges.forEach((data) => {
  newEdges.push({
    id: "ec-" + i,
    source: "id_" + data.head,
    target: "id_" + data.tail,
    animated: false,
    sourceHandle: "a",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: "#FF1493" },
  });

  i++;
});

// console.log(newNodes);

export const initialNodes = newNodes;

export const initialEdges = newEdges;
