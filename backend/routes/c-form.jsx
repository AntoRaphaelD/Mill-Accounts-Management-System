import React, { useState } from "react";
import { Plus, X, FileText, Trash2, Edit2 } from "lucide-react";

export default function CForm({ database, onSave, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const openModal = () => {
    setFormData({});
    setItems([{ id: 1, invNo: "", invDate: "", assessable: 0, kgs: 0, taxable: 0, tax: 0, nett: 0, selected: false }]);
    setIsModalOpen(true);
  };

  const updateItem = (idx, field, val) => {
    setItems(items.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };

  const totalAmount = items.reduce((sum, it) => sum + (parseFloat(it.nett) || 0), 0);
  const selectedTotal = items.filter(it => it.selected).reduce((sum, it) => sum + (parseFloat(it.nett) || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <h3 className="font-bold uppercase text-sm text-slate-800">C Form Register</h3>
        <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Add C Form</button>
      </div>
      <div className="p-6 flex-1 text-center text-slate-400 text-sm mt-10">Click Add C Form to begin.</div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold uppercase text-sm">C Form Entry</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500"/></button>
            </div>
            
            <div className="p-6 overflow-auto flex-1 flex flex-col gap-6">
              {/* Header Fields */}
              <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex flex-col"><label>From Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>To Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Buyer's Name</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>C FORM No.</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Received Date</label><input type="date" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>C FORM Amount</label><input type="number" className="p-2 border rounded font-mono" /></div>
                <div className="flex flex-col"><label>Agent's Name</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label>Tin No.</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex flex-col col-span-2"><label>Remarks</label><input type="text" className="p-2 border rounded" /></div>
                <div className="flex items-center gap-2 mt-4"><input type="checkbox" className="w-4 h-4" /><label>E1 Form</label></div>
              </div>

              {/* Grid Section */}
              <div className="border rounded overflow-hidden">
                <table className="w-full text-xs text-left border-collapse bg-white">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-2 w-8"><input type="checkbox" checked={selectAll} onChange={e => {
                        setSelectAll(e.target.checked);
                        setItems(items.map(it => ({...it, selected: e.target.checked})));
                      }}/></th>
                      <th className="p-2">Inv. No.</th>
                      <th className="p-2">Inv. Date</th>
                      <th className="p-2 text-right">Assessable</th>
                      <th className="p-2 text-right">Kgs</th>
                      <th className="p-2 text-right">Taxable</th>
                      <th className="p-2 text-right">Tax</th>
                      <th className="p-2 text-right">Nett</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2"><input type="checkbox" checked={it.selected} onChange={e => updateItem(idx, 'selected', e.target.checked)}/></td>
                        <td className="p-1"><input className="w-full p-1 border rounded" value={it.invNo} onChange={e => updateItem(idx, 'invNo', e.target.value)} /></td>
                        <td className="p-1"><input type="date" className="w-full p-1 border rounded" value={it.invDate} onChange={e => updateItem(idx, 'invDate', e.target.value)} /></td>
                        <td className="p-1"><input type="number" className="w-full p-1 border rounded text-right" value={it.assessable} onChange={e => updateItem(idx, 'assessable', e.target.value)} /></td>
                        <td className="p-1"><input type="number" className="w-full p-1 border rounded text-right" value={it.kgs} onChange={e => updateItem(idx, 'kgs', e.target.value)} /></td>
                        <td className="p-1"><input type="number" className="w-full p-1 border rounded text-right" value={it.taxable} onChange={e => updateItem(idx, 'taxable', e.target.value)} /></td>
                        <td className="p-1"><input type="number" className="w-full p-1 border rounded text-right" value={it.tax} onChange={e => updateItem(idx, 'tax', e.target.value)} /></td>
                        <td className="p-1"><input type="number" className="w-full p-1 border rounded text-right" value={it.nett} onChange={e => updateItem(idx, 'nett', e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 bg-slate-50 border-t"><button onClick={() => setItems([...items, {id: Date.now(), selected: false}])} className="text-xs text-blue-600 font-bold">+ Add Invoice</button></div>
              </div>
              
              {/* Footer */}
              <div className="grid grid-cols-3 gap-4 border-t pt-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2"><input type="checkbox" checked={selectAll} readOnly className="w-4 h-4" /> Select All</div>
                <div className="flex flex-col"><label>Selected Inv. Total</label><input readOnly value={selectedTotal} className="p-2 border rounded bg-slate-50 font-mono text-right" /></div>
                <div className="flex flex-col"><label>Total Amount</label><input readOnly value={totalAmount} className="p-2 border rounded bg-slate-50 font-mono text-right text-blue-600" /></div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-2 bg-slate-50 shrink-0">
              <button className="px-4 py-2 bg-white border rounded text-xs font-bold flex items-center gap-1 mr-auto"><FileText className="w-4 h-4"/> Report</button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded text-xs font-bold">Save</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border rounded text-xs font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}