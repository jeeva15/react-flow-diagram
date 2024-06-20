import { Handle, Position } from "reactflow";
import EC2 from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Compute/48/Arch_Amazon-EC2-R5n_48.svg";
import DB from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Database/48/Arch_Amazon-RDS_48.svg";
import Table from "aws-svg-icons/lib/Resource-Icons_07302021/Res_Networking-and-Content-Delivery/Res_48_Light/Res_Amazon-Route-53_Route-Table_48_Light.svg";
import Gateway from "aws-svg-icons/lib/Resource-Icons_07302021/Res_Networking-and-Content-Delivery/Res_48_Light/Res_Amazon-VPC_NAT-Gateway_48_Light.svg";
import IAM from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Security-Identity-Compliance/48/Arch_AWS-Security-Hub_48.svg";
import KeyPair from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Security-Identity-Compliance/48/Arch_AWS-Single-Sign-On_48.svg";
import ElasticIPAddress from "aws-svg-icons/lib/Resource-Icons_07302021/Res_Compute/Res_48_Dark/Res_Amazon-EC2_Elastic-IP-Address_48_Dark.svg";
import lambdaIcon from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Compute/48/Arch_AWS-Lambda_48.svg";
import S3Bucket from "aws-svg-icons/lib/Resource-Icons_07302021/Res_Storage/Res_48_Dark/Res_Amazon-Simple-Storage-Service_S3-Standard_48_Dark.svg";
import EKS from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Containers/64/Arch_Amazon-Elastic-Kubernetes-Service_64.svg";
import IAMAccess from "aws-svg-icons/lib/Resource-Icons_07302021/Res_Security-Identity-and-Compliance/Res_48_Dark/Res_AWS-Identity-Access-Management_AWS-IAM-Access-Analyzer_48_Dark.svg";
import NIC from "aws-svg-icons/lib/Resource-Icons_07302021/Res_Networking-and-Content-Delivery/Res_48_Dark/Res_Amazon-VPC_Elastic-Network-Interface_48_Dark.svg";
import Kinesis from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Analytics/Arch_48/Arch_Amazon-Kinesis-Data-Streams_48.svg";
import Redshift from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Analytics/Arch_48/Arch_Amazon-Redshift_48.svg";

const CustomNode = ({ data }) => {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          border: "0",
        }}
      >
        {data.type === "aws_instance" && <img src={EC2} />}
        {data.type === "aws_db_instance" && <img src={DB} />}
        {data.type === "aws_route_table" && <img src={Table} />}
        {data.type === "aws_route_table_association" && <img src={Table} />}
        {data.type === "aws_nat_gateway" && <img src={Gateway} />}
        {data.type === "aws_security_group" && <img src={IAM} />}
        {data.type === "aws_key_pair" && <img src={KeyPair} />}
        {data.type === "aws_eip" && <img src={ElasticIPAddress} />}
        {data.type === "aws_internet_gateway" && <img src={Gateway} />}
        {data.type === "aws_lambda_function" && <img src={lambdaIcon} />}
        {data.type === "aws_s3_bucket" && <img src={S3Bucket} />}
        {data.type === "aws_eks_cluster" && <img src={EKS} />}
        {data.type === "aws_iam_role" && <img src={IAMAccess} />}
        {data.type === "aws_network_interface" && <img src={NIC} />}
        {data.type === "aws_kinesis_stream" && <img src={Kinesis} />}
        {data.type === "aws_redshift_cluster" && <img src={Redshift} />}

        <div
          style={{
            width: "100px",
            fontSize: "10px",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.label}
        </div>
        <Handle
          type="source"
          position={Position.Top}
          style={{ background: "#fff" }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          style={{ background: "#fff" }}
        />
      </div>
    </>
  );
};

export default CustomNode;
