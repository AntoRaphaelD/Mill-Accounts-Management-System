import React, { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";

export default function VoucherFind({ database }) {
  // Date Range State
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-04-17");

  // Search Criteria State
  const [findBy, setFindBy] = useState("Voucher No");
  const [operator, setOperator] = useState("LIKE");
  const [searchValue, setSearchValue] = useState("");

  // Live computed results (fetching while typing)
  const results = useMemo(() => {
    if (!database || !database.vouchers) return [];

    const filtered = database.vouchers.filter(v => {
      // 1. Date Range Filter
      if (v.voucherDate < fromDate || v.voucherDate > toDate) return false;
      
      // 2. Condition Filter
      if (searchValue.trim() !== "") {
        let fieldVal = "";
        
        if (findBy === "Voucher No") fieldVal = v.voucherNo;
        else if (findBy === "Voucher Type") fieldVal = v.type;
        else if (findBy === "Narration") fieldVal = v.narration || "";
        else if (findBy === "Amount") fieldVal = v.totalAmount;
        else if (findBy === "Party Name") {
            // Extract primary party name from items
            const primaryItem = v.items?.find(i => 
                i.accountName !== v.cashAccount && 
                i.accountName !== v.bankAccount
            );
            fieldVal = primaryItem ? primaryItem.accountName : (v.partyName || "");
        }

        const sVal = searchValue.toLowerCase();
        const fVal = String(fieldVal).toLowerCase();

        if (operator === "=") {
          if (fVal !== sVal) return false;
        } else if (operator === "LIKE") {
          if (!fVal.includes(sVal)) return false;
        } else if (operator === "<>") {
          if (fVal === sVal) return false;
        } else if ([">", "<", ">=", "<="].includes(operator)) {
           const numField = parseFloat(fieldVal);
           const numSearch = parseFloat(searchValue);
           if (!isNaN(numField) && !isNaN(numSearch)) {
              if (operator === ">" && !(numField > numSearch)) return false;
              if (operator === "<" && !(numField < numSearch)) return false;
              if (operator === ">=" && !(numField >= numSearch)) return false;
              if (operator === "<=" && !(numField <= numSearch)) return false;
           } else {
              return false; 
           }
        }
      }
      return true;
    });

    // Map raw voucher data to the requested grid columns
    return filtered.map(v => {
      let partyName = "Multiple / Mixed";
      let debit = 0;
      let credit = 0;
      let book = "Journal";

      // Determine Book Name
      if (v.type === "CP" || v.type === "CR") book = "Cash Book";
      else if (v.type === "BP" || v.type === "BR") book = "Bank Book";
      else if (v.type === "CONTRA") book = "Contra";
      else if (v.type === "REVERSE_BILL") book = "RCM Register";

      // Determine Party Name
      const primaryItem = v.items?.find(i => i.accountName !== v.cashAccount && i.accountName !== v.bankAccount);
      if (primaryItem) partyName = primaryItem.accountName;
      if (v.partyName) partyName = v.partyName; // Override for RCM Bills

      // Determine proper Debit/Credit amounts based on Voucher nature
      if (v.type === "CP" || v.type === "BP") {
        debit = v.totalAmount;
      } else if (v.type === "CR" || v.type === "BR") {
        credit = v.totalAmount;
      } else {
        debit = v.totalAmount;
        credit = v.totalAmount;
      }

      return {
        id: v.id,
        vType: v.type,
        vNo: v.voucherNo,
        vDate: v.voucherDate || v.accDate,
        partyName,
        narration: v.narration,
        credit,
        debit,
        book
      };
    });
  }, [database, fromDate, toDate, findBy, operator, searchValue]);

  const handleCancel = () => {
    setSearchValue("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      
      {/* Filter Options Section */}
      <div className="p-6 bg-white border-b border-[#E2E8F0] shadow-sm flex flex-col gap-4 shrink-0">
        
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <label>Voucher from</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="p-1.5 border rounded outline-none font-mono" />
          </div>
          <div className="flex items-center gap-2">
            <label>To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="p-1.5 border rounded outline-none font-mono" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <label>Find by</label>
            <select value={findBy} onChange={e => setFindBy(e.target.value)} className="p-1.5 border rounded outline-none w-32">
              <option value="Voucher No">Voucher No</option>
              <option value="Party Name">Party Name</option>
              <option value="Narration">Narration</option>
              <option value="Voucher Type">Voucher Type</option>
              <option value="Amount">Amount</option>
            </select>
            
            <select value={operator} onChange={e => setOperator(e.target.value)} className="p-1.5 border rounded outline-none font-mono text-center w-16">
              <option value="=">=</option>
              <option value="LIKE">LIKE</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&gt;=</option>
              <option value="<=">&lt;=</option>
              <option value="<>">&lt;&gt;</option>
            </select>

            <input 
              type="text" 
              value={searchValue} 
              onChange={e => setSearchValue(e.target.value)} 
              placeholder="Enter search value..." 
              className="p-1.5 border rounded outline-none w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider select-none"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Live Search</div>
            <button onClick={handleCancel} className="bg-white border hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded text-xs font-bold transition-colors">Cancel</button>
          </div>
        </div>
      </div>

      {/* Results Grid Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-[#E2E8F0] sticky top-0">
              <tr className="text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">V Type</th>
                <th className="p-3">V No.</th>
                <th className="p-3">V Date</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Narration</th>
                <th className="p-3 text-right">Credit</th>
                <th className="p-3 text-right">Debit</th>
                <th className="p-3 text-center">Book</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {results.map((row, idx) => (
                <tr key={`${row.id}-${idx}`} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">{row.vType}</td>
                  <td className="p-3 font-mono font-bold text-blue-600">{row.vNo}</td>
                  <td className="p-3 font-mono text-slate-600">{row.vDate}</td>
                  <td className="p-3 font-semibold text-slate-800 truncate max-w-[150px]">{row.partyName}</td>
                  <td className="p-3 text-slate-500 truncate max-w-[200px]" title={row.narration}>{row.narration}</td>
                  <td className="p-3 text-right text-orange-600 font-medium font-mono">{row.credit > 0 ? row.credit.toLocaleString("en-IN", {minimumFractionDigits: 2}) : "0.00"}</td>
                  <td className="p-3 text-right text-emerald-600 font-medium font-mono">{row.debit > 0 ? row.debit.toLocaleString("en-IN", {minimumFractionDigits: 2}) : "0.00"}</td>
                  <td className="p-3 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 whitespace-nowrap">{row.book}</span>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400 font-medium italic">No vouchers found matching your search criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}