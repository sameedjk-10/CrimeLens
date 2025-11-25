import { useEffect, useState } from "react";
import RecordsTable from "./RecordsTable";
import GreenButton from "../../../components/GreenButton";
import BackButton from "../../../components/BackButton";
import { useNavigate } from "react-router-dom";
import AllRecordsSearch from "./AllRecordsSearch";

interface AllRecordsProps {
  version: "admin" | "police" | "user" | null;
}

export interface CrimeRecord {
  id: number;
  zoneName: string;
  registeredBranchId: number | null;
  submitterCnic: string | null;
  crimeTypeName: string;
  incidentDate: string; // YYYY-MM-DD
}

export default function AllRecords({ version }: AllRecordsProps) {
  const navigate = useNavigate();

  const [records, setRecords] = useState<CrimeRecord[]>([]);
  const [backupRecords, setBackupRecords] = useState<CrimeRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);

  // Modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateRecord, setUpdateRecord] = useState<CrimeRecord | null>(null);

  // For full crime details
  interface FullCrimeDetails {
    id: number;
    title: string;
    description: string;
    address: string;
    zoneId: number;
    latitude: number;
    longitude: number;
  }

  const [fullCrime, setFullCrime] = useState<FullCrimeDetails | null>(null);
  // ---------------------------
  // FETCH DATA
  // ---------------------------
  useEffect(() => {
    let mounted = true;

    const fetchCrimes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/crimes/all`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        if (!mounted) return;

        if (data.success) {
          setRecords(data.data);
          setBackupRecords(data.data);
        } else {
          console.error("Error fetching crimes:", data.message);
        }
      } catch (err) {
        console.error("Error fetching crimes:", err);
      }
    };

    if (version === "police") fetchCrimes();

    return () => {
      mounted = false;
    };
  }, [version]);

  // ---------------------------
  // SEARCH HANDLER
  // ---------------------------
  const handleSearch = (searchBy: string, value: string) => {
    if (!value.trim() || searchBy === "") {
      setRecords(backupRecords);
      setSelectedRecords([]);
      return;
    }

    const filtered = backupRecords.filter((item: any) => {
      const fieldValue = item[searchBy];
      if (fieldValue === null || fieldValue === undefined) return false;

      // DATE SEARCH
      if (searchBy === "incidentDate") {
        const itemDate = new Date(fieldValue);
        const searchDate = new Date(value);
        return (
          itemDate.getFullYear() === searchDate.getFullYear() &&
          itemDate.getMonth() === searchDate.getMonth() &&
          itemDate.getDate() === searchDate.getDate()
        );
      }

      // NUMBER SEARCH
      if (typeof fieldValue === "number") return String(fieldValue) === value;

      // STRING SEARCH (exact match, case-insensitive)
      return String(fieldValue).toLowerCase() === value.toLowerCase();
    });

    setRecords(filtered);
    setSelectedRecords([]);
  };

  // ---------------------------
  // HANDLE ROW SELECTION
  // ---------------------------
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedRecords((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRecords(checked ? records.map((r) => r.id) : []);
  };

  // ---------------------------
  // BULK DELETE
  // ---------------------------
  const handleBulkDelete = async () => {
    if (!selectedRecords.length) return;
    if (
      !confirm(`Are you sure you want to delete ${selectedRecords.length} record(s)?`)
    )
      return;

    try {
      await Promise.all(
        selectedRecords.map((id) =>
          fetch(`http://localhost:5000/api/crimes/delete/${id}`, { method: "DELETE" })
        )
      );

      const newRecords = records.filter((r) => !selectedRecords.includes(r.id));
      setRecords(newRecords);
      setBackupRecords(newRecords);
      setSelectedRecords([]);
    } catch (err) {
      console.error("Error deleting records:", err);
    }
  };

  // ---------------------------
  // OPEN UPDATE MODAL
  // ---------------------------
  const handleBulkUpdate = async () => {
    if (selectedRecords.length !== 1) {
      alert("Please select exactly one record to update.");
      return;
    }

    const crimeId = selectedRecords[0];

    try {
      const res = await fetch(`http://localhost:5000/api/crimes/get-crime/${crimeId}`);
      const data = await res.json();

      if (!data.success) {
        alert("Failed to load crime details.");
        return;
      }

      const c = data.data;
      setFullCrime({
        id: c.id,
        title: c.title,
        description: c.description,
        address: c.address,
        zoneId: c.zoneId,
        latitude: c.location?.coordinates?.[1] ?? 0,
        longitude: c.location?.coordinates?.[0] ?? 0,
      });
      setIsUpdateModalOpen(true);
    }
    catch (err) {
      console.error("Error fetching crime details:", err);
      alert("Error fetching crime details.");
    }
  };

  // ---------------------------
  // HANDLE UPDATE SUBMIT
  // ---------------------------
  const handleUpdateSubmit = async () => {
    if (!fullCrime) return;

    const body = {
      id: fullCrime.id,
      title: fullCrime.title,
      description: fullCrime.description,
      address: fullCrime.address,
      zoneId: fullCrime.zoneId,
      latitude: fullCrime.latitude,
      longitude: fullCrime.longitude,
    };
    try {
      const res = await fetch(`http://localhost:5000/api/crimes/update/${fullCrime.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Update failed: " + data.message);
        return;
      }

      // Update list
      const newList = records.map(r =>
        r.id === fullCrime.id ? { ...r, zoneId: fullCrime.zoneId } : r
      );

      setRecords(newList);
      setBackupRecords(newList);

      setIsUpdateModalOpen(false);
      setFullCrime(null);
      setSelectedRecords([]);

    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating entry.");
    }
  };


  return (
    <section className="flex flex-row h-screen w-full">
      <div className="flex flex-col gap-y-4 pl-76 p-4 w-full overflow-y-auto">
        <div className="bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-4 h-screen">
          <div className="flex flex-row justify-between items-start w-full">
            <div className="flex flex-col gap-y-2">
              {version === "admin" ? (
                <>
                  <div className="font-outfit font-semibold text-4xl text-black">
                    All Agents Records
                  </div>
                  <div className="font-outfit text-md text-[#A0A0A0]">
                    A complete list of all agents and their credentials stored in the system database.
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start">
                    <BackButton textSize="text-sm" iconSize={16} />
                  </div>
                  <div className="font-outfit font-semibold text-4xl text-black">
                    All Crime Records
                  </div>
                  <div className="font-outfit text-md text-[#A0A0A0]">
                    A complete list of all crime reports stored in the system database.
                  </div>
                </>
              )}
            </div>

            <div className="mt-1">
              <GreenButton label="Download CSV" width={200} height={40} rounded="full" />
            </div>
          </div>

          {/* 🔍 SEARCH BAR + BULK ACTION BUTTONS */}
          <div className="flex justify-between items-center gap-x-4 pr-4">
            <AllRecordsSearch onSearchChange={handleSearch} />

            {selectedRecords.length > 0 && (
              <div className="bg-white p-4 rounded-xl shadow mb-4 flex items-center gap-x-3">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 cursor-pointer text-white px-4 py-2 w-[125px] rounded-[5px] font-outfit text-sm hover:bg-red-700"
                  // className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={handleBulkUpdate}
                  className="bg-[#237E54] cursor-pointer text-white px-4 py-2 w-[125px] rounded-[5px] font-outfit text-sm hover:bg-[#1d6b48]"
                >
                  Update
                </button>
              </div>
            )}
          </div>

          {/* 📄 RECORDS TABLE */}
          <div>
            <RecordsTable
              version={version}
              records={records}
              selectedRecords={selectedRecords}
              onCheckboxChange={handleCheckboxChange}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>
      </div>

      {/* ------------------- UPDATE MODAL ------------------- */}
      {isUpdateModalOpen && fullCrime && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[450px] shadow-xl overflow-y-auto h-[550px]">

            <h2 className="text-2xl font-semibold mb-4">Update Crime Details</h2>

            <label className="block mb-1">Title</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full mb-3"
              value={fullCrime.title}
              onChange={(e) => setFullCrime({ ...fullCrime, title: e.target.value })}
            />

            <label className="block mb-1">Description</label>
            <textarea
              className="border rounded px-3 py-2 w-full mb-3"
              rows={3}
              value={fullCrime.description}
              onChange={(e) =>
                setFullCrime({ ...fullCrime, description: e.target.value })
              }
            />

            <label className="block mb-1">Address</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full mb-3"
              value={fullCrime.address}
              onChange={(e) => setFullCrime({ ...fullCrime, address: e.target.value })}
            />

            <label className="block mb-1">Zone</label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-full mb-3"
              value={fullCrime.zoneId}
              onChange={(e) =>
                setFullCrime({ ...fullCrime, zoneId: Number(e.target.value) })
              }
            />

            <label className="block mb-1">Location (Latitude)</label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-full mb-3"
              value={fullCrime.latitude}
              onChange={(e) =>
                setFullCrime({ ...fullCrime, latitude: Number(e.target.value) })
              }
            />

            <label className="block mb-1">Location (Longitude)</label>
            <input
              type="number"
              className="border rounded px-3 py-2 w-full mb-4"
              value={fullCrime.longitude}
              onChange={(e) =>
                setFullCrime({ ...fullCrime, longitude: Number(e.target.value) })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setFullCrime(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
