interface RecordData {
  [key: string]: string | number | null | undefined;
}

interface RecordsTableProps {
  version: "admin" | "police" | "user" | null;
  records?: RecordData[];
}

function RecordsTable({ version, records = [] }: RecordsTableProps) {
  const headers =
    version === "admin"
      ? [
          "Agent ID",
          "Branch ID",
          "Username",
          "Password",
          "Branch Contact #",
          "Date of Creation",
        ]
      : [
          "Crime ID",
          "Zone #",
          "Reg. Branch ID",
          "Reporter CNIC",
          "Crime Type",
          "Date",
        ];

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-y-auto max-h-[400px] rounded-b-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#237E54] text-white text-sm">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <tr
                  key={index}
                  className={`text-sm hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {headers.map((header) => {
                    const key = header
                      .toLowerCase()
                      .replace(/[#.]/g, "")
                      .replace(/\s+/g, "_");
                    return (
                      <td key={key} className="px-4 py-3 border-b">
                        {record[key] ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-6 text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecordsTable;