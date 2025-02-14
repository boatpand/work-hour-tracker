import { useState, useEffect } from 'react'
import "cally";
import './App.css'

const branches = [
  { name: "เดอะมอลล์บางแค", salary: 1000 },
  { name: "เดอะมอลล์ท่าพระ", salary: 1000 },
  { name: "Terminal พระราม3", salary: 2000 },
  { name: "เซนทรัล พระราม3", salary: 2000 },
  { name: "สยาม", salary: 2500 },
  { name: "Terminal สุขุมวิท", salary: 3000 },
  { name: "One Bangkok", salary: 3000 },
  { name: "เซนทรัล พระราม2", salary: 2500 },
];

const loadRecords = () => {
  const savedRecords = localStorage.getItem("workRecords");
  return savedRecords ? JSON.parse(savedRecords) : [];
};

function App() {
  const [records, setRecords] = useState(loadRecords);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [branch, setBranch] = useState(branches[0]);
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
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Function to download JSON file
  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "work_records.json";
    link.click();
  };

  // Function to load JSON from file
  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setRecords(jsonData);
        localStorage.setItem("workRecords", JSON.stringify(jsonData)); // Save to localStorage
      } catch (error) {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  };

  const [services, setServices] = useState({
    botox: false,
    filler: false,
  });
  
  const handleChange = (event) => {
    setServices({
      ...services,
      [event.target.name]: event.target.checked,
    });
  };
  
  const addRecord = () => {
    if (!hours || hours <= 0) return;
    const baseSalary = hours * branch.salary;
    const botoxBonus = services.botox ? 1500 : 0;
    const fillerBonus = services.filler ? 2000 : 0;
    const totalSalary = baseSalary + Number(extraEarnings) + botoxBonus + fillerBonus;
    const newRecord = { date: formatDate(selectedDate), branch, hours, extraEarnings, baseSalary, botoxBonus, fillerBonus, totalSalary };
    setRecords([...records, newRecord]);
    setHours(0);
    setExtraEarnings(0);
    setServices({ botox: false, filler: false });
  };

  const deleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const deleteAllRecords = () => {
    setRecords([]); // Clear the state
    localStorage.removeItem("workRecords"); // Remove from localStorage
  };

  const totalEarnings = records.reduce((sum, r) => sum + r.totalSalary, 0);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="space-y-4">
          <label className="label">วันที่</label>
          <div className="flex justify-center">
            <calendar-date class="cally bg-base-100 border border-base-300 shadow-lg rounded-box" onChange={(e) => setSelectedDate(new Date(e.target.value))}>
              <svg aria-label="Previous" className="size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
              <svg aria-label="Next" className="size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
              <calendar-month></calendar-month>
            </calendar-date>
          </div>
          <label className="label">สาขา</label>
          <select
            className="select select-bordered w-full"
            onChange={(e) => setBranch(branches.find(b => b.name === e.target.value))}
          >
            {branches.map((b) => (
              <option key={b.name} value={b.name}>{b.name} (฿{b.salary}/hour)</option>
            ))}
          </select>

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

          <button onClick={addRecord} className="btn btn-primary w-full">Add Record</button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Work Records</h2>
          {records.length > 0 ? (
            records.map((r, index) => (
              <div key={index} className="border-b py-2">
                <div>
                  <p><strong>วันที่:</strong> {r.date}</p>
                  <p><strong>สาขา:</strong> {r.branch.name}</p>
                  <p><strong>ค่าแรง:</strong> ฿{r.baseSalary}</p>
                  <p><strong>รายได้เพิ่มเติม:</strong> ฿{r.extraEarnings}</p>
                  {r.botoxBonus > 0 && <p><strong>Botox Bonus:</strong> ฿{r.botoxBonus}</p>}
                  {r.fillerBonus > 0 && <p><strong>Filler Bonus:</strong> ฿{r.fillerBonus}</p>}
                  <p className="font-bold">💰 รวมเงิน: ฿{r.totalSalary}</p>
                </div>
                <button onClick={() => deleteRecord(index)} className="btn btn-error btn-sm">
                🗑️
               </button>
              </div>
            ))
          ) : (
            <p>No records yet.</p>
          )}
          <button onClick={deleteAllRecords} className="btn btn-warning w-full mt-4">❌ Delete All Records</button>
          <hr />
          <h3 className="text-lg font-bold">💰🚀 Total: ฿{totalEarnings}</h3>
        </div>
      </div>
       {/* Buttons for saving/loading */}
       <div className="flex space-x-2">
        <button onClick={saveToFile} className="btn btn-primary">Download JSON</button>
        <input type="file" accept="application/json" onChange={loadFromFile} className="file-input" />
      </div>
    </div>
  )
}

export default App
