import { useState } from "react";
import GreenButton from "./GreenButton";
import RedButton from "./RedButton";
import WhiteButton from "./WhiteButton";

interface ConfirmationPopupProps {
  version: "admin" | "police";
  isOpen: boolean;
  onClose: () => void;

  // Admin fields
  branchId?: string;
  branchContact?: string;
  username?: string;
  password?: string;
  requestDate?: string;

  // Police fields
  fullName?: string;
  contact?: string;
  cnic?: string;
  crimeType?: string;
  description?: string;
  date?: string;
  zone?: number;

  onApprove?: (updatedData: any) => void;
  onReject?: () => void;
}

export default function ConfirmationPopup({
  version,
  isOpen,
  onClose,
  onApprove,
  onReject,
  ...initialData
}: ConfirmationPopupProps) {
  const [formData, setFormData] = useState(initialData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[520px] p-6 rounded-2xl shadow-xl animate-fadeIn font-outfit">
        <h2 className="text-2xl font-semibold mb-4">
          {version === "admin" ? "Confirm Agent Details" : "Confirm Crime Report"}
        </h2>

        <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-2">
          {version === "admin" ? (
            <>
              <input
                className="inputBox"
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                placeholder="Branch ID"
              />
              <input
                className="inputBox"
                value={formData.branchContact}
                onChange={(e) =>
                  setFormData({ ...formData, branchContact: e.target.value })
                }
                placeholder="Branch Contact"
              />
              <input
                className="inputBox"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Username"
              />
              <input
                className="inputBox"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
              />
              <input
                className="inputBox"
                value={formData.requestDate}
                onChange={(e) =>
                  setFormData({ ...formData, requestDate: e.target.value })
                }
                placeholder="Request Date"
              />
            </>
          ) : (
            <>
              <input
                className="inputBox"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Full Name"
              />
              <input
                className="inputBox"
                value={formData.cnic}
                onChange={(e) =>
                  setFormData({ ...formData, cnic: e.target.value })
                }
                placeholder="CNIC"
              />
              <input
                className="inputBox"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="Contact #"
              />
              <input
                className="inputBox"
                value={formData.crimeType}
                onChange={(e) =>
                  setFormData({ ...formData, crimeType: e.target.value })
                }
                placeholder="Crime Type"
              />
              <input
                className="inputBox"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="Date"
              />
              <input
                className="inputBox"
                value={formData.zone}
                onChange={(e) =>
                  setFormData({ ...formData, zone: Number(e.target.value) })
                }
                placeholder="Zone #"
              />
              <textarea
                className="textareaBox"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
              />
            </>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <WhiteButton label="Cancel" width={150} height={45} onClick={onClose} />
          <div className="mr-2">
            <GreenButton
              label="Confirm"
              width={300}
              height={45}
              onClick={() => onApprove?.(formData)}
            />
          </div>
        </div>
      </div>

      {/* Styling inside component */}
      <style>{`
        .inputBox {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #d0d0d0;
          font-size: 14px;
        }
        .textareaBox {
          width: 100%;
          height: 80px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #d0d0d0;
          font-size: 14px;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
