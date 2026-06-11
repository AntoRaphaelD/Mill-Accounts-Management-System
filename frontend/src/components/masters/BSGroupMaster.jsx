import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Bookmark, AlertCircle } from "lucide-react";

export default function BSGroupMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [slNoInput, setSlNoInput] = useState(0);
  const [ifNegativeInput, setIfNegativeInput] = useState("");

  useEffect(() => {
    console.group("🏷️ BSGroupMaster: Component Sync");
    console.log("BS Groups Found:", database?.bsGroups?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.bsGroups || [];
  const accountGroups = database?.groups || [];
  const mainGroups = database?.bsMainGroups || [];

  const openModal = (item = null) => {
    setEditingItem(item);
    setSlNoInput(item?.slNo || 0);
    setIfNegativeInput(item?.ifNegative || "");
    setIsModalOpen(true);
  };

  const handleDelete = (code) => {
    if (window.confirm(`Are you sure you want to delete BS Group: ${code}?`)) {
      onDelete(code);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      const payload = {
        code: editingItem?.code || data.code,
        bsGroup: data.bsGroup,
        accGroup: data.accGroup,
        slNo: parseInt(data.slNo) || 0,
        ifNegative: data.ifNegative,
        defaultSide: data.defaultSide
      };

      await onSave(payload);
      
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Save failed:", err.message);
      alert("Failed to save Balance Sheet Group.");
    }
  };

  const handleSlNoChange = (e) => {
    const val = e.target.value;
    setSlNoInput(val);
    
    // Look up the Main Group by its code/id matching the entered Sl No
    const matchingMainGroup = mainGroups.find(mg => String(mg.code) === String(val));
    if (matchingMainGroup) {
      setIfNegativeInput(matchingMainGroup.mainGroup);
    }
  };

  const filteredData = dataList.filter(item => 
    (item.bsGroup || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (String(item.code) || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full">
      {!database && (
        <div className="bg-amber-50 border-b border-amber-200 p-2 flex items-center gap-2 text-amber-700 text-xs font-bold justify-center">
          <AlertCircle className="w-4 h-4" /> Warning: database state is missing.
        </div>
      )}

      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Bookmark className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Balance Sheet Groups</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Map subgroups to the Balance Sheet</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search BS groups..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-64 pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <button onClick={() => openModal(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Add BS Group
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4 w-20">Code</th>
                <th className="p-4">BS Group</th>
                <th className="p-4">Acc. Group</th>
                <th className="p-4 text-center">Sl No</th>
                <th className="p-4">If Negative</th>
                <th className="p-4">Default</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.code} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-mono text-indigo-600 font-bold">{item.code}</td>
                  <td className="p-4 font-bold text-slate-800">{item.bsGroup}</td>
                  <td className="p-4 text-slate-600">{item.accGroup || "-"}</td>
                  <td className="p-4 text-center font-mono text-slate-500">{item.slNo}</td>
                  <td className="p-4 text-slate-600 text-[10px] uppercase font-bold">{item.ifNegative || "-"}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border ${item.defaultSide === "Credit" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{item.defaultSide}</span></td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.code)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[#E2E8F0] bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{editingItem ? "Edit BS Group" : "New BS Group"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Code</label><input name="code" type="number" required disabled={!!editingItem} defaultValue={editingItem?.code || ""} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono disabled:opacity-50" /></div>
                  <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Sl No.</label><input name="slNo" type="number" required value={slNoInput} onChange={handleSlNoChange} className="w-full p-2 border border-slate-200 rounded text-xs font-mono" /></div>
                </div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">BS Group (Name)</label><input name="bsGroup" required defaultValue={editingItem?.bsGroup || ""} className="w-full p-2 border border-slate-200 rounded text-xs" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Acc. Group</label><select name="accGroup" defaultValue={editingItem?.accGroup || ""} className="w-full p-2 border border-slate-200 rounded text-xs"><option value="">-- None --</option>{accountGroups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">If Negative (Shift To)</label><select name="ifNegative" value={ifNegativeInput} onChange={e => setIfNegativeInput(e.target.value)} className="w-full p-2 border border-slate-200 rounded text-xs"><option value="">-- Do Not Shift --</option>{mainGroups.map(mg => <option key={mg.code} value={mg.mainGroup}>{mg.mainGroup}</option>)}</select></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Default Side</label><select name="defaultSide" defaultValue={editingItem?.defaultSide || "Credit"} className="w-full p-2 border border-slate-200 rounded text-xs"><option value="Credit">Credit</option><option value="Debit">Debit</option></select></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-semibold text-slate-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-md">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}