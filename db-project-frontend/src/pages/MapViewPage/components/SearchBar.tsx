// // SearchBar.tsx
// import React, { useState, useContext, useEffect, useRef } from "react";
// import { MapContext } from "./MapContext";

// const SearchBar: React.FC = () => {
//     const {
//         filters,
//         setFilters,
//         radiusMode,
//         setRadiusMode,
//         radiusValue,
//         setRadiusValue,
//         radiusCenter,
//         setRadiusCenter,
//     } = useContext(MapContext);

//     const [mode, setMode] = useState<"basic" | "radius">("basic");
//     const searchBarRef = useRef<HTMLDivElement>(null);

//     const crimeTypes = ["All", "Theft", "Robbery", "Assault", "Burglary"];
//     const zones = ["All Zones", "Zone 1", "Zone 2", "Zone 3", "Zone 4 sdfsdfsgrsd"];

//     useEffect(() => {
//         (window as any).searchBarRef = searchBarRef;
//     }, []);
//     const switchMode = (newMode: "basic" | "radius") => {
//         setMode(newMode);

//         if (newMode === "basic") {
//             setRadiusMode(false);
//             setRadiusCenter(null);
//             setRadiusValue(0);
//         } else {
//             setRadiusMode(true);
//             setRadiusValue(500);
//         }
//     };

//     const handleSearch = () => {
//         if (mode === "basic") setRadiusMode(false);
//         else setRadiusMode(true);

//         console.log("🔍 Filters applied:", filters);
//         console.log("📏 Radius Mode:", radiusMode);
//         console.log("📐 Radius Value:", radiusValue);
//         console.log("📍 Radius Center:", radiusCenter);
//     };

//     const handleReset = () => {
//         setFilters({
//             crimeType: "All",
//             zoneId: "All Zones",
//             dateRange: { start: "", end: "" },
//         });
//         setRadiusMode(false);
//         setRadiusValue(0);
//         setRadiusCenter(null);
//     };

//     return (
//         <div
//             ref={searchBarRef}
//             className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]"
//             onClick={(e) => e.stopPropagation()}
//             onMouseDown={(e) => e.stopPropagation()}
//             onTouchStart={(e) => e.stopPropagation()}
//         >
//             {/* Main bar */}
//             <div className="flex text-[14px] w-[1020px] bg-[rgba(255,255,255,0.9)] shadow-lg rounded-full overflow-hidden">
//                 {/* Left Pill: Mode */}
//                 <div className="flex-none">
//                     <select
//                         className="w-30 text-[17px] text-center h-full px-4 bg-linear-to-r from-[#145332] to-[#237E54] text-white font-semibold rounded-full focus:outline-none hover:bg-[#0F805C] border border-grey-300"
//                         value={mode}
//                         onChange={(e) => switchMode(e.target.value as "basic" | "radius")}
//                     >
//                         <option value="basic">Basic</option>
//                         <option value="radius">Radius</option>
//                     </select>
//                 </div>

//                 {/* Center Pill: Filters */}
//                 <div className="flex-1 flex items-center justify-center mt-2 mb-2 px-4 gap-2 bg-[rgba(255,255,255,0)]">
//                     {mode === "basic" ? (
//                         <>
//                             <span>Show</span>
//                             <select
//                                 className="pl-2 mx-1 h-8 w-25 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none pr-4"
//                                 value={filters.crimeType}
//                                 onChange={(e) =>
//                                     setFilters((prev) => ({ ...prev, crimeType: e.target.value }))
//                                 }
//                             >
//                                 {crimeTypes.map((c) => (
//                                     <option key={c}>{c}</option>
//                                 ))}
//                             </select>
//                             <span>crimes in</span>
//                             <select
//                                 className="pl-2 mx-1 h-8 w-26 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none pr-4"
//                                 value={filters.zoneId}
//                                 onChange={(e) =>
//                                     setFilters((prev) => ({ ...prev, zoneId: e.target.value }))
//                                 }
//                             >
//                                 {zones.map((z) => (
//                                     <option key={z}>{z}</option>
//                                 ))}
//                             </select>
//                             <span>from</span>
//                             <input
//                                 type="date"
//                                 className="p-2 mx-1 w-32 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none"
//                                 value={filters.dateRange.start}
//                                 onChange={(e) =>
//                                     setFilters((prev) => ({
//                                         ...prev,
//                                         dateRange: { ...prev.dateRange, start: e.target.value },
//                                     }))
//                                 }
//                             />
//                             <span>to</span>
//                             <input
//                                 type="date"
//                                 className="p-2 w-32 ml-1 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none"
//                                 value={filters.dateRange.end}
//                                 onChange={(e) =>
//                                     setFilters((prev) => ({
//                                         ...prev,
//                                         dateRange: { ...prev.dateRange, end: e.target.value },
//                                     }))
//                                 }
//                             />
//                         </>
//                     ) : (
//                         <>
//                             <span>Show crimes within</span>
//                             <input
//                                 type="number"
//                                 className="p-2 text-center h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none w-20"
//                                 value={radiusValue}
//                                 onChange={(e) => setRadiusValue(Number(e.target.value))}
//                             />
//                             <span>meters of</span>
//                             <div className="flex gap-1">
//                                 <input
//                                     type="number"
//                                     placeholder="lat"
//                                     className="p-2 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none w-24"
//                                     value={radiusCenter?.lat ?? ""}
//                                     onChange={(e) =>
//                                         setRadiusCenter((prev) => ({
//                                             lat: Number(e.target.value),
//                                             lng: prev?.lng ?? 0,
//                                         }))
//                                     }
//                                 />
//                                 <span>,</span>
//                                 <input
//                                     type="number"
//                                     placeholder="lng"
//                                     className="p-2 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none w-24"
//                                     value={radiusCenter?.lng ?? ""}
//                                     onChange={(e) =>
//                                         setRadiusCenter((prev) => ({
//                                             lat: prev?.lat ?? 0,
//                                             lng: Number(e.target.value),
//                                         }))
//                                     }
//                                 />
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 {/* Right Pill: Buttons */}
//                 <div className="flex-none flex">
//                     <button
//                         className="px-6 py-2 rounded-l-full text-[15px] font-medium text-white bg-linear-to-r from-[#145332] to-[#1B6842] border border-r-[#679981] hover:from-[#145332] hover:to-[#145332] cursor-pointer"
//                         onClick={handleSearch}
//                     >
//                         Search
//                     </button>
//                     <button
//                         className="px-6 py-2 rounded-r-full text-[15px] font-medium text-white bg-linear-to-r from-[#1B6842] to-[#237E54]  border border-l-0 hover:from-[#145332] hover:to-[#145332] cursor-pointer"
//                         onClick={handleReset}
//                     >
//                         Reset
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SearchBar;

// SearchBar.tsx

import React, { useState, useContext, useEffect, useRef } from "react";
import { MapContext } from "./MapContext";

const SearchBar: React.FC = () => {
    const {
        filters,
        setFilters,
        radiusMode,
        setRadiusMode,
        radiusValue,
        setRadiusValue,
        radiusCenter,
        setRadiusCenter,
        searchVersion,
        setSearchVersion,
    } = useContext(MapContext);

    const [mode, setMode] = useState<"basic" | "radius">(
        () => (new URLSearchParams(window.location.search).get("mode") as any) ?? "basic"
    );
    const searchBarRef = useRef<HTMLDivElement>(null);


    const crimeTypes = ["All", "Theft", "Robbery", "Assault", "Burglary"];
    const zones = ["All", "Zone 1", "Zone 2", "Zone 3", "Zone 4"];

    useEffect(() => {
        (window as any).searchBarRef = searchBarRef;
    }, []);

    // Build & push URL based on context state (does not fetch)
    const pushUrlFromContext = (extra?: { mode?: string }) => {
        const params = new URLSearchParams();

        if ((extra && extra.mode === "radius") || (extra === undefined && radiusMode)) {
            params.set("mode", "radius");
            if (radiusCenter) {
                params.set("lat", String(radiusCenter.lat));
                params.set("lng", String(radiusCenter.lng));
            }
            params.set("radius", String(radiusValue));
        } else {
            params.set("mode", "basic");
            if (filters.crimeType && filters.crimeType !== "All")
                params.set("crimeType", filters.crimeType);
            if (filters.zoneId && filters.zoneId !== "All") params.set("zoneId", filters.zoneId);
            if (filters.dateRange.start) params.set("startDate", filters.dateRange.start);
            if (filters.dateRange.end) params.set("endDate", filters.dateRange.end);
        }

        const newUrl = `/map?${params.toString()}`;
        window.history.pushState({}, "", newUrl);
    };

    // When user presses Search: update URL and trigger fetch (increment searchVersion)
    const handleSearch = () => {
        // make sure context state matches mode
        setRadiusMode(mode === "radius");

        // push URL
        pushUrlFromContext({ mode });

        // trigger fetch by incrementing searchVersion
        setSearchVersion((v) => v + 1);
    };

    // Reset: clear context, remove URL params, and trigger fetch
    const handleReset = () => {
        setFilters({
            crimeType: "All",
            zoneId: "All",
            dateRange: { start: "", end: "" },
        });
        setRadiusMode(false);
        setRadiusValue(0);
        setRadiusCenter(null);
        setMode("basic");

        // clear URL
        window.history.pushState({}, "", "/map");

        // trigger fetch
        setSearchVersion((v) => v + 1);
    };

    const switchMode = (newMode: "basic" | "radius") => {
        setMode(newMode);
        if (newMode === "basic") {
            setRadiusMode(false);
            setRadiusCenter(null);
            setRadiusValue(0);
        } else {
            setRadiusMode(true);
            if (!radiusValue) setRadiusValue(500);
        }
    };

    return (
        <div

            ref={searchBarRef}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            {/* Main bar */}
            <div className="flex text-[14px] w-[1020px] bg-[rgba(255,255,255,0.9)] shadow-lg rounded-full overflow-hidden">
                {/* Left Pill: Mode */}
                <div className="flex-none">
                    <select
                        className="w-30 text-[17px] text-center h-full px-4 bg-linear-to-r from-[#145332] to-[#237E54] text-white font-semibold rounded-full focus:outline-none hover:bg-[#0F805C] border border-grey-300"
                        value={mode}
                        onChange={(e) => switchMode(e.target.value as "basic" | "radius")}
                    >
                        <option value="basic">Basic</option>
                        <option value="radius">Radius</option>
                    </select>
                </div>

                {/* Center Pill: Filters */}
                <div className="flex-1 flex items-center justify-center mt-2 mb-2 px-4 gap-2 bg-[rgba(255,255,255,0)]">
                    {mode === "basic" ? (
                        <>
                            <span>Show</span>
                            <select
                                className="pl-2 mx-1 h-8 w-25 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none pr-4"
                                value={filters.crimeType}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, crimeType: e.target.value }))
                                }
                            >
                                {crimeTypes.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                            <span>crimes in</span>
                            <select
                                className="pl-2 mx-1 h-8 w-26 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none pr-4"
                                value={filters.zoneId}
                                onChange={(e) => setFilters((prev) => ({ ...prev, zoneId: e.target.value }))}
                            >
                                {zones.map((z) => (
                                    <option key={z}>{z}</option>
                                ))}
                            </select>
                            <span>from</span>
                            <input
                                type="date"
                                className="p-2 mx-1 w-32 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none"
                                value={filters.dateRange.start}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        dateRange: { ...prev.dateRange, start: e.target.value },
                                    }))
                                }
                            />
                            <span>to</span>
                            <input
                                type="date"
                                className="p-2 w-32 ml-1 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none"
                                value={filters.dateRange.end}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        dateRange: { ...prev.dateRange, end: e.target.value },
                                    }))
                                }
                            />
                        </>
                    ) : (
                        <>
                            <span>Show crimes within</span>
                            <input
                                type="number"
                                className="p-2 text-center h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none w-20"
                                value={radiusValue}
                                onChange={(e) => setRadiusValue(Number(e.target.value))}
                            />
                            <span>meters of</span>
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    placeholder="lat"
                                    className="p-2 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none w-24"
                                    value={radiusCenter?.lat ?? ""}
                                    onChange={(e) =>
                                        setRadiusCenter((prev) => ({
                                            lat: Number(e.target.value),
                                            lng: prev?.lng ?? 0,
                                        }))
                                    }
                                />
                                <span>,</span>
                                <input
                                    type="number"
                                    placeholder="lng"
                                    className="p-2 h-8 rounded-full shadow-[0px_0px_5px_rgba(0,0,0,0.3)] border-none focus:outline-none w-24"
                                    value={radiusCenter?.lng ?? ""}
                                    onChange={(e) =>
                                        setRadiusCenter((prev) => ({
                                            lat: prev?.lat ?? 0,
                                            lng: Number(e.target.value),
                                        }))
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Right Pill: Buttons */}
                <div className="flex-none flex">
                    <button
                        className="px-6 py-2 rounded-l-full text-[15px] font-medium text-white bg-linear-to-r from-[#145332] to-[#1B6842] border border-r-[#679981] hover:from-[#145332] hover:to-[#145332] cursor-pointer"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    <button
                        className="px-6 py-2 rounded-r-full text-[15px] font-medium text-white bg-linear-to-r from-[#1B6842] to-[#237E54]  border border-l-0 hover:from-[#145332] hover:to-[#145332] cursor-pointer"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};


export default SearchBar;
