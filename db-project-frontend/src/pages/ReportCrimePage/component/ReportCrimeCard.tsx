import { useState } from "react";
import GreenButton from "../../../components/GreenButton";

export default function ReportCrimeCard() {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    cnic: "",
    contact: "",
    zone: "",
    crimeTypeId: 0,
    date: "",
    address: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // 🔥 HANDLE SUBMISSION TO SUPABASE
  // -----------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    console.log("formData, before submission: ", formData);

    try {
      console.log("Submitting crime report...");

      const response = await fetch(
        "http://localhost:5000/api/user/report-crime",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Backend Response:", data);

      if (response.ok && data.success) {
        setSuccessMsg("Crime report submitted successfully!");

        // Reset form
        setFormData({
          fullName: "",
          cnic: "",
          contact: "",
          zone: "",
          crimeTypeId: 0,
          date: "",
          address: "",
          description: "",
        });
      } else {
        setError(data.message || "Failed to submit the report.");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Server error. Please try again later.");
    }
  };

  // Helper function for placeholder color
  const getInputTextColor = (value: string | number) =>
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
            {/* <div className="flex flex-col">
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
            </div> */}
            
            {/* Zone */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Zone: <span className="text-red-500">*</span>
              </label>

              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.zone
                )}`}
              >
                <option value="">Select a zone...</option>
                <option value="1">Clifton & Defence</option>
                <option value="2">Saddar & Civil Lines</option>
                <option value="3">Lyari</option>
                <option value="4">Garden & Old City</option>
                <option value="5">Gulshan-e-Iqbal</option>
                <option value="6">Gulistan-e-Johar</option>
                <option value="7">North Nazimabad</option>
                <option value="8">North Karachi</option>
                <option value="9">Federal B Area</option>
                <option value="10">Korangi</option>
                <option value="11">Malir</option>
                <option value="12">Shah Faisal Colony</option>
                <option value="13">Orangi Town</option>
                <option value="14">Baldia Town</option>
                <option value="15">Surjani Town</option>
              </select>
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
                name="crimeTypeId"
                value={formData.crimeTypeId}
                onChange={handleChange}
                required
                className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm bg-white placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                  formData.crimeTypeId
                )}`}
              >
                <option value="">Not Selected</option>
                <option value="1">Theft</option>
                <option value="2">Robbery</option>
                <option value="3">Assault</option>
                <option value="4">Murder</option>
                <option value="5">Kidnapping</option>
                <option value="6">Sexual Assault</option>
                <option value="7">Burglary</option>
                <option value="8">Drug Possession</option>
                <option value="9">Illegal Weapons Possession</option>
                <option value="10">Other</option>
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

          {/* Addresss */}
          <div className="flex flex-col mt-6">
            <label className="font-medium text-gray-700">
              Address: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Type here..."
              value={formData.address}
              onChange={handleChange}
              required
              className={`border border-[#d9d9d9] rounded-md px-3 py-2 text-sm placeholder:text-[#ababab] focus:outline-none focus:ring-2 focus:ring-green-500 ${getInputTextColor(
                formData.address
              )}`}
            />
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
          <GreenButton
            label={loading ? "Submitting..." : "Submit Report"}
            width={250}
            height={45}
          />
        </div>
      </form>
    </div>
  );
}
