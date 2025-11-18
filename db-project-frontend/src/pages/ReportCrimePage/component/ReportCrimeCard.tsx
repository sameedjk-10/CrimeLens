import { useState } from "react";
import GreenButton from "../../../components/GreenButton";

export default function ReportCrimeCard() {
  const [formData, setFormData] = useState({
    fullName: "",
    cnic: "",
    contact: "",
    zone: "",
    crimeType: "",
    date: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Crime Report Submitted:", formData);
  };

  // Helper function to get text color depending on if field has value
  const getInputTextColor = (value: string) =>
    value ? "text-gray-700" : "text-[#ababab]";

  return (
    <div className="bg-white rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.08)] p-6 w-full border-2 border-[#d9d9d9] font-outfit">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* PERSONAL INFO */}
        <div>
          <h3 className="font-semibold text-[#7d7d7d] mb-4">Personal Info:</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Full Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Type here..."
                value={formData.fullName}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.fullName
                )}`}
              />
            </div>

            {/* CNIC */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                CNIC: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cnic"
                placeholder="Type here..."
                value={formData.cnic}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.cnic
                )}`}
              />
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Contact #: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact"
                placeholder="Type here..."
                value={formData.contact}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.contact
                )}`}
              />
            </div>

            {/* Zone */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Zone #: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="zone"
                placeholder="Type here..."
                value={formData.zone}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.zone
                )}`}
              />
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-[#d9d9d9]" />

        {/* CRIME INFO */}
        <div>
          <h3 className="font-semibold text-[#7d7d7d] mb-4">Crime Info:</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Crime Type */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Crime Type: <span className="text-red-500">*</span>
              </label>
              <select
                name="crimeType"
                value={formData.crimeType}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm bg-white placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.crimeType
                )}`}
              >
                <option value="">Not Selected</option>
                <option value="Theft">Theft</option>
                <option value="Robbery">Robbery</option>
                <option value="Assault">Assault</option>
                <option value="Fraud">Fraud</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.date
                )}`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mt-6">
            <label className="font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              placeholder="50 words maximum..."
              value={formData.description}
              onChange={handleChange}
              maxLength={300}
              className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm resize-none h-24 placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                formData.description
              )}`}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center pt-4">
          <GreenButton label="Submit Report" width={250} height={45} />
        </div>
      </form>
    </div>
  );
}
