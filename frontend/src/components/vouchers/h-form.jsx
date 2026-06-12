import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, Ship, AlertCircle, PlusCircle, Calculator, FileText } from "lucide-react";

export default function HFormMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Local state for the Invoice Grid inside the modal
  const [invoiceItems, setInvoiceItems] = useState([{ id: Date.now(), invNo: "", invDate: "", assessable: 0, kgs: 0, taxable: 0, tax: 0, nett: 0 }]);

  // 1. Debug Sync Logging
  useEffect(() => {
    console.group("🚢 HFormMaster: Component Sync");
    console.log("Current Database State:", database);
    // Matches the key provided by getMastersState in backend/database.js
    console.log("H-Forms Found:", database?.hForms?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.hForms || [];
  const accounts = database?.accounts || [];

  const handleDelete = (id) => {
    console.warn(`🗑️ Deleting H-Form ID: ${id}`);
    if (window.confirm("Confirm deletion of this H-Form record?")) {
      onDelete(id);
    }
  };

  const handleAddInvoiceRow = () => {
    setInvoiceItems([...invoiceItems, { id: Date.now(), invNo: "", invDate: "", assessable: 0, kgs: 0, taxable: 0, tax: 0, nett: 0 }]);
  };

  const updateInvoiceRow = (id, field, value) => {
    setInvoiceItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (parseFloat(item.nett) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 H-Form Save Operation Started");
    
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      const payload = {
        id: editingItem?.id || `HF-${Date.now()}`,
        fromDate: data.fromDate,
        toDate: data.toDate,
        buyerName: data.buyerName,
        hFormNo: data.hFormNo,
        receivedDate: data.receivedDate,
        blNo: data.blNo,
        totalAmount: calculateTotal(),
        remarks: data.remarks,
        invoices: invoiceItems 
      };

      console.log("Prepared Payload:", payload);
      await onSave(payload);
      
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Save failed:", err.message);
    }
    console.groupEnd();
  };

  const filteredData = dataList.filter(item => 
    (item.buyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.hFormNo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-rose-100 p-2 rounded-lg">
            <Ship className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">H Form Register</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Exempt Export Sales Documentation</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" placeholder="Search Buyer or H No..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
          <button 
            onClick={() => { setEditingItem(null); setInvoiceItems([{ id: Date.now() }]); setIsModalOpen(true); }}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add H Form
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4">Buyer / Merchant Exporter</th>
                <th className="p-4">H-Form No</th>
                <th className="p-4">Period / BL No</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{item.buyerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tight">{item.remarks || 'No remarks'}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-rose-600 bg-rose-50/30 uppercase">{item.hFormNo}</td>
                  <td className="p-4">
                    <div className="text-slate-500 font-mono text-[10px]">
                      {item.fromDate} <span className="mx-1">→</span> {item.toDate}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">BL: {item.blNo || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-700">
                    {parseFloat(item.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setEditingItem(item); setInvoiceItems(item.invoices || []); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic">No H-Form records found. Use "Add H Form" to record an export tax certificate.</div>
          )}
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 border-b bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                {editingItem ? "Edit H-Form Entry" : "New H-Form Entry"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              <form id="hform-form" onSubmit={handleSubmit}>
                {/* Header Section */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">From Date</label>
                      <input name="fromDate" type="date" required defaultValue={editingItem?.fromDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
                      <input name="toDate" type="date" required defaultValue={editingItem?.toDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Buyer's Name</label>
                      <select name="buyerName" required defaultValue={editingItem?.buyerName || ""} className="w-full p-2 border rounded text-xs font-bold">
                        <option value="">-- Select Account --</option>
                        {accounts.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">H-FORM No.</label>
                      <input name="hFormNo" required defaultValue={editingItem?.hFormNo || ""} className="w-full p-2 border rounded text-xs font-mono font-bold text-rose-600 uppercase" placeholder="HF-000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Received Date</label>
                      <input name="receivedDate" type="date" defaultValue={editingItem?.receivedDate || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">BL No. (Bill of Lading)</label>
                      <input name="blNo" defaultValue={editingItem?.blNo || ""} className="w-full p-2 border rounded text-xs font-mono" placeholder="SHIP-000" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">General Remarks</label>
                      <input name="remarks" defaultValue={editingItem?.remarks || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                  </div>
                </div>

                {/* Grid Section */}
                <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Calculator className="w-3.5 h-3.5" /> Linked Export Invoice Details
                    </span>
                    <button type="button" onClick={handleAddInvoiceRow} className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1">
                      <PlusCircle className="w-3.5 h-3.5" /> Add Invoice
                    </button>
                  </div>
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-tighter">
                      <tr>
                        <th className="p-2 w-8">#</th>
                        <th className="p-2 w-32">Inv. No.</th>
                        <th className="p-2 w-32">Inv. Date</th>
                        <th className="p-2 text-right">Assessable</th>
                        <th className="p-2 text-right">Kgs</th>
                        <th className="p-2 text-right">Taxable</th>
                        <th className="p-2 text-right">Tax</th>
                        <th className="p-2 text-right bg-rose-50/50">Nett Amount</th>
                        <th className="p-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoiceItems.map((it, idx) => (
                        <tr key={it.id} className="group">
                          <td className="p-2 text-slate-400 text-center font-mono">{idx + 1}</td>
                          <td className="p-1"><input value={it.invNo} onChange={e => updateInvoiceRow(it.id, 'invNo', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-xs font-bold" /></td>
                          <td className="p-1"><input type="date" value={it.invDate} onChange={e => updateInvoiceRow(it.id, 'invDate', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-xs font-mono" /></td>
                          <td className="p-1"><input type="number" value={it.assessable} onChange={e => updateInvoiceRow(it.id, 'assessable', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono" /></td>
                          <td className="p-1"><input type="number" value={it.kgs} onChange={e => updateInvoiceRow(it.id, 'kgs', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono" /></td>
                          <td className="p-1"><input type="number" value={it.taxable} onChange={e => updateInvoiceRow(it.id, 'taxable', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono" /></td>
                          <td className="p-1"><input type="number" value={it.tax} onChange={e => updateInvoiceRow(it.id, 'tax', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono" /></td>
                          <td className="p-1 bg-rose-50/20"><input type="number" value={it.nett} onChange={e => updateInvoiceRow(it.id, 'nett', e.target.value)} className="w-full p-1.5 border border-transparent group-hover:border-slate-200 rounded text-right font-mono font-bold text-rose-700" /></td>
                          <td className="p-1">
                            <button type="button" onClick={() => setInvoiceItems(invoiceItems.filter(x => x.id !== it.id))} className="text-slate-300 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-slate-50 flex justify-end">
                    <div className="text-right">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Total H-Form Value</div>
                      <div className="text-xl font-mono font-black text-slate-800">₹ {calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button type="button" className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2 mr-auto border border-slate-200">
                <FileText className="w-4 h-4" /> Export Register
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
              <button type="submit" form="hform-form" className="px-8 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold shadow-lg shadow-rose-100 transition-all">
                Save H-Form Register
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}