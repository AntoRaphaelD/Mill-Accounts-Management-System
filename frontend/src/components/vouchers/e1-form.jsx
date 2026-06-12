import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, FileText, AlertCircle, Link2 } from "lucide-react";

export default function E1FormMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Local state for filtered C-Forms based on selected Buyer
  const [selectedBuyer, setSelectedBuyer] = useState("");

  // 1. Debug Sync Logging
  useEffect(() => {
    console.group("📑 E1FormMaster: Component Sync");
    console.log("Current Database State:", database);
    console.log("E1 Forms Found:", database?.e1Forms?.length || 0);
    console.log("C-Forms Available for Linking:", database?.cForms?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.e1Forms || [];
  const accounts = database?.accounts || [];
  const cForms = database?.cForms || [];

  // Filter C-Forms that belong to the currently selected buyer in the modal
  const availableCForms = cForms.filter(cf => cf.buyerName === selectedBuyer);

  const handleDelete = (id) => {
    console.warn(`🗑️ Deleting E1-Form ID: ${id}`);
    if (window.confirm("Delete this E1-Form record?")) {
      onDelete(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 E1-Form Save Operation Started");
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      const payload = {
        id: editingItem?.id || `E1-${Date.now()}`,
        fromDate: data.fromDate,
        toDate: data.toDate,
        issuedDate: data.issuedDate,
        entryDate: data.entryDate,
        buyerName: data.buyerName,
        linkedCFormNo: data.linkedCFormNo,
        cFormAmount: parseFloat(data.cFormAmount) || 0,
        e1FormNo: data.e1FormNo,
        agentName: data.agentName,
        tinNo: data.tinNo,
        remarks: data.remarks
      };

      console.log("Payload Prepared:", payload);
      await onSave(payload);
      
      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedBuyer("");
    } catch (err) {
      console.error("❌ Save failed:", err.message);
    }
    console.groupEnd();
  };

  const filteredData = dataList.filter(item => 
    (item.buyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.e1FormNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">E1 Form Register</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Statutory Interstate Purchase Forms</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" placeholder="Search Buyer or E1 No..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button 
            onClick={() => { setEditingItem(null); setSelectedBuyer(""); setIsModalOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add E1 Form
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4">Buyer / Agency</th>
                <th className="p-4">E1 Form No</th>
                <th className="p-4">Linked C-Form</th>
                <th className="p-4 text-right">Form Amount</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{item.buyerName}</div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold italic">{item.agentName || 'Direct'}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-indigo-600 bg-indigo-50/30 uppercase">{item.e1FormNo}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Link2 className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-[10px]">{item.linkedCFormNo || 'Unlinked'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-700">
                    {parseFloat(item.cFormAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setEditingItem(item); setSelectedBuyer(item.buyerName); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic">No E1-Form records registered.</div>
          )}
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 border-b bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                {editingItem ? "Edit E1 Form Entry" : "New E1 Form Registration"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
              <form id="e1-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Period Section */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">From Date</label>
                      <input name="fromDate" type="date" required defaultValue={editingItem?.fromDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
                      <input name="toDate" type="date" required defaultValue={editingItem?.toDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase text-indigo-600">Issued Date</label>
                      <input name="issuedDate" type="date" required defaultValue={editingItem?.issuedDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                </div>

                {/* Buyer & Linked C-Form Section */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Buyer Name</label>
                      <select 
                        name="buyerName" 
                        required 
                        value={selectedBuyer}
                        onChange={(e) => setSelectedBuyer(e.target.value)} 
                        className="w-full p-2 border rounded text-xs font-bold"
                      >
                        <option value="">-- Select Buyer --</option>
                        {accounts.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Linked C-Form No.</label>
                      <select name="linkedCFormNo" required defaultValue={editingItem?.linkedCFormNo || ""} className="w-full p-2 border rounded text-xs font-mono text-blue-600 bg-blue-50/20">
                        <option value="">-- Select Form --</option>
                        {availableCForms.map(cf => <option key={cf.id} value={cf.cFormNo}>{cf.cFormNo}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">C-Form Amount</label>
                      <input name="cFormAmount" type="number" step="any" defaultValue={editingItem?.cFormAmount || 0} className="w-full p-2 border rounded text-xs font-mono font-bold" />
                    </div>
                </div>

                {/* E1 Details Section */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase text-indigo-600 font-black">E1 FORM No.</label>
                      <input name="e1FormNo" required defaultValue={editingItem?.e1FormNo || ""} className="w-full p-2 border border-indigo-200 rounded text-xs font-mono font-bold uppercase" placeholder="E1-0000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Agent's Name</label>
                      <input name="agentName" defaultValue={editingItem?.agentName || ""} className="w-full p-2 border rounded text-xs" placeholder="e.g. South Agency" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Tin No.</label>
                      <input name="tinNo" defaultValue={editingItem?.tinNo || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                </div>

                <div className="md:col-span-3 space-y-1 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">General Remarks</label>
                  <input name="remarks" defaultValue={editingItem?.remarks || ""} className="w-full p-2 border rounded text-xs" placeholder="Enter any internal notes or issuance memo..." />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button type="button" className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2 mr-auto border border-slate-200">
                <FileText className="w-4 h-4" /> Issue Report
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
              <button type="submit" form="e1-form" className="px-10 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-lg shadow-indigo-100 transition-all">
                {editingItem ? "Update Register" : "Save E1 Form"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}