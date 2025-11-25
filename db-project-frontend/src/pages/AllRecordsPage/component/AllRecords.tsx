// // // AllRecordsPage/components/AllRecords.tsx
// import { useEffect, useState } from "react";
// import RecordsTable from "./RecordsTable";
// import GreenButton from "../../../components/GreenButton";
// import BackButton from "../../../components/BackButton";
// import { useNavigate } from "react-router-dom";
// import AllRecordsSearch from "./AllRecordsSearch";

// interface AllRecordsProps {
//   version: "admin" | "police" | "user" | null;
// }

// interface CrimeRecord {
//   id: number;
//   zoneName: string;
//   registeredBranchId: number | null;
//   submitterCnic: string | null;
//   crimeTypeName: string;
//   incidentDate: string;
// }

// export default function AllRecords({ version }: AllRecordsProps) {
//   const navigate = useNavigate();

//   const [records, setRecords] = useState<CrimeRecord[]>([]);
//   const [backupRecords, setBackupRecords] = useState<CrimeRecord[]>([]); // full data backup

//   useEffect(() => {
//     let mounted = true;

//     const fetchCrimes = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/crimes/all`);

//         if (!res.ok) throw new Error("Network response was not ok");

//         const data = await res.json();
//         if (!mounted) return;

//         if (data.success) {
//           setRecords(data.data);
//           setBackupRecords(data.data); // store original
//         } else {
//           console.error("Error fetching crimes:", data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching crimes:", err);
//       }
//     };

//     if (version === "police") {
//       fetchCrimes();
//     }

//     return () => {
//       mounted = false;
//     };
//   }, [version]);

//   // ---------------------------
//   // 🔍 SEARCH HANDLER
//   // ---------------------------
//   const handleSearch = (searchBy: string, value: string) => {
//     if (!value.trim()) {
//       setRecords(backupRecords); // reset to full list
//       return;
//     }

//     const lower = value.toLowerCase();

//     const filtered = backupRecords.filter((item: any) => {
//       const fieldValue = String(item[searchBy] ?? "").toLowerCase();
//       return fieldValue.includes(lower);
//     });

//     setRecords(filtered);
//   };

//   return (
//     <section className="flex flex-row h-screen w-full">
//       <div className="flex flex-col gap-y-4 pl-76 p-4 w-full overflow-y-auto">
//         <div className="bg-[#fefefe] p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col gap-y-4 h-screen">
//           <div className="flex flex-row justify-between items-start w-full">
//             <div className="flex flex-col gap-y-2">
//               {version === "admin" ? (
//                 <>
//                   <div className="font-outfit font-semibold text-4xl text-black">
//                     All Agents Records
//                   </div>
//                   <div className="font-outfit text-md text-[#A0A0A0]">
//                     A complete list of all agents and their credentials stored
//                     in the system database.
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-start">
//                     <BackButton textSize="text-sm" iconSize={16} />
//                   </div>
//                   <div className="font-outfit font-semibold text-4xl text-black">
//                     All Crime Records
//                   </div>
//                   <div className="font-outfit text-md text-[#A0A0A0]">
//                     A complete list of all crime reports stored in the system database.
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="mt-1">
//               <GreenButton
//                 label="Download CSV"
//                 width={200}
//                 height={40}
//                 rounded="full"
//               />
//             </div>
//           </div>

//           {/* 🔍 SEARCH BAR */}
//           <AllRecordsSearch onSearchChange={handleSearch} />

//           {/* 📄 RECORDS TABLE */}
//           <div>
//             <RecordsTable version={version} records={records} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


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
  incidentDate: string; // in format YYYY-MM-DD
}

export default function AllRecords({ version }: AllRecordsProps) {
  const navigate = useNavigate();

  const [records, setRecords] = useState<CrimeRecord[]>([]);
  const [backupRecords, setBackupRecords] = useState<CrimeRecord[]>([]); // full data backup

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
          setBackupRecords(data.data); // store original
        } else {
          console.error("Error fetching crimes:", data.message);
        }
      } catch (err) {
        console.error("Error fetching crimes:", err);
      }
    };

    if (version === "police") {
      fetchCrimes();
    }

    return () => {
      mounted = false;
    };
  }, [version]);

  // ---------------------------
  // 🔍 SEARCH HANDLER (EXACT MATCH)
  // ---------------------------
  const handleSearch = (searchBy: string, value: string) => {
    if (!value.trim() || searchBy === "") {
      setRecords(backupRecords); // reset to full list
      return;
    }

    const filtered = backupRecords.filter((item: any) => {
      const fieldValue = item[searchBy];

      if (fieldValue === null || fieldValue === undefined) return false;

      // Handle date search properly
      if (searchBy === "incidentDate") {
        const itemDate = new Date(fieldValue);
        const searchDate = new Date(value);

        return (
          itemDate.getFullYear() === searchDate.getFullYear() &&
          itemDate.getMonth() === searchDate.getMonth() &&
          itemDate.getDate() === searchDate.getDate()
        );
      }

      // For numbers, compare after converting to string
      if (typeof fieldValue === "number") {
        return String(fieldValue) === value;
      }

      // For strings, exact match (case-insensitive)
      return String(fieldValue).toLowerCase() === value.toLowerCase();
    });

    setRecords(filtered);
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
                    A complete list of all agents and their credentials stored
                    in the system database.
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
              <GreenButton
                label="Download CSV"
                width={200}
                height={40}
                rounded="full"
              />
            </div>
          </div>

          {/* 🔍 SEARCH BAR */}
          <AllRecordsSearch onSearchChange={handleSearch} />

          {/* 📄 RECORDS TABLE */}
          <div>
            <RecordsTable version={version} records={records} />
          </div>
        </div>
      </div>
    </section>
  );
}
