import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

export default function BillWiseOpeningMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const dataList = database.billWiseOpenings || [];
  const subGroups = database.subGroups || [];
  const accounts = database.accounts || [];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      <div className="p-6 bg-white border-b border-[#E2E8F0] flex justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" placeholder="Search Bill No or Party..." value={searchTerm} onChange={e => setSearchTerm(e.target.value.toLowerCase())} className="w-full pl-9 pr-4 py-2 border rounded-md text-xs outline-none" />
        </div>
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Bill Wise Opening
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border rounded-lg shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                <th className="p-4">Party Name</th>
                <th className="p-4">Sub Group</th>
                <th className="p-4">Bill No</th>
                <th className="p-4">Bill Date</th>
                <th className="p-4 text-right">Credit</th>
                <th className="p-4 text-right">Debit</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dataList.filter(d => (d.partyName || "").toLowerCase().includes(searchTerm) || (d.billNo || "").toLowerCase().includes(searchTerm)).map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{item.partyName}</td>
                  <td className="p-4 text-slate-600">{item.subGroup}</td>
                  <td className="p-4 font-mono font-bold text-indigo-600">{item.billNo}</td>
                  <td className="p-4 font-mono">{item.billDate}</td>
                  <td className="p-4 text-right text-orange-600 font-semibold">{item.credit}</td>
                  <td className="p-4 text-right text-emerald-600 font-semibold">{item.debit}</td>
                  <td className="p-4 text-slate-500 italic max-w-[120px] truncate">{item.remarks}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-slate-500 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if(confirm("Delete?")) onDelete(item.id); }} className="text-slate-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-xl">
            <div className="flex justify-between pb-4 border-b mb-4">
              <h3 className="font-bold text-sm uppercase">Bill Wise Opening</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-600" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.target);
              onSave({
                id: editingItem?.id || "BWO-" + Date.now(),
                subGroup: fd.get("subGroup"),
                partyName: fd.get("partyName"),
                billNo: fd.get("billNo"),
                billDate: fd.get("billDate"),
                credit: Number(fd.get("credit")),
                debit: Number(fd.get("debit")),
                remarks: fd.get("remarks")
              });
              setIsModalOpen(false);
            }}>
              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Sub Group (Lookup)</label>
                    <select name="subGroup" required defaultValue={editingItem?.subGroup || ""} className="w-full p-2 border rounded outline-none">
                      <option value="">-- Select Sub Group --</option>
                      {subGroups.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Party Name (Lookup)</label>
                    <select name="partyName" required defaultValue={editingItem?.partyName || ""} className="w-full p-2 border rounded outline-none">
                      <option value="">-- Select Account --</option>
                      {accounts.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Bill No</label>
                    <input name="billNo" required defaultValue={editingItem?.billNo || ""} className="w-full p-2 border rounded outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">Bill Date</label>
                    <input name="billDate" type="date" required defaultValue={editingItem?.billDate || ""} className="w-full p-2 border rounded outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Credit</label>
                    <input name="credit" type="number" step="any" required defaultValue={editingItem?.credit || 0} className="w-full p-2 border rounded outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1">Debit</label>
                    <input name="debit" type="number" step="any" required defaultValue={editingItem?.debit || 0} className="w-full p-2 border rounded outline-none font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Remarks</label>
                  <textarea name="remarks" rows={2} defaultValue={editingItem?.remarks || ""} className="w-full p-2 border rounded outline-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-xs text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
