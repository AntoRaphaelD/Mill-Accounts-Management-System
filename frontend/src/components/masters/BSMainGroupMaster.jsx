import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Layers, AlertCircle } from "lucide-react";

export default function BSMainGroupMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Log component mount and incoming props
  useEffect(() => {
    console.group("🏛️ BSMainGroupMaster: Component Sync");
    console.log("Current Database State:", database);
    console.log("BS Main Groups Found:", database?.bsMainGroups?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.bsMainGroups || [];

  const handleDelete = (code) => {
    console.warn(`🗑️ Attempting to delete BS Main Group Code: ${code}`);
    if (window.confirm(`Are you sure you want to delete Main Group: ${code}?`)) {
      onDelete(code);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 BS Main Group Save Operation Started");
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      console.log("1. Raw Form Data:", data);

      const payload = {
        code: editingItem?.code || (data.code || "").toUpperCase(),
        mainGroup: data.mainGroup,
        under: data.under
      };

      console.log("2. Prepared Payload for Backend:", payload);

      if (!payload.code || !payload.mainGroup) {
        throw new Error("Code and Main Group Name are required.");
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
    (item.mainGroup || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full">
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
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">BS Main Groups</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Balance Sheet Primary Classifications</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search main groups..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button 
            onClick={() => { 
                console.log("➕ Opening BS Main Group Modal");
                setEditingItem(null); 
                setIsModalOpen(true); 
            }} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Main Group
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4 w-32">Code</th>
                <th className="p-4">Main Group Name</th>
                <th className="p-4">Under (Parent)</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.code} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-mono text-indigo-600 font-bold uppercase">{item.code}</td>
                  <td className="p-4 font-bold text-slate-800">{item.mainGroup}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                      item.under === 'Assets' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      item.under === 'Liabilities' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {item.under}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { 
                            console.log("📝 Editing Group:", item);
                            setEditingItem(item); 
                            setIsModalOpen(true); 
                        }} 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.code)} 
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
                  <td colSpan="4" className="p-12 text-center text-slate-400 italic font-medium">
                    {dataList.length === 0 ? "No BS Main Groups found. Define your top-level structure." : "No matching results."}
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
                {editingItem ? "Edit BS Main Group" : "New BS Main Group"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Group Code</label>
                  <input 
                    name="code" 
                    required 
                    disabled={!!editingItem} 
                    defaultValue={editingItem?.code || ""} 
                    placeholder="e.g. BS001"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Main Group Name</label>
                  <input 
                    name="mainGroup" 
                    required 
                    defaultValue={editingItem?.mainGroup || ""} 
                    placeholder="e.g. Fixed Assets"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-md text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Under (Parent Classification)</label>
                  <select 
                    name="under" 
                    required 
                    defaultValue={editingItem?.under || ""} 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Select Parent --</option>
                    <option value="Assets">Assets</option>
                    <option value="Liabilities">Liabilities</option>
                    <option value="Incomes">Incomes</option>
                    <option value="Expenses">Expenses</option>
                    <option value="UNSECURED LOANS">UNSECURED LOANS</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-md shadow-indigo-200 transition-all">
                  {editingItem ? "Update Group" : "Save Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}