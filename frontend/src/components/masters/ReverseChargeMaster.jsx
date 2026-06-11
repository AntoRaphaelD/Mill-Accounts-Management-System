import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, ShieldAlert, AlertCircle, Info } from "lucide-react";

export default function ReverseChargeMaster({ database, onSave, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Debug Sync Logging
  useEffect(() => {
    console.group("🛡️ ReverseChargeMaster: Component Sync");
    console.log("Current Database State:", database);
    console.log("RCM Rules Found:", database?.reverseTypes?.length || 0);
    console.groupEnd();
  }, [database]);

  const dataList = database?.reverseTypes || [];
  const accountsList = database?.accounts || [];

  const handleDelete = (code) => {
    console.warn(`🗑️ Deleting RCM Rule: ${code}`);
    if (window.confirm(`Delete Reverse Charge Configuration: ${code}?`)) {
      onDelete(code);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("💾 RCM Rule Save Operation Started");
    try {
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      console.log("1. Raw Form Data:", data);

      const payload = {
        ...data,
        code: editingItem?.code || (data.code || "").toUpperCase(),
      };

      console.log("2. Prepared Payload:", payload);
      
      await onSave(payload);
      
      console.log("✅ Save successful.");
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("❌ Save failed:", err);
    }
    console.groupEnd();
  };

  const filteredData = dataList.filter(item => 
    (item.purchaseType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] h-full overflow-hidden">
      
      {/* Sync Warning */}
      {!database && (
        <div className="bg-amber-50 border-b border-amber-200 p-2 flex items-center gap-2 text-amber-700 text-xs font-bold justify-center">
          <AlertCircle className="w-4 h-4" /> Warning: database state is missing.
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">RCM Master</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Reverse Charge Purchase Configurations</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search RCM rules..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full md:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
            />
          </div>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add RCM Rule
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
                <th className="p-4">Purchase Type Description</th>
                <th className="p-4">Primary Assess Formula</th>
                <th className="p-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredData.map(item => (
                <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-indigo-600 font-bold">{item.code}</td>
                  <td className="p-4 font-bold text-slate-800">{item.purchaseType}</td>
                  <td className="p-4 font-mono text-slate-500 text-[10px] bg-slate-50/30 italic">
                    {item.assessValueFormula || "No formula defined"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }} 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.code)} 
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-400 italic">
                    No Reverse Charge rules found matching your search.
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
          <div className="bg-white rounded-xl shadow-2xl border w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 border-b bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                  {editingItem ? "Edit RCM Rule" : "Create New RCM Rule"}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">Configure dynamic RCM tax calculations and ledger mapping.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row p-6 gap-6 bg-slate-50">
              
              {/* Left Side: Form Fields */}
              <form id="rcm-form" onSubmit={handleSubmit} className="flex-1 space-y-4">
                
                {/* Basic Info */}
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Rule Code</label>
                    <input name="code" required disabled={!!editingItem} defaultValue={editingItem?.code || ""} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold disabled:opacity-50" placeholder="RCM001" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Purchase Type Name</label>
                    <input name="purchaseType" required defaultValue={editingItem?.purchaseType || ""} className="w-full p-2.5 border border-slate-200 rounded-md text-xs font-bold" placeholder="e.g. Cotton Waste" />
                  </div>
                </div>

                {/* Formulas Alignment Grid */}
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Calculation Formulas
                  </h4>
                  
                  {/* Shared Row Helper */}
                  {[
                    { label: "Assess. Value", fName: "assessValueFormula", dName: "assessValueDesc" },
                    { label: "Lorry Freight", fName: "lorryFreightFormula", dName: "lorryFreightDesc" },
                    { label: "Round Off", fName: "roundOffFormula", dName: "roundOffDesc" },
                  ].map(row => (
                    <div key={row.fName} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-2 text-[10px] font-bold text-slate-600 uppercase">{row.label}</div>
                      <div className="col-span-4">
                        <input name={row.fName} defaultValue={editingItem?.[row.fName] || ""} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-indigo-600" placeholder="[Formula]" />
                      </div>
                      <div className="col-span-6">
                        <input name={row.dName} defaultValue={editingItem?.[row.dName] || ""} className="w-full p-2 border border-slate-200 rounded text-xs" placeholder="Ledger Description Prefix" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Output Tax Mapping */}
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm space-y-4">
                  <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest border-b pb-2">Output Liability Mapping</h4>
                  {["sgst", "cgst", "igst"].map(tax => (
                    <div key={`out_${tax}`} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-2 text-[10px] font-bold text-slate-600 uppercase">{tax} Tax</div>
                      <div className="col-span-4">
                        <input name={`${tax}Formula`} defaultValue={editingItem?.[`${tax}Formula`] || ""} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-indigo-600" placeholder="[Formula]" />
                      </div>
                      <div className="col-span-6">
                        <select name={`${tax}Ledger`} defaultValue={editingItem?.[`${tax}Ledger`] || ""} className="w-full p-2 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-indigo-500/20">
                          <option value="">-- Select Output Ledger --</option>
                          {accountsList.map(a => <option key={`out_${tax}_${a.code}`} value={a.name}>{a.name} ({a.code})</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Tax Mapping */}
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm space-y-4">
                  <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest border-b pb-2">Input Credit (ITC) Mapping</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {["creditSgstLedger", "creditCgstLedger", "creditIgstLedger"].map(field => (
                      <div key={field} className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">{field.replace('credit', '').replace('Ledger', '')} Credit Ledger</label>
                        <select name={field} defaultValue={editingItem?.[field] || ""} className="w-full p-2 border border-slate-200 rounded text-[11px] focus:ring-2 focus:ring-emerald-500/20">
                          <option value="">-- Select --</option>
                          {accountsList.map(a => <option key={`in_${field}_${a.code}`} value={a.name}>{a.name}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

              </form>

              {/* Right Side: Legend Panel */}
              <div className="w-full lg:w-64 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 p-5 shrink-0 flex flex-col shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-widest">Formula Legend</h4>
                </div>
                <div className="flex-1 space-y-4">
                   <p className="text-[10px] text-slate-500 italic leading-relaxed">Use square brackets to reference live values from the RCM entry screen:</p>
                   <ul className="space-y-2.5 font-mono text-[10px] leading-tight">
                     <li className="flex justify-between border-b border-slate-800/50 pb-1">
                       <span className="text-indigo-400">[TotalAmount]</span>
                       <span className="text-slate-500">Qty x Rate</span>
                     </li>
                     <li className="flex justify-between border-b border-slate-800/50 pb-1">
                       <span className="text-indigo-400">[DiscountAmount]</span>
                       <span className="text-slate-500">Fixed/Pct</span>
                     </li>
                     <li className="flex justify-between border-b border-slate-800/50 pb-1">
                       <span className="text-amber-400">[SGST]</span>
                       <span className="text-slate-500">Output tax</span>
                     </li>
                     <li className="flex justify-between border-b border-slate-800/50 pb-1">
                       <span className="text-amber-400">[CGST]</span>
                       <span className="text-slate-500">Output tax</span>
                     </li>
                     <li className="flex justify-between border-b border-slate-800/50 pb-1">
                       <span className="text-emerald-400">[LorryFreight]</span>
                       <span className="text-slate-500">Charges</span>
                     </li>
                     <li className="flex justify-between">
                       <span className="text-indigo-400">[GrandTotal]</span>
                       <span className="text-slate-500">Net Payable</span>
                     </li>
                   </ul>
                </div>
                <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <p className="text-[9px] text-slate-400 italic">
                    Example: <br/>
                    <code className="text-indigo-300 font-mono">[TotalAmount]*0.05</code> <br/>
                    Calculates 5% tax on gross.
                  </p>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
              <button 
                type="submit" 
                form="rcm-form" 
                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-md shadow-indigo-100 transition-all"
              >
                {editingItem ? "Update Configuration" : "Save RCM Rule"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Helper icon
function Layers(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}