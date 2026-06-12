import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, ShoppingCart, AlertCircle, PlusCircle, Calculator } from "lucide-react";

export default function CFormPurchase({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Local state for the Bill Grid
  const [billItems, setBillItems] = useState([{ id: Date.now(), billNo: "", billDate: "", bales: 0, kgs: 0, value: 0 }]);

  // 1. Debug Sync Logging
  useEffect(() => {
    console.group("🛒 CFormPurchase: Component Sync");
    console.log("Current Database State:", database);
    // Matching the expected key in database.js
    console.log("C-Form Purchase Records:", database?.cFormPurchases?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.cFormPurchases || [];
  const accounts = database?.accounts || [];

  const handleDelete = (id) => {
    console.warn(`🗑️ Deleting Purchase C-Form: ${id}`);
    if (window.confirm("Delete this C-Form Purchase record?")) {
      onDelete(id);
    }
  };

  const handleAddBillRow = () => {
    setBillItems([...billItems, { id: Date.now(), billNo: "", billDate: "", bales: 0, kgs: 0, value: 0 }]);
  };

  const updateBillRow = (id, field, value) => {
    setBillItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 C-Form Purchase Save Operation");
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      const payload = {
        id: editingItem?.id || `CFP-${Date.now()}`,
        fromDate: data.fromDate,
        toDate: data.toDate,
        sellerName: data.sellerName,
        cFormNo: data.cFormNo,
        issuedDate: data.issuedDate,
        totalAmount: calculateTotal(),
        remarks: data.remarks,
        bills: billItems 
      };

      console.log("Payload:", payload);
      await onSave(payload);
      
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Save failed:", err.message);
    }
    console.groupEnd();
  };

  const filteredData = dataList.filter(item => 
    (item.sellerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.cFormNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">C Form Purchase Register</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Interstate Purchase Tax Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" placeholder="Search Seller or Form No..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button 
            onClick={() => { setEditingItem(null); setBillItems([{ id: Date.now() }]); setIsModalOpen(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Purchase C Form
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4">Seller Details</th>
                <th className="p-4">C-Form No</th>
                <th className="p-4">Period</th>
                <th className="p-4 text-right">Total Purchase Value</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{item.sellerName}</div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Issued: {item.issuedDate || '-'}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-600 bg-emerald-50/30">{item.cFormNo}</td>
                  <td className="p-4 text-slate-500 font-mono text-[10px]">
                    {item.fromDate} <span className="mx-1">→</span> {item.toDate}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-700">
                    {parseFloat(item.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setEditingItem(item); setBillItems(item.bills || []); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic">No Purchase C-Form records found.</div>
          )}
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 border-b bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                {editingItem ? "Edit Purchase C-Form" : "New Purchase C-Form Entry"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              <form id="cfp-form" onSubmit={handleSubmit}>
                <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">From Date</label>
                      <input name="fromDate" type="date" required defaultValue={editingItem?.fromDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
                      <input name="toDate" type="date" required defaultValue={editingItem?.toDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Seller Name</label>
                      <select name="sellerName" required defaultValue={editingItem?.sellerName || ""} className="w-full p-2 border rounded text-xs font-bold">
                        <option value="">-- Select Seller Account --</option>
                        {accounts.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">C-FORM No.</label>
                      <input name="cFormNo" required defaultValue={editingItem?.cFormNo || ""} className="w-full p-2 border rounded text-xs font-mono font-bold text-emerald-600 uppercase" placeholder="P-CF-000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Issued Date</label>
                      <input name="issuedDate" type="date" defaultValue={editingItem?.issuedDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Remarks</label>
                      <input name="remarks" defaultValue={editingItem?.remarks || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                </div>

                <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <ShoppingCart className="w-3.5 h-3.5" /> Purchase Bill Details
                    </span>
                    <button type="button" onClick={handleAddBillRow} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <PlusCircle className="w-3.5 h-3.5" /> Add Bill Row
                    </button>
                  </div>
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-tighter">
                      <tr>
                        <th className="p-2 w-8">#</th>
                        <th className="p-2">Bill No.</th>
                        <th className="p-2">Bill Date</th>
                        <th className="p-2 text-right">Bales</th>
                        <th className="p-2 text-right">Kgs</th>
                        <th className="p-2 text-right bg-emerald-50/50">Inv. Value</th>
                        <th className="p-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {billItems.map((it, idx) => (
                        <tr key={it.id} className="group">
                          <td className="p-2 text-slate-400 text-center font-mono">{idx + 1}</td>
                          <td className="p-1"><input value={it.billNo} onChange={e => updateBillRow(it.id, 'billNo', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-xs font-bold" /></td>
                          <td className="p-1"><input type="date" value={it.billDate} onChange={e => updateBillRow(it.id, 'billDate', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-xs font-mono" /></td>
                          <td className="p-1"><input type="number" value={it.bales} onChange={e => updateBillRow(it.id, 'bales', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono" /></td>
                          <td className="p-1"><input type="number" value={it.kgs} onChange={e => updateBillRow(it.id, 'kgs', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono" /></td>
                          <td className="p-1 bg-emerald-50/20"><input type="number" value={it.value} onChange={e => updateBillRow(it.id, 'value', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono font-bold text-emerald-700" /></td>
                          <td className="p-1">
                            <button type="button" onClick={() => setBillItems(billItems.filter(x => x.id !== it.id))} className="text-slate-300 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-slate-50 flex justify-end">
                    <div className="text-right">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Consolidated Value</div>
                      <div className="text-xl font-mono font-black text-slate-800">₹ {calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>
              <button type="submit" form="cfp-form" className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-lg shadow-emerald-100 transition-all">
                Save Purchase Record
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}