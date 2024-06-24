import myData from "./json/graph.json";
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
        height: subnetArr.length <= 3 ? 580 : 580 * 2, // Todo: dynamically assign based on no.of subnets
        border: "1px solid #8E44AD",
        justifyContent: "right",
        display: "flex",
        borderRadius: "5px",
        textAlign: "center",
      },
      position: { x: 10, y: 120 }, // Todo: dynamically assign based on no.of vpc and subnets
      //position,
      nodeType: "group",
    });
  } else if (subnetArr.includes(data._gvid)) {
    const vpcParent = getVPCParent(data._gvid);
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
      position: { x: subnetCount * 300 + spaceBwSubnets, y: 60 },

      parentNode: "id_" + vpcParent,
      nodeType: "group",
    });
    nodeInSubnetCount[data._gvid] = 1;

    subnetCount++;
  }
});

let j = 1;
myData.objects.forEach((data) => {
  const nodeLabel = data.label.split(".");
  let attrArr = {};
  if (!vpcsArr.includes(data._gvid) && !subnetArr.includes(data._gvid)) {
    const parentSubnetId = getSubnetParent(data._gvid);

    const spaceBwNodes = nodeInSubnetCount[parentSubnetId] ? 50 : 50;

    if (parentSubnetId) {
      const positionSwitch = {
        x: (nodeInSubnetCount[parentSubnetId] % 2) * 100,
        y: Math.floor(nodeInSubnetCount[parentSubnetId] / 2) * 100 + 100,
      };

      newNodes.push({
        id: "id_" + data._gvid,
        data: { label: nodeLabel[1] },
        parentId: "id_" + parentSubnetId,
        type: "customNode",
        data: { label: nodeLabel[1], type: nodeLabel[0] },
        extent: "parent",
        className: "light",
        // asssigning positions for subnet nodes
        position: positionSwitch,
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
          position: {
            x: elmInVPC * (720 / 2) + 60,
            y: 500,
          },
          nodeType: "external",
        });
        elmInVPC++;
      } else {
        const spaceBwNodesOutVPC = elmOutVPC > 0 ? (elmOutVPC + 1) * 100 : 150;
        let pos = {
          x: elmOutVPC * 120 + spaceBwNodesOutVPC,
          y: 10,
        };

        if (elmOutVPC > 3) {
          console.log(j);
          pos = {
            x: subnetArr.length * 350,
            y: j * 100,
          };
          j++;
        }
        // elements outside VPC
        newNodes.push({
          id: "id_" + data._gvid,
          data: { label: nodeLabel[1] },
          type: "customNode",
          data: { label: nodeLabel[1], type: nodeLabel[0] },
          position: pos,
          nodeType: "external",
        });
        elmOutVPC++;
      }
    }
  }

  totalElm++;
});

const newEdges = [];
let i = 1;
myData.edges.forEach((data) => {
  newEdges.push({
    id: "ec-" + i,
    source: "id_" + data.head,
    target: "id_" + data.tail,
    animated: true,
    sourceHandle: "a",
    //type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#FF0072",
    },
    style: { stroke: "#FF0072" },
  });

  i++;
});

console.log(newNodes);

export const initialNodes = newNodes;

export const initialEdges = newEdges;
