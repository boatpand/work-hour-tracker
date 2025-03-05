import { useState, useEffect } from "react";
import "cally";
import "./App.css";

const loadRecords = () => {
  const savedRecords = localStorage.getItem("workRecords");
  return savedRecords ? JSON.parse(savedRecords) : [];
};

function App() {
  const [selectedWork, setSelectedWork] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const works = ["V-Square", "SLC", "LABX"];
  const workOptions = {
    "V-Square": [
      "เดอะมอลล์บางแค",
      "เดอะมอลล์ท่าพระ",
      "Terminal พระราม3",
      "เซนทรัล พระราม3",
      "สยาม",
      "Terminal สุขุมวิท",
      "One Bangkok",
      "เซนทรัล พระราม2",
    ],
    SLC: ["เดอะมอลล์บางแค"],
    LABX: ["เดอะมอลล์บางแค", "ซีคอนบางแค"],
  };

  const [records, setRecords] = useState(loadRecords);
  // const [records, setRecords] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [botoxQuantity, setBotoxQuantity] = useState(0);
  const [fillerQuantity, setFillerQuantity] = useState(0);
  const [threadLiftQuantity, setThreadLiftQuantity] = useState(0);
  const [threadQuantity, setThreadQuantity] = useState(0);
  const [hours, setHours] = useState(0);
  const [extraEarnings, setExtraEarnings] = useState(0);

  // Save to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem("workRecords", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const datePicker = document.querySelector("calendar-date");
    if (datePicker) {
      datePicker.addEventListener("change", (event) => {
        setSelectedDate(new Date(event.target.value));
      });
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [services, setServices] = useState({
    botox: false,
    filler: false,
    threadlift: false,
  });

  const handleChange = (event) => {
    setServices({
      ...services,
      [event.target.name]: event.target.checked,
    });
  };

  const addRecord = () => {
    if (!selectedWork || !selectedBranch) return;
    if (!hours || hours <= 0) return;

    const branchRates = {
      "V-Square": {
        เดอะมอลล์บางแค: 1000,
        เดอะมอลล์ท่าพระ: 1000,
        "Terminal พระราม3": 2000,
        "เซนทรัล พระราม3": 2000,
        สยาม: 2500,
        "Terminal สุขุมวิท": 3000,
        "One Bangkok": 3000,
        "เซนทรัลพระราม 2": 2500,
      },
      SLC: { เดอะมอลล์บางแค: 3000 },
      LABX: { เดอะมอลล์บางแค: 3000, ซีคอนบางแค: 3000 },
    };

    // Calculate money earned
    const branchRate = branchRates[selectedWork]?.[selectedBranch] || 0;
    const totalMoney =
      hours * branchRate +
      botoxQuantity * 1000 +
      fillerQuantity * 2000 +
      threadLiftQuantity * 2000 +
      threadQuantity * (selectedWork === "V-Square" ? 150 : 200) +
      Number(extraEarnings);

    const newRecord = {
      date: selectedDate.toDateString(),
      work: selectedWork,
      branch: selectedBranch,
      money: totalMoney,
    };

    setRecords([...records, newRecord]);
    console.log("Add Record");
  };

  const deleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const deleteAllRecords = () => {
    setRecords([]); // Clear the state
    localStorage.removeItem("workRecords"); // Remove from localStorage
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="space-y-4">
          <div className="flex justify-center">
            <calendar-date
              class="cally bg-base-100 border border-base-300 shadow-lg rounded-box"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            >
              <svg
                aria-label="Previous"
                className="size-4"
                slot="previous"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                ></path>
              </svg>
              <svg
                aria-label="Next"
                className="size-4"
                slot="next"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
              <calendar-month></calendar-month>
            </calendar-date>
          </div>

          <div className="p-4">
            <label className="block mb-2 text-lg font-semibold">
              Select Work:
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedWork}
              onChange={(e) => {
                setSelectedWork(e.target.value);
                setSelectedBranch("");
              }}
            >
              <option value="" disabled>
                Select your work
              </option>
              {Object.keys(workOptions).map((work) => (
                <option key={work} value={work}>
                  {work}
                </option>
              ))}
            </select>

            {selectedWork && (
              <>
                <label className="block mt-4 mb-2 text-lg font-semibold">
                  Select Branch:
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  {workOptions[selectedWork].map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedWork && selectedBranch && (
              <p className="mt-4">
                Tracking hours for: <strong>{selectedWork}</strong> at{" "}
                <strong>{selectedBranch}</strong>
              </p>
            )}
          </div>

          {selectedWork === "V-Square" && (
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="botox"
                  checked={services.botox}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span>Botox ฿1000</span>
              </label>
              <input
                type="number"
                min="0"
                className="input input-bordered w-16"
                placeholder="Qty"
                value={botoxQuantity}
                onChange={(e) => setBotoxQuantity(e.target.value)}
                disabled={!services.botox}
              />
            </div>
          )}

          {selectedWork === "V-Square" && (
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="filler"
                  checked={services.filler}
                  onChange={handleChange}
                  className="checkbox checkbox-secondary"
                />
                <span>Filler ฿2000</span>
              </label>
              <input
                type="number"
                min="0"
                className="input input-bordered w-16"
                placeholder="Qty"
                value={fillerQuantity}
                onChange={(e) => setFillerQuantity(e.target.value)}
                disabled={!services.filler}
              />
            </div>
          )}

          {selectedWork && (
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="threadlift"
                  checked={services.threadlift}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span>Thread Lift</span>
              </label>
              <input
                type="number"
                min="0"
                className="input input-bordered w-16"
                placeholder="Qty"
                value={threadLiftQuantity}
                onChange={(e) => setThreadLiftQuantity(e.target.value)}
                disabled={!services.threadlift}
              />
              <input
                type="number"
                min="0"
                className="input input-bordered w-16"
                placeholder="Qty"
                value={threadQuantity}
                onChange={(e) => setThreadQuantity(e.target.value)}
                disabled={!services.threadlift}
              />
            </div>
          )}

          <label className="label">จำนวนชั่วโมงที่ทำงาน</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <label className="label">รายได้เพิ่มเติม</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={extraEarnings}
            onChange={(e) => setExtraEarnings(e.target.value)}
          />

          <button
            className="btn btn-primary mt-4 w-full"
            onClick={addRecord}
            disabled={!selectedWork || !selectedBranch}
          >
            Add Record
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Work Records</h2>
        <div className="space-y-4">
          {records.length === 0 ? (
            <p>No records available</p>
          ) : (
            records.map((record, index) => (
              <div key={index} className="border p-4 rounded-md">
                <p>
                  <strong>Date:</strong> {record.date}
                </p>
                <p>
                  <strong>Work:</strong> {record.work}
                </p>
                <p>
                  <strong>Branch:</strong> {record.branch}
                </p>
                <p>
                  <strong>Total Money:</strong> ฿{record.money}
                </p>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => deleteRecord(index)}
                >
                  Delete Record
                </button>
              </div>
            ))
          )}
        </div>
        {records.length > 0 && (
          <button
            className="btn btn-error mt-4 w-full"
            onClick={deleteAllRecords}
          >
            Delete All Records
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
