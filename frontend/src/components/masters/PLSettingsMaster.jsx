import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, ListFilter, AlertCircle } from "lucide-react";

export default function PLSettingsMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Log component mount and incoming props for debugging
  useEffect(() => {
    console.group("📊 PLSettingsMaster: Component Sync");
    console.log("Current Database State:", database);
    console.log("P&L Settings Found:", database?.plSettings?.length || 0);
    console.log("Groups available for mapping:", database?.groups?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.plSettings || [];
  const groups = database?.groups || [];
  const accounts = database?.accounts || [];

  const handleDelete = (id) => {
    console.warn(`🗑️ Attempting to delete P&L Setting ID: ${id}`);
    if (window.confirm("Are you sure you want to delete this P&L mapping?")) {
      onDelete(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 P&L Setting Save Operation Started");
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      console.log("1. Raw Form Data:", data);

      const payload = {
        // Use existing ID or generate a new one for a new record
        id: editingItem?.id || `PL-${Date.now()}`,
        groupDescription: data.groupDescription,
        ledger: data.ledger,
        slNo1: parseInt(data.slNo1) || 0,
        slNo: parseInt(data.slNo) || 0,
      };

      console.log("2. Prepared Payload for Backend:", payload);

      if (!payload.groupDescription || !payload.ledger) {
        throw new Error("Group Description and Ledger are required.");
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
    (item.groupDescription || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.ledger || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full">
      {/* Sync Warning */}
      {!database && (
        <div className="bg-amber-50 border-b border-amber-200 p-2 flex items-center gap-2 text-amber-700 text-xs font-bold justify-center">
          <AlertCircle className="w-4 h-4" /> Warning: database state is missing.
        </div>
      )}

      {/* Header Section */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <ListFilter className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Profit & Loss Settings</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Map Ledgers to Statement Rows</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search mapping..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button 
            onClick={() => { 
                console.log("➕ Opening P&L Setting Modal");
                setEditingItem(null); 
                setIsModalOpen(true); 
            }} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Mapping
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4">Group Description</th>
                <th className="p-4">Linked Ledger</th>
                <th className="p-4 text-right">Sl No. 1</th>
                <th className="p-4 text-right">Sl No.</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-bold text-slate-800">{item.groupDescription}</td>
                  <td className="p-4 text-indigo-600 font-semibold">{item.ledger}</td>
                  <td className="p-4 text-right font-mono text-slate-500">{item.slNo1}</td>
                  <td className="p-4 text-right font-mono text-slate-700 font-bold">{item.slNo}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { 
                            console.log("📝 Editing Mapping:", item);
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
                  <td colSpan="5" className="p-12 text-center text-slate-400 italic font-medium">
                    {dataList.length === 0 ? "No P&L configurations found. Add one to begin statement mapping." : "No matching results."}
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
          <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-[#E2E8F0] bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                {editingItem ? "Edit P&L Setting" : "New P&L Configuration"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Group Description (from Groups)</label>
                  <select name="groupDescription" required defaultValue={editingItem?.groupDescription || ""} className="w-full p-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option value="">-- Select Group --</option>
                    {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Ledger (from Accounts)</label>
                  <select name="ledger" required defaultValue={editingItem?.ledger || ""} className="w-full p-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option value="">-- Select Ledger --</option>
                    {accounts.map(a => <option key={a.code} value={a.name}>{a.name} ({a.code})</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Sl No. 1</label>
                    <input name="slNo1" type="number" required defaultValue={editingItem?.slNo1 || 0} className="w-full p-2 border border-slate-200 rounded text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase text-indigo-600">Sl No. (Priority)</label>
                    <input name="slNo" type="number" required defaultValue={editingItem?.slNo || 0} className="w-full p-2 border border-slate-200 rounded text-xs font-mono" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-md shadow-indigo-200 transition-all">
                  {editingItem ? "Update Mapping" : "Save Mapping"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}