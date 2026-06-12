import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, FileText, AlertCircle } from "lucide-react";

export default function BillWiseOpeningMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Debug Sync Logging
  useEffect(() => {
    console.group("🧾 BillWiseOpeningMaster: Component Sync");
    console.log("Current Database State:", database);
    console.log("Bill Openings Found:", database?.billWiseOpenings?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.billWiseOpenings || [];
  const subGroups = database?.subGroups || [];
  const accounts = database?.accounts || [];

  const handleDelete = (id) => {
    console.warn(`🗑️ Attempting to delete Bill Opening ID: ${id}`);
    if (window.confirm("Are you sure you want to delete this bill-wise opening record?")) {
      onDelete(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 Bill Wise Opening Save Operation Started");
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      console.log("1. Raw Form Data:", data);

      const payload = {
        id: editingItem?.id || `BWO-${Date.now()}`,
        subGroup: data.subGroup,
        partyName: data.partyName,
        billNo: data.billNo,
        billDate: data.billDate,
        credit: parseFloat(data.credit) || 0,
        debit: parseFloat(data.debit) || 0,
        remarks: data.remarks
      };

      console.log("2. Prepared Payload for Backend:", payload);

      if (!payload.partyName || !payload.billNo) {
        throw new Error("Party Name and Bill Number are required.");
      }

      console.log("3. Executing onSave(payload)...");
      await onSave(payload);
      
      console.log("✅ Save successful. Closing modal.");
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Save failed in Component logic:", err.message);
      alert(err.message);
    }
    console.groupEnd();
  };

  const filteredData = dataList.filter(item => 
    (item.partyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.billNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      
      {/* State Warning */}
      {!database && (
        <div className="bg-amber-50 border-b border-amber-200 p-2 flex items-center gap-2 text-amber-700 text-xs font-bold justify-center">
          <AlertCircle className="w-4 h-4" /> Warning: database state is undefined.
        </div>
      )}

      {/* Header Section */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Bill Wise Opening</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Outstanding Balances on Go-Live</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Bill No or Party..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button 
            onClick={() => { 
                console.log("➕ Opening Bill-Wise Modal");
                setEditingItem(null); 
                setIsModalOpen(true); 
            }} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4">Party Details</th>
                <th className="p-4">Bill Info</th>
                <th className="p-4 text-right">Debit (Dr)</th>
                <th className="p-4 text-right">Credit (Cr)</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{item.partyName}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{item.subGroup}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-indigo-600 font-bold">{item.billNo}</div>
                    <div className="text-[10px] text-slate-400 font-mono italic">{item.billDate}</div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-600">
                    {item.debit > 0 ? item.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-orange-600">
                    {item.credit > 0 ? item.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : "-"}
                  </td>
                  <td className="p-4 text-slate-500 italic max-w-[150px] truncate" title={item.remarks}>
                    {item.remarks || <span className="opacity-30">N/A</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => { 
                            console.log("📝 Editing Bill Opening:", item);
                            setEditingItem(item); 
                            setIsModalOpen(true); 
                        }} 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 italic font-medium">
                    {dataList.length === 0 ? "No opening bills found. Add balances to begin tracking outstandings." : "No matching results."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-[#E2E8F0] bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                {editingItem ? "Edit Opening Bill" : "New Bill Wise Opening"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                
                {/* Entity Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Sub Group Mapping</label>
                    <select name="subGroup" required defaultValue={editingItem?.subGroup || ""} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                      <option value="">-- Select --</option>
                      {subGroups.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Party / Ledger Name</label>
                    <select name="partyName" required defaultValue={editingItem?.partyName || ""} className="w-full p-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                      <option value="">-- Select Party --</option>
                      {accounts.map(a => <option key={a.code} value={a.name}>{a.name} ({a.code})</option>)}
                    </select>
                  </div>
                </div>

                {/* Bill Basics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Bill / Invoice No</label>
                    <input name="billNo" required defaultValue={editingItem?.billNo || ""} className="w-full p-2.5 border border-slate-200 rounded-md text-xs font-mono font-bold" placeholder="INV-001" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Bill Date</label>
                    <input name="billDate" type="date" required defaultValue={editingItem?.billDate || ""} className="w-full p-2.5 border border-slate-200 rounded-md text-xs font-mono" />
                  </div>
                </div>

                {/* Balance Split */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase">Opening Debit (Dr)</label>
                    <input name="debit" type="number" step="any" required defaultValue={editingItem?.debit || 0} className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono font-bold text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-orange-600 uppercase">Opening Credit (Cr)</label>
                    <input name="credit" type="number" step="any" required defaultValue={editingItem?.credit || 0} className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono font-bold text-orange-700" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Remarks / Opening Notes</label>
                  <textarea name="remarks" rows={2} defaultValue={editingItem?.remarks || ""} className="w-full p-2.5 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Internal notes for this bill balance..."></textarea>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
                <button 
                  type="submit" 
                  className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-md shadow-indigo-100 transition-all"
                >
                  {editingItem ? "Update Record" : "Save Opening Balance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}