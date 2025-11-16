import RedButton from "./RedButton";
import WhiteButton from "./WhiteButton";
import GreenButton from "./GreenButton";

type VerificationCardProps =
  | {
      version: "admin";
      branchId: string;
      branchContact: string;
      username: string;
      password: string;
      requestDate: string;
      onContact?: () => void;
      onReject?: () => void;
      onApprove?: () => void;
    }
  | {
      version: "police";
      fullName: string;
      contact: string;
      cnic: string;
      crimeType: string;
      description: string;
      date: string;
      zone: number;
      onContact?: () => void;
      onReject?: () => void;
      onApprove?: () => void;
    };

export default function VerificationCard(props: VerificationCardProps) {
  return (
    <div className="bg-[#ffffff] rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.08)] p-6 w-full flex flex-col gap-y-3 font-outfit border-2 border-[#d9d9d9]">
      {/* Admin version */}
      {props.version === "admin" ? (
        <>
          <h3 className="font-semibold text-gray-700 ">Agent Info:</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-800">
            <p>
              <span className="font-semibold">Branch ID:</span> {props.branchId}
            </p>
            <p>
              <span className="font-semibold">Branch Contact #:</span>{" "}
              {props.branchContact}
            </p>
            <p>
              <span className="font-semibold">Username:</span> {props.username}
            </p>
            <p>
              <span className="font-semibold">Password:</span> {props.password}
            </p>
            <p>
              <span className="font-semibold">Request Date:</span>{" "}
              {props.requestDate}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {props.requestDate}
            </p>
          </div>
        </>
      ) : (
        /* Police version */
        <>
          <h3 className="font-semibold text-[#7d7d7d]">Personal Info:</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-800">
            <p>
              <span className="font-semibold">Full Name:</span>{" "}
              {props.fullName}
            </p>
            <p>
              <span className="font-semibold">CNIC:</span> {props.cnic}
            </p>
            <p>
              <span className="font-semibold">Contact #:</span> {props.contact}
            </p>
          </div>

          <hr className="my-4 border-t-2 border-[#d9d9d9] " />

          <h3 className="font-semibold text-[#7d7d7d] ">Crime Info:</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-800">
            <p>
              <span className="font-semibold">Crime Type:</span>{" "}
              {props.crimeType}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {props.date}
            </p>
            <p>
              <span className="font-semibold">Zone #:</span> {props.zone}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {props.description || "--"}
            </p>
          </div>
        </>
      )}

      {/* Footer Buttons */}
      <div className="border-t-2 border-[#d9d9d9] mt-5 pt-6 flex justify-between items-center">
        <WhiteButton
          label="Contact for Verification"
          width={300}
          height={45}
        />
        <div className="flex gap-2">
          <RedButton label="Reject" width={200} height={45}/>
          <GreenButton label="Approve" width={200} height={45 }/>
        </div>
      </div>
    </div>
  );
}
