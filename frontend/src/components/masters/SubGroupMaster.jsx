import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

export default function SubGroupMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Supports both App.tsx (subgroups) and App.jsx dbState (subGroups)
  const dataList = database.subGroups || database.subgroups || [];
  const groups = database.groups || [];

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this Sub Group?")) {
      onDelete(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
      <div className="p-6 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Sub Groups..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value.toLowerCase())}
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-md text-xs outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Sub Group
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4">Sub Group Description</th>
                <th className="p-4">Group Description</th>
                <th className="p-4">Main Description</th>
                <th className="p-4">Ledger Type</th>
                <th className="p-4 text-center">TB Sl.No</th>
                <th className="p-4 text-center">P & L</th>
                <th className="p-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {dataList.filter(s => (s.name || "").toLowerCase().includes(searchTerm)).map(item => (
                <tr key={item.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-4 font-semibold text-slate-800">{item.name}</td>
                  <td className="p-4 text-slate-600">{item.groupName}</td>
                  <td className="p-4 text-slate-600">{item.mainDescription}</td>
                  <td className="p-4 text-slate-600">{item.ledgerType}</td>
                  <td className="p-4 text-center font-mono">{item.tbSlNo}</td>
                  <td className="p-4 text-center font-mono">{item.pnl}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-slate-500 hover:text-[#2563EB]"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E293B]/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-[#E2E8F0] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-[#1E293B] text-sm uppercase">{editingItem ? "Edit" : "Create"} Sub Group</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={async e => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = Object.fromEntries(fd.entries());
              await onSave({
                id: editingItem?.id || undefined,
                name: data.name,
                groupName: data.groupName,
                mainDescription: data.mainDescription,
                ledgerType: data.ledgerType,
                tbSlNo: Number(data.tbSlNo),
                pnl: Number(data.pnl)
              });
              setIsModalOpen(false);
            }}>
              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1">Sub Group Description</label>
                  <input name="name" required defaultValue={editingItem?.name || ""} className="w-full p-2 border rounded outline-none" />
                </div>
                <div>
                  <label className="block mb-1">Group Description</label>
                  <select name="groupName" required defaultValue={editingItem?.groupName || ""} className="w-full p-2 border rounded outline-none">
                    <option value="">-- Select Group --</option>
                    {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Main Description</label>
                  <select name="mainDescription" required defaultValue={editingItem?.mainDescription || ""} className="w-full p-2 border rounded outline-none">
                    <option value="">-- Select Main Desc --</option>
                    <option value="Assets">Assets</option>
                    <option value="Liabilities">Liabilities</option>
                    <option value="Incomes">Incomes</option>
                    <option value="Expenses">Expenses</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Ledger Type</label>
                  <select name="ledgerType" required defaultValue={editingItem?.ledgerType || ""} className="w-full p-2 border rounded outline-none">
                    <option value="">-- Select Ledger Type --</option>
                    <option value="GENERAL LEDGER">GENERAL LEDGER</option>
                    <option value="SUB LEDGER">SUB LEDGER</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">TB Sl.No</label>
                    <input name="tbSlNo" type="number" required defaultValue={editingItem?.tbSlNo || ""} className="w-full p-2 border rounded outline-none" />
                  </div>
                  <div>
                    <label className="block mb-1">P & L</label>
                    <input name="pnl" type="number" required defaultValue={editingItem?.pnl || ""} className="w-full p-2 border rounded outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-xs text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] text-white rounded text-xs font-semibold">{editingItem ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}