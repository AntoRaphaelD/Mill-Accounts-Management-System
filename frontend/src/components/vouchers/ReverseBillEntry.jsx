import React, { useState, useEffect } from "react";
import { Plus, Trash, Printer, Edit2, X } from "lucide-react";

export default function ReverseBillEntry({ database, onSaveReverseBill, onDeleteReverseBill, onPrint }) {
  const [billsList, setBillsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States
  const [billId, setBillId] = useState("");
  const [partyName, setPartyName] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [accDate, setAccDate] = useState("2026-04-17");
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("2026-04-17");
  const [purchaseType, setPurchaseType] = useState("");
  
  const [narration, setNarration] = useState("");
  const [tdsEnabled, setTdsEnabled] = useState(false);
  const [gstWithFF, setGstWithFF] = useState(false);

  // Totals configuration
  const [discount, setDiscount] = useState(0);
  const [pandf, setPandf] = useState(0);
  const [roundOff, setRoundOff] = useState(0);

  const [items, setItems] = useState([
    { itemName: "", hsnCode: "", qty: 1, perQty: "NOS", unitRate: 0, totalAmount: 0 }
  ]);

  useEffect(() => {
    setBillsList(database.reverseBills || []);
  }, [database]);

  // Validate that default selected party exists in the dynamic database, or auto-assign to the first one once loaded
  useEffect(() => {
    if (database.accounts && database.accounts.length > 0) {
      const exists = database.accounts.some(a => a.name === partyName);
      if (!exists) {
        setPartyName(database.accounts[0].name);
      }
    }
  }, [database.accounts]);

  const loadBill = (b) => {
    setBillId(b.id);
    setPartyName(b.partyName);
    setVoucherNo(b.voucherNo);
    setAccDate(b.accDate);
    setBillNo(b.billNo || "");
    setBillDate(b.billDate || b.accDate);
    setPurchaseType(b.purchaseType);
    setNarration(b.narration || "");
    setTdsEnabled(!!b.tdsEnabled);
    setGstWithFF(!!b.gstWithFF);
    setDiscount(b.discount || 0);
    setPandf(b.pandf || 0);
    setRoundOff(b.roundOff || 0);
    setItems(b.items ? [...b.items] : []);
    setIsModalOpen(true);
  };

  const clearForm = () => {
    setBillId("");
    const maxNo = billsList.reduce((max, cur) => Math.max(max, parseInt(cur.voucherNo) || 0), 96);
    setVoucherNo(String(maxNo + 1));
    setAccDate("2026-04-17");
    setBillNo("");
    setBillDate("2026-04-17");
    setNarration("");
    setDiscount(0);
    setPandf(0);
    setRoundOff(0);
    setItems([
      { itemName: "", hsnCode: "", qty: 1, perQty: "NOS", unitRate: 0, totalAmount: 0 }
    ]);
  };

  const openNewBill = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const addItemRow = () => {
    setItems([...items, { itemName: "", hsnCode: "", qty: 1, perQty: "NOS", unitRate: 0, totalAmount: 0 }]);
  };

  const removeItemRow = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItemField = (idx, field, value) => {
    setItems(items.map((it, i) => {
      if (i !== idx) return it;
      const updated = { ...it, [field]: value };
      if (field === "qty" || field === "unitRate") {
        const q = field === "qty" ? parseFloat(value) || 0 : parseFloat(it.qty) || 0;
        const r = field === "unitRate" ? parseFloat(value) || 0 : parseFloat(it.unitRate) || 0;
        updated.totalAmount = q * r;
      }
      return updated;
    }));
  };

  // Automated Formula evaluator matching PDF page 16
  const baseSubtotal = items.reduce((s, b) => s + (parseFloat(b.totalAmount) || 0), 0);
  const taxableAmount = Math.max(0, baseSubtotal - discount);
  
  // RCM Tax values evaluation (reproducing 2.5% CGST/SGST of page 15, 16)
  const isSolar = purchaseType.includes("SOLAR") || purchaseType.includes("Solar");
  const cgstPercentage = isSolar ? 2.5 : 9; // Solar power panels are mapped lower tax
  const sgstPercentage = isSolar ? 2.5 : 9;

  const cgstAmount = gstWithFF ? (taxableAmount * cgstPercentage) / 100 : 0;
  const sgstAmount = gstWithFF ? (taxableAmount * sgstPercentage) / 100 : 0;
  const totalTax = cgstAmount + sgstAmount;
  const grandTotal = taxableAmount + totalTax + parseFloat(pandf) + parseFloat(roundOff);

  const handleSave = () => {
    if(!billNo) {
      alert("Specify a valid Bill/Invoice No");
      return;
    }
    const payload = {
      id: billId || undefined,
      partyName,
      voucherNo,
      accDate,
      billNo,
      billDate,
      purchaseType,
      billAmount: baseSubtotal,
      narration,
      tdsEnabled,
      total: baseSubtotal,
      discount,
      pandf,
      gst: totalTax,
      igst: 0,
      roundOff,
      grandTotal,
      gstWithFF,
      userName: database.currentUser,
      items
    };
    onSaveReverseBill(payload);
    alert(`Success: Saved RCM invoice ${billNo}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]" id="rb-viewport">
      <div className="p-6 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">Reverse Bill Register</h3>
          <p className="text-[10px] text-[#64748B] mt-1">Bills are listed in tabular form. Select a row to update its details.</p>
        </div>
        <button
          onClick={openNewBill}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Reverse Bill
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-3 w-28">Short Desc</th>
                <th className="p-3 w-28">Voucher No</th>
                <th className="p-3 w-32">Voucher Date</th>
                <th className="p-3">Account Name</th>
                <th className="p-3 text-right w-32">Debit</th>
                <th className="p-3 w-28">UserName</th>
                <th className="p-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {billsList.map((b, index) => (
                <tr
                  key={b.id}
                  onClick={() => loadBill(b)}
                  className={`cursor-pointer ${index % 2 === 1 ? "bg-yellow-50" : "bg-white"} hover:bg-blue-50`}
                >
                  <td className="p-3 font-semibold text-slate-700">RCM</td>
                  <td className="p-3 font-mono text-[#2563EB] font-bold">{b.voucherNo}</td>
                  <td className="p-3 font-mono text-slate-600">{b.accDate}</td>
                  <td className="p-3 font-semibold text-slate-800">{b.partyName || b.narration || "Reverse Bill"}</td>
                  <td className="p-3 text-right font-mono font-semibold text-slate-700">
                    {(b.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 font-bold text-slate-500">{b.userName || database.currentUser}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); loadBill(b); }} className="text-slate-500 hover:text-[#2563EB] cursor-pointer" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onPrint(b); }} className="text-slate-500 hover:text-slate-800 cursor-pointer" title="Print">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {billsList.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No RCM bills found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* LEFT: Detailed Entry Drawer */}
      <div className={isModalOpen ? "fixed inset-0 z-50 bg-[#0F172A]/60 overflow-y-auto p-4" : "hidden"} id="rb-form-left">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-lg px-5 py-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E293B]">{billId ? "Update Reverse Bill" : "Add Reverse Bill"}</h3>
              <p className="text-[10px] text-[#64748B] mt-1">Insert or update bill details, then save to return to the register.</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        
        {/* Header particulars mapping page 16 */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-[#1E293B]">
            
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Party Account Head</label>
              <select 
                value={partyName} 
                onChange={(e) => setPartyName(e.target.value)}
                className="p-2 border border-[#E2E8F0] rounded font-mono outline-none"
              >
                {database.accounts.map(a => (
                  <option key={a.code} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Voucher No</label>
              <input 
                type="text" 
                value={voucherNo} 
                onChange={(e) => setVoucherNo(e.target.value)}
                className="p-2 border border-[#E2E8F0] font-mono bg-[#F8FAFC] rounded outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Account Date</label>
              <input 
                type="date" 
                value={accDate} 
                onChange={(e) => setAccDate(e.target.value)}
                className="p-2 border border-[#E2E8F0] rounded font-mono outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Supplier Ref/Bill No</label>
              <input 
                type="text" 
                value={billNo} 
                onChange={(e) => setBillNo(e.target.value)}
                placeholder="e.g. SB/99-B"
                className="p-2 border border-[#E2E8F0] rounded outline-none"
              />
            </div>

            <div className="flex flex-col col-span-2">
              <label className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Purchase Type Form (Reverse Charge Mode)</label>
              <select 
                value={purchaseType} 
                onChange={(e) => setPurchaseType(e.target.value)}
                className="p-2 border border-[#E2E8F0] rounded outline-none"
              >
                <option value="SOLAR POWER ROOF TOP">SOLAR POWER ROOF TOP</option>
                <option value="COTTON PURCHASE GST 5%">COTTON PURCHASE GST 5%</option>
                <option value="FREIGHT SERVICES RCM">FREIGHT SERVICES RCM</option>
                <option value="SECURITY & MILL COURIERS">SECURITY & MILL COURIERS</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-[#64748B] mb-1">Bill Date</label>
              <input 
                type="date" 
                value={billDate} 
                onChange={(e) => setBillDate(e.target.value)}
                className="p-2 border border-[#E2E8F0] rounded font-mono outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={tdsEnabled} onChange={(e) => setTdsEnabled(e.target.checked)} className="rounded text-[#2563EB]" />
                <span className="text-[10px] font-bold">Apply TDS</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={gstWithFF} onChange={(e) => setGstWithFF(e.target.checked)} className="rounded text-[#2563EB]" />
                <span className="text-[10px] font-bold">Evaluate GST</span>
              </label>
            </div>

          </div>
        </div>

        {/* Dynamic Items billing grid */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Item/Materials Invoice Breakdown</h3>
            <button onClick={addItemRow} className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-[11px] px-3 py-1.5 rounded font-bold cursor-pointer">
              + Insert Item row
            </button>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-2 col-span-2">Item Name / Spares</th>
                <th className="p-2 text-center w-28">HSN Code</th>
                <th className="p-2 text-center w-20">Qty</th>
                <th className="p-2 text-center w-20">Unit</th>
                <th className="p-2 text-right w-32">Rate (Rs)</th>
                <th className="p-2 text-right w-32">Subtotal</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {items.map((line, idx) => (
                <tr key={idx}>
                  <td className="p-1.5">
                    <input 
                      type="text" 
                      value={line.itemName} 
                      onChange={(e) => updateItemField(idx, "itemName", e.target.value)}
                      placeholder="e.g. Solar inverter cell spares"
                      className="w-full p-1.5 border rounded"
                    />
                  </td>
                  <td className="p-1.5">
                    <input 
                      type="text" 
                      value={line.hsnCode} 
                      onChange={(e) => updateItemField(idx, "hsnCode", e.target.value)}
                      placeholder="85044090"
                      className="w-full p-1.5 border rounded font-mono text-center"
                    />
                  </td>
                  <td className="p-1.5">
                    <input 
                      type="number" 
                      value={line.qty || ""} 
                      onChange={(e) => updateItemField(idx, "qty", parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 border rounded font-mono text-center"
                    />
                  </td>
                  <td className="p-1.5">
                    <input 
                      type="text" 
                      value={line.perQty} 
                      onChange={(e) => updateItemField(idx, "perQty", e.target.value)}
                      className="w-full p-1.5 border rounded text-center"
                    />
                  </td>
                  <td className="p-1.5">
                    <input 
                      type="number" 
                      value={line.unitRate || ""} 
                      onChange={(e) => updateItemField(idx, "unitRate", parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 border font-mono rounded text-right"
                    />
                  </td>
                  <td className="p-1.5 font-mono text-right text-slate-700 font-semibold p-2">
                    {line.totalAmount ? line.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                  </td>
                  <td className="p-1.5 text-center">
                    <button onClick={() => removeItemRow(idx)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax summary calculations panel */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 font-medium">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span>Assessable Invoice Base Total:</span>
                <span className="font-mono">{baseSubtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Less: Cash/Trade Discount:</span>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 p-1 border font-mono rounded text-right shrink-0"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Forwarding Packaging & Freight (P&F):</span>
                <input 
                  type="number" 
                  value={pandf} 
                  onChange={(e) => setPandf(parseFloat(e.target.value) || 0)}
                  className="w-24 p-1 border font-mono rounded text-right shrink-0"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Manually Adjusted Round Off (+/-):</span>
                <input 
                  type="number" 
                  value={roundOff} 
                  onChange={(e) => setRoundOff(parseFloat(e.target.value) || 0)}
                  className="w-24 p-1 border font-mono rounded text-right shrink-0"
                />
              </div>
            </div>

            {/* Live computed billing summary exact to Page 16 parameters */}
            <div className="bg-slate-50 p-4 border rounded-md flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-500 uppercase tracking-widest text-[10px] mb-3">Live Tax & RCM Estimates</h4>
                <div className="space-y-1.5 text-slate-600 font-mono">
                  <div className="flex justify-between">
                    <span>Taxable Value:</span>
                    <span>Rs. {taxableAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST ({cgstPercentage}% RCM):</span>
                    <span>Rs. {cgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span>SGST ({sgstPercentage}% RCM):</span>
                    <span>Rs. {sgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold pt-1.5">
                    <span>Grand Ledger Total:</span>
                    <span className="text-blue-600">Rs. {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={clearForm} className="bg-white border px-4 py-2 rounded text-xs font-bold cursor-pointer">Clear</button>
                <button onClick={handleSave} className="bg-[#2563EB] text-white hover:bg-blue-700 px-5 py-2 rounded text-xs font-bold cursor-pointer">Save Bill Invoice</button>
              </div>
            </div>

          </div>

          <div className="mt-4 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">General Memo Description / RCM particulars</span>
            <input 
              type="text" 
              value={narration} 
              onChange={(e) => setNarration(e.target.value)}
              className="p-2 border rounded text-xs"
            />
          </div>

        </div>

        </div>
      </div>

      {/* RIGHT: Lookup Column */}
      <div className="hidden" id="rb-history-sidebar">
        <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest mb-4">RCM Bills ({billsList.length})</h4>
        <div className="flex flex-col gap-3">
          {billsList.map(b => (
            <div 
              key={b.id} 
              onClick={() => loadBill(b)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                b.id === billId ? "bg-blue-50 border-blue-500" : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-center font-bold mb-1">
                <span className="text-blue-600 font-mono">Invoice: {b.billNo}</span>
                <span className="text-slate-400 font-mono">{b.accDate}</span>
              </div>
              <p className="text-slate-600 font-semibold truncate mb-1">Seller: {b.partyName}</p>
              <p className="text-[10px] text-slate-400 truncate mb-2">Particulars: {b.narration}</p>
              <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100">
                <span className="font-bold text-[#166534] bg-green-50 px-1.5 rounded">Rs. {b.grandTotal.toLocaleString()}</span>
                <span className="text-slate-400 font-bold uppercase">🧑 {b.userName}</span>
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onPrint(b); }}
                  className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" /> PRINT BILL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
