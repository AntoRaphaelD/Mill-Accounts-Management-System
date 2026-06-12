import React, { useState } from "react";
import { Plus, X, FileText } from "lucide-react";

export default function E1Form() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <h3 className="font-bold uppercase text-sm text-slate-800">E1 Form Register</h3>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Add E1 Form</button>
      </div>
      <div className="p-6 flex-1 text-center text-slate-400 text-sm mt-10">Click Add E1 Form to begin.</div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold uppercase text-sm">E1 Form Entry</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500"/></button>
            </div>
            
            <div className="p-6 overflow-auto flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex flex-col"><label>From Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>To Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Issued Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Entry Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Buyer's Name</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>C FORM No.</label>
                  <select className="p-2 border rounded"><option>-- Select C Form --</option></select>
                </div>
                <div className="flex flex-col"><label>C Form Amount</label><input type="number" className="p-2 border rounded font-mono" /></div>
                <div className="flex flex-col"><label>E1 FORM No.</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Agent's Name</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Tin No.</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col col-span-2"><label>Remarks</label><input type="text" className="p-2 border rounded" /></div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-2 bg-slate-50 shrink-0">
              <button className="px-4 py-2 bg-white border rounded text-xs font-bold flex items-center gap-1 mr-auto"><FileText className="w-4 h-4"/> Report</button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded text-xs font-bold">Save</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border rounded text-xs font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}