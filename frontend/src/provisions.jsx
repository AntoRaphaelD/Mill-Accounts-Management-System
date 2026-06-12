import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, FileText, Check, AlertCircle } from "lucide-react";

export default function Provisions({ database, onSaveVoucher, onDeleteVoucher }) {
  const [vouchersList, setVouchersList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [voucherId, setVoucherId] = useState("");
  const [provisionNo, setProvisionNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  
  const [items, setItems] = useState([
    { id: "L1", accountCode: "", accountName: "", debit: 0, credit: 0 }
  ]);

  // Load and filter provisions
  useEffect(() => {
    const list = (database.vouchers || []).filter(v => v.type === "PROVISION");
    setVouchersList(list);
  }, [database]);

  const loadVoucher = (v) => {
    setVoucherId(v.id);
    setProvisionNo(v.voucherNo);
    setDate(v.voucherDate);
    setReference(v.reference || "");
    setNarration(v.narration || "");
    
    if (v.items && v.items.length > 0) {
      setItems(v.items.map(it => ({
        id: it.id,
        accountCode: it.accountCode,
        accountName: it.accountName,
        debit: parseFloat(it.debit) || 0,
        credit: parseFloat(it.credit) || 0
      })));
    } else {
      setItems([{ id: "L1", accountCode: "", accountName: "", debit: 0, credit: 0 }]);
    }
    setIsModalOpen(true);
  };

  const clearForm = () => {
    setVoucherId("");
    const maxNo = vouchersList.reduce((max, current) => {
      const parsed = parseInt(current.voucherNo);
      return isNaN(parsed) ? max : Math.max(max, parsed);
    }, 0);
    setProvisionNo(String(maxNo + 1));
    setDate(new Date().toISOString().split('T')[0]);
    setReference("");
    setNarration("");
    setItems([{ id: "L1", accountCode: "", accountName: "", debit: 0, credit: 0 }]);
  };

  const openNewVoucher = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const addLine = () => {
    setItems([...items, { id: "LINE_" + Date.now(), accountCode: "", accountName: "", debit: 0, credit: 0 }]);
  };

  const removeLine = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(it => it.id !== id));
  };

  const updateLine = (id, field, value) => {
    setItems(items.map(it => {
      if (it.id !== id) return it;
      const updated = { ...it, [field]: value };
      
      // Auto-sync AccCode and AccName
      if (field === "accountCode") {
        const acc = database.accounts.find(a => a.code === value);
        if (acc) updated.accountName = acc.name;
      } else if (field === "accountName") {
        const acc = database.accounts.find(a => a.name === value);
        if (acc) updated.accountCode = acc.code;
      }
      return updated;
    }));
  };

  const totalDebit = items.reduce((sum, it) => sum + (parseFloat(it.debit) || 0), 0);
  const totalCredit = items.reduce((sum, it) => sum + (parseFloat(it.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleSave = () => {
    if (!provisionNo) return alert("Please specify a Provision Number.");
    if (!isBalanced) return alert("Total Debit must equal Total Credit.");
    
    const validLines = items.filter(it => (it.accountCode || it.accountName) && (it.debit > 0 || it.credit > 0));
    if (validLines.length === 0) return alert("Please enter at least one valid line item.");

    const payload = {
      id: voucherId || undefined,
      voucherNo: provisionNo,
      voucherDate: date,
      type: "PROVISION",
      reference,
      narration,
      items: validLines,
      totalAmount: totalDebit
    };

    onSaveVoucher(payload);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      
      {/* Header Panel */}
      <div className="p-6 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">Provisions Register</h3>
          <p className="text-[10px] text-[#64748B] mt-1">Manage outstanding expenses, salary, and audit fee provisions.</p>
        </div>
        <button onClick={openNewVoucher} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> Add Provision
        </button>
      </div>

      {/* Provisions History Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-[#E2E8F0]">
              <tr className="text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3 w-32">Provision No</th>
                <th className="p-3 w-32">Date</th>
                <th className="p-3">Reference / Description</th>
                <th className="p-3 text-right w-32">Amount</th>
                <th className="p-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {vouchersList.map((v, idx) => (
                <tr key={v.id} onClick={() => loadVoucher(v)} className={`cursor-pointer hover:bg-indigo-50 ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                  <td className="p-3 font-mono font-bold text-indigo-600">{v.voucherNo}</td>
                  <td className="p-3 font-mono text-slate-600">{v.voucherDate}</td>
                  <td className="p-3 text-slate-800 font-semibold">{v.reference || v.narration || "Provision Entry"}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-700">{(v.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); loadVoucher(v); }} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteVoucher(v.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {vouchersList.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">No Provision records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Forms */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-lg shadow-xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center rounded-t-lg">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{voucherId ? "Edit Provision" : "New Provision Entry"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Header Fields (Provision No, Date) */}
              <div className="grid grid-cols-2 gap-8 font-semibold text-xs">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase text-slate-500 mb-1">Provision No.</label>
                  <input type="text" value={provisionNo} onChange={e => setProvisionNo(e.target.value)} className="p-2 border rounded font-mono bg-slate-50 w-48 outline-none focus:border-indigo-500" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-48">
                    <label className="text-[10px] uppercase text-slate-500 mb-1 block">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded font-mono outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Provision Details Grid */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-xs text-left bg-white border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-2 w-32 border-r">AccCode</th>
                      <th className="p-2 border-r">Acc. Description</th>
                      <th className="p-2 text-right w-32 border-r">Credit</th>
                      <th className="p-2 text-right w-32">Debit</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it, idx) => (
                      <tr key={it.id} className="hover:bg-slate-50">
                        <td className="p-1 border-r"><input type="text" value={it.accountCode} onChange={e => updateLine(it.id, "accountCode", e.target.value)} className="w-full p-1.5 border border-transparent hover:border-slate-200 rounded font-mono outline-none focus:border-indigo-500 bg-transparent" placeholder="Code..." /></td>
                        <td className="p-1 border-r">
                          <select value={it.accountName} onChange={e => updateLine(it.id, "accountName", e.target.value)} className="w-full p-1.5 border border-transparent hover:border-slate-200 rounded outline-none focus:border-indigo-500 bg-transparent">
                            <option value="">-- Select Ledger --</option>
                            {database.accounts.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                          </select>
                        </td>
                        <td className="p-1 border-r"><input type="number" step="any" value={it.credit || ""} onChange={e => { updateLine(it.id, "credit", e.target.value); updateLine(it.id, "debit", 0); }} className="w-full p-1.5 border border-transparent hover:border-slate-200 rounded font-mono text-right outline-none focus:border-indigo-500 bg-transparent text-orange-600 font-bold" /></td>
                        <td className="p-1"><input type="number" step="any" value={it.debit || ""} onChange={e => { updateLine(it.id, "debit", e.target.value); updateLine(it.id, "credit", 0); }} className="w-full p-1.5 border border-transparent hover:border-slate-200 rounded font-mono text-right outline-none focus:border-indigo-500 bg-transparent text-emerald-600 font-bold" /></td>
                        <td className="p-1 text-center"><button onClick={() => removeLine(it.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-slate-50 p-1.5 border-t border-slate-200 flex items-center justify-between">
                  <button onClick={addLine} className="text-[11px] text-indigo-600 font-bold hover:underline ml-2">+ Add Row</button>
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-start text-xs font-semibold">
                <input type="text" value={reference} onChange={e => setReference(e.target.value)} placeholder="Description / Reference" className="w-64 p-2 border border-slate-200 rounded outline-none focus:border-indigo-500" />
                <div className="flex items-center gap-4">
                  <span className="uppercase text-[10px] text-slate-500">Total</span>
                  <input type="number" value={totalCredit} readOnly className="w-32 p-2 border border-slate-200 bg-slate-50 rounded font-mono text-right font-bold text-orange-600" />
                  <input type="number" value={totalDebit} readOnly className="w-32 p-2 border border-slate-200 bg-slate-50 rounded font-mono text-right font-bold text-emerald-600" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Narration</label>
                <textarea value={narration} onChange={e => setNarration(e.target.value)} rows={2} className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:border-indigo-500" placeholder="Salary provision for April 2026..."></textarea>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-lg">
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded text-xs font-bold shadow-sm transition-colors">Save</button>
              <button onClick={() => setIsModalOpen(false)} className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded text-xs font-bold transition-colors hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}