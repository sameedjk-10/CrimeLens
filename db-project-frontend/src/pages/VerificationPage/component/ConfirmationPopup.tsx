import { useState } from "react";
import GreenButton from "../../../components/GreenButton";
import WhiteButton from "../../../components/WhiteButton";

interface ConfirmationPopupProps {
  version: "admin" | "police";
  isOpen: boolean;
  onClose: () => void;

  // Admin fields
  requestId?: string | number;
  branchId?: string;
  branchContact?: string;
  username?: string;
  password?: string;
  requestDate?: string;

  // Police fields
  submissionId?: string | number;
  fullName?: string;
  contact?: string;
  cnic?: string;
  crimeType?: string;
  description?: string;
  date?: string;
  zone?: number;
  address?: string;

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
  const [formData, setFormData] = useState({
    // Admin fields
    branchId: initialData.branchId || "",
    branchContact: initialData.branchContact || "",
    username: initialData.username || "",
    password: initialData.password || "",
    requestDate: initialData.requestDate || "",

    // Police fields
    fullName: initialData.fullName || "",
    contact: initialData.contact || "",
    cnic: initialData.cnic || "",
    crimeType: initialData.crimeType || "",
    description: initialData.description || "",
    date: initialData.date || "",
    zone: initialData.zone || "",
    address: initialData.address || "", // Officer can edit

    // Extra fields for police (to be added by officer)
    location: "", // JSON string or object
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onApprove?.(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[520px] p-6 rounded-2xl shadow-xl animate-fadeIn font-outfit max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 sticky top-0 bg-white pb-4">
          {version === "admin"
            ? "Confirm Agent Request Details"
            : "Confirm Crime Report Details"}
        </h2>

        <div className="flex flex-col gap-4">
          {version === "admin" ? (
            /* ADMIN VERSION - Read Only */
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Branch ID
                </label>
                <input
                  type="text"
                  value={formData.branchId}
                  readOnly
                  className="inputBox bg-gray-100 cursor-not-allowed mt-1"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Branch Contact #
                </label>
                <input
                  type="text"
                  value={formData.branchContact}
                  readOnly
                  className="inputBox bg-gray-100 cursor-not-allowed mt-1"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  readOnly
                  className="inputBox bg-gray-100 cursor-not-allowed mt-1"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="text"
                  value={formData.password}
                  readOnly
                  className="inputBox bg-gray-100 cursor-not-allowed mt-1"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Request Date
                </label>
                <input
                  type="text"
                  value={formData.requestDate}
                  readOnly
                  className="inputBox bg-gray-100 cursor-not-allowed mt-1"
                />
              </div>
            </>
          ) : (
            /* POLICE VERSION - Some Fields Editable */
            <>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Personal Info (Read-Only)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      readOnly
                      className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-700">
                      CNIC
                    </label>
                    <input
                      type="text"
                      value={formData.cnic}
                      readOnly
                      className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-700">
                      Contact #
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      readOnly
                      className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-700">
                      Zone #
                    </label>
                    <input
                      type="text"
                      value={formData.zone}
                      readOnly
                      className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Crime Info (Read-Only)
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-700">
                      Crime Type
                    </label>
                    <input
                      type="text"
                      value={formData.crimeType}
                      readOnly
                      className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      readOnly
                      className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <label className="text-xs font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    readOnly
                    className="w-full text-sm bg-gray-100 cursor-not-allowed mt-1 p-2 rounded border h-20 resize-none"
                  />
                </div>
              </div>

              <div className="border-b pb-4 bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  ✏️ Officer Additions (Editable)
                </h3>
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address or location details..."
                    value={formData.address}
                    onChange={handleInputChange}
                    className="inputBox mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Location <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder='e.g., {"lat": 24.8607, "lng": 67.0011}'
                    value={formData.location}
                    onChange={handleInputChange}
                    className="inputBox mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JSON format: {`{lat: number, lng: number}`}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 gap-3 sticky bottom-0 bg-white pt-4">
          <WhiteButton label="Cancel" width={150} height={45} onClick={onClose} />
          <GreenButton
            label="Approve"
            width={300}
            height={45}
            onClick={handleSubmit}
          />
        </div>
      </div>

      {/* Styling */}
      <style>{`
        .inputBox {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #d0d0d0;
          font-size: 14px;
          font-family: inherit;
        }
        .textareaBox {
          width: 100%;
          height: 80px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1.5px solid #d0d0d0;
          font-size: 14px;
          font-family: inherit;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}