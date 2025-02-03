import { useState } from 'react'
import "cally";
import './App.css'

const branches = [
  { name: "เดอะมอลล์บางแค", salary: 1000 },
  { name: "เดอะมอลล์ท่าพระ", salary: 1000 },
  { name: "Terminal พระราม3", salary: 2000 },
  { name: "เซนทรัล พระราม3", salary: 2000 },
  { name: "สยาม", salary: 2500 },
  { name: "Terminal สุขุมวิท", salary: 3000 },
  { name: "One Bangkok", salary: 3000 }
];

function App() {
  const [date, setDate] = useState(new Date());
  const [branch, setBranch] = useState(branches[0]);
  const [hours, setHours] = useState(0);
  const [records, setRecords] = useState([]);

  const addRecord = () => {
    if (!hours || hours <= 0) return;
    const salary = hours * branch.salary;
    setRecords([...records, { date, branch, hours, salary }]);
    setHours(0);
  };

  const totalEarnings = records.reduce((sum, r) => sum + r.salary, 0);


  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="space-y-4">
          <label className="label">วันที่</label>
          <div className="flex justify-center">
            <calendar-date class="cally bg-base-100 border border-base-300 shadow-lg rounded-box">
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

          <label className="label">จำนวนชั่วโมงที่ทำงาน</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <button onClick={addRecord} className="btn btn-primary w-full">Add Record</button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">Work Records</h2>
          {records.length > 0 ? (
            records.map((r, index) => (
              <div key={index} className="flex justify-between border-b py-2">
                <span>{r.date.toDateString()} - {r.branch.name} - {r.hours} hrs</span>
                <span className="font-bold">฿{r.salary}</span>
              </div>
            ))
          ) : (
            <p>No records yet.</p>
          )}
          <hr />
          <h3 className="text-lg font-bold">Total: ฿{totalEarnings}</h3>
        </div>
      </div>
    </div>
  )
}

export default App
