import VPN from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Networking-Content-Delivery/32/Arch_AWS-Client-VPN_32.svg";
import Subnet from "aws-svg-icons/lib/Architecture-Service-Icons_07302021/Arch_Internet-of-Things/32/Arch_AWS-IoT-Core_32.svg";

const CustomGroupNode = ({ data }) => {
  return (
    <>
      {data.type === "vpc" && (
        <>
          <img
            src={VPN}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "5px",
            }}
          />
        </>
      )}
      {data.type === "subnet" && (
        <>
          <img
            src={Subnet}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "5px",
            }}
          />
        </>
      )}

      <div className="vpc-title" style={{}}>
        {data.label}
      </div>
    </>
  );
};

export default CustomGroupNode;
