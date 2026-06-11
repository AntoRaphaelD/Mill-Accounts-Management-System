import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Check, X, ShieldAlert } from "lucide-react";

export default function AccountMaster({ 
  type = "accounts", // accounts, subgroups, tds, pl, bs, bwo, closing
  database, 
  onSaveAccount,
  onDeleteAccount,
  onSaveSubGroup,
  onDeleteSubGroup,
  onSaveTds,
  onDeleteTds,
  onSaveServiceTax,
  onDeleteServiceTax,
  onSaveBillWiseOpening,
  onDeleteBillWiseOpening,
  onSaveClosingStock,
  onDeleteClosingStock
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filter List based on Search Term
  const accountsList = database.accounts || [];
  const subGroupsList = database.subGroups || [];
  const tdsList = database.tds || [];
  const stList = database.serviceTax || [];
  const openingsList = database.billWiseOpenings || [];
  const closingStockList = database.closingStock || [];

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Delete Action Dispatcher
  const handleDelete = (idOrCode) => {
    if(!confirm("Are you sure you want to delete this master entry?")) return;
    if (type === "accounts") onDeleteAccount(idOrCode);
    if (type === "subgroups") onDeleteSubGroup(idOrCode);
    if (type === "tds") onDeleteTds(idOrCode);
    if (type === "bwo") onDeleteBillWiseOpening(idOrCode);
    if (type === "closing") onDeleteClosingStock(idOrCode);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F8FAFC]" id="master-panel-root">
      
      {/* Search Filter Panel */}
      <div className="p-6 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4" id="master-search-bar">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search records by name, code, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-md text-xs outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Master Entry
        </button>
      </div>

      {/* Grid Content Section */}
      <div className="flex-1 overflow-auto p-6" id="master-table-wrapper">
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
          
          {type === "accounts" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                  <th className="p-4">Code</th>
                  <th className="p-4">Account Name</th>
                  <th className="p-4">Sub-Group</th>
                  <th className="p-4">Place / Contact</th>
                  <th className="p-4 text-right">Opg Debit</th>
                  <th className="p-4 text-right">Opg Credit</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {accountsList
                  .filter(a => a.name.toLowerCase().includes(searchTerm) || a.code.includes(searchTerm) || a.place.toLowerCase().includes(searchTerm))
                  .map(acc => (
                    <tr key={acc.code} className="hover:bg-[#F8FAFC]">
                      <td className="p-4 font-mono text-[#2563EB] font-semibold">{acc.code}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{acc.name}</div>
                        {acc.address && <div className="text-[10px] text-slate-400 truncate max-w-xs">{acc.address}</div>}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">{acc.subGroupName}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-700">{acc.place}</div>
                        {acc.phone && <div className="text-[10px] text-slate-400">📞 {acc.phone}</div>}
                      </td>
                      <td className="p-4 text-right font-mono font-medium text-slate-700">
                        {acc.openingDebit ? parseFloat(acc.openingDebit).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
                      </td>
                      <td className="p-4 text-right font-mono font-medium text-slate-700">
                        {acc.openingCredit ? parseFloat(acc.openingCredit).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "-"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingItem(acc); setIsModalOpen(true); }} className="text-slate-500 hover:text-[#2563EB] cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(acc.code)} className="text-slate-500 hover:text-red-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {type === "subgroups" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                  <th className="p-4">Sub-Group Description</th>
                  <th className="p-4">Under Group</th>
                  <th className="p-4">Ledger Type</th>
                  <th className="p-4 text-center">TB SlNo</th>
                  <th className="p-4 text-center">P&L</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {subGroupsList
                  .filter(s => s.name.toLowerCase().includes(searchTerm) || s.groupName.toLowerCase().includes(searchTerm))
                  .map(sg => (
                    <tr key={sg.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-4 font-semibold text-slate-800">{sg.name}</td>
                      <td className="p-4 text-slate-600">{sg.groupName}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sg.ledgerType === "GENERAL LEDGER" ? "bg-blue-50 text-[#2563EB]" : "bg-purple-50 text-purple-600"}`}>
                          {sg.ledgerType}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-slate-500">{sg.tbSlNo || "-"}</td>
                      <td className="p-4 text-center font-mono text-slate-500">{sg.pAndL || "-"}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingItem(sg); setIsModalOpen(true); }} className="text-slate-500 hover:text-[#2563EB] cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(sg.id)} className="text-slate-500 hover:text-red-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {type === "tds" && (
            <div>
              <div className="p-4 bg-slate-50 font-bold text-slate-700 text-xs border-b border-[#E2E8F0]">TDS Rates Matrix</div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <th className="p-4">TDS Name</th>
                    <th className="p-4 text-center">TDS %</th>
                    <th className="p-4 text-center">SC %</th>
                    <th className="p-4">TDS Ledger</th>
                    <th className="p-4 text-center">Section</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {tdsList
                    .filter(t => t.name.toLowerCase().includes(searchTerm))
                    .map(tds => (
                      <tr key={tds.code} className="hover:bg-[#F8FAFC]">
                        <td className="p-4 font-semibold text-slate-800">{tds.name}</td>
                        <td className="p-4 text-center font-mono font-bold text-[#2563EB]">{tds.tdsPercentage}%</td>
                        <td className="p-4 text-center font-mono text-slate-500">{tds.scPercentage}%</td>
                        <td className="p-4 font-mono text-slate-600">{tds.accountHeadName}</td>
                        <td className="p-4 text-center font-mono text-slate-500">{tds.sectionCode}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setEditingItem(tds); setIsModalOpen(true); }} className="text-slate-500 hover:text-[#2563EB] cursor-pointer">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(tds.code)} className="text-slate-500 hover:text-red-600 cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="p-4 bg-slate-50 font-bold text-slate-100 text-xs border-b border-t border-[#E2E8F0] mt-6 flex items-center justify-between">
                <span className="text-slate-700">Service Tax Rates Matrix</span>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <th className="p-4">ST Name</th>
                    <th className="p-4 text-center">Tax %</th>
                    <th className="p-4 text-center">SC %</th>
                    <th className="p-4 text-center">Chess %</th>
                    <th className="p-4">Account code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {stList.map(st => (
                    <tr key={st.code} className="hover:bg-[#F8FAFC]">
                      <td className="p-4 font-semibold text-slate-800">{st.name}</td>
                      <td className="p-4 text-center font-mono font-semibold text-[#2563EB]">{st.taxPercentage}%</td>
                      <td className="p-4 text-center font-mono text-slate-500">{st.scPercentage}%</td>
                      <td className="p-4 text-center font-mono text-slate-500">{st.chessPercentage}%</td>
                      <td className="p-4 font-mono text-slate-600">{st.accountCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {type === "bwo" && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                  <th className="p-4">Party Name</th>
                  <th className="p-4">Subgroup Name</th>
                  <th className="p-4">Bill No</th>
                  <th className="p-4">Bill Date</th>
                  <th className="p-4 text-right">Debit</th>
                  <th className="p-4 text-right">Credit</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {openingsList
                  .filter(b => b.partyName.toLowerCase().includes(searchTerm))
                  .map(ord => (
                    <tr key={ord.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-4 font-semibold text-slate-800">{ord.partyName}</td>
                      <td className="p-4 text-slate-600">{ord.subGroup}</td>
                      <td className="p-4 font-mono font-bold text-slate-700">{ord.billNo}</td>
                      <td className="p-4 font-mono text-slate-500">{ord.billDate}</td>
                      <td className="p-4 text-right font-mono text-slate-700">{(ord.debit || 0).toLocaleString("en-IN", { minimumFractionDigits:2 })}</td>
                      <td className="p-4 text-right font-mono text-slate-700">{(ord.credit || 0).toLocaleString("en-IN", { minimumFractionDigits:2 })}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setEditingItem(ord); setIsModalOpen(true); }} className="text-slate-500 hover:text-[#2563EB] cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(ord.id)} className="text-slate-500 hover:text-red-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

        </div>
      </div>

      {/* Pop-up Dialog Modal for Creating/Editing Master Entries */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E293B]/40 flex items-center justify-center z-50 p-4" id="master-modal">
          <div className={`bg-white rounded-lg shadow-xl border border-[#E2E8F0] p-6 w-full max-h-[85vh] overflow-y-auto ${type === "accounts" ? "max-w-4xl" : "max-w-lg"}`}>
            
            <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-[#1E293B] text-sm uppercase tracking-wider">
                {editingItem ? "✏️ Edit" : "➕ Create"} {type.toUpperCase()} Master Detail
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = Object.fromEntries(fd.entries());

              if (type === "accounts") {
                const updated = {
                  code: data.code,
                  name: data.name,
                  groupName: data.groupName,
                  subGroupName: data.subGroupName,
                  mainGroupName: data.mainGroupName || "Liabilities",
                  place: data.place,
                  address1: data.address1,
                  address2: data.address2,
                  address3: data.address3,
                  state: data.state,
                  deliveryAddress1: data.deliveryAddress1,
                  deliveryAddress2: data.deliveryAddress2,
                  deliveryAddress3: data.deliveryAddress3,
                  cstNo: data.cstNo,
                  tinNo: data.tinNo,
                  phoneNo: data.phoneNo,
                  email: data.email,
                  fax: data.fax,
                  website: data.website,
                  accountNo: data.accountNo,
                  cellNo: data.cellNo,
                  voucherDescription: data.voucherDescription,
                  openingDebit: parseFloat(data.openingDebit) || 0,
                  openingCredit: parseFloat(data.openingCredit) || 0,
                  panNo: data.panNo,
                  gstNo: data.gstNo,
                  contactPerson: data.contactPerson
                };
                onSaveAccount(updated);
              } else if (type === "subgroups") {
                const updated = {
                  id: editingItem?.id || undefined,
                  name: data.name,
                  groupName: data.groupName,
                  mainDescription: data.mainDescription || "Liabilities",
                  ledgerType: data.ledgerType || "GENERAL LEDGER",
                  tbSlNo: parseInt(data.tbSlNo) || 0,
                  pAndL: parseInt(data.pAndL) || 0
                };
                onSaveSubGroup(updated);
              } else if (type === "tds") {
                const updated = {
                  code: editingItem?.code || data.code,
                  name: data.name,
                  tdsPercentage: parseFloat(data.tdsPercentage) || 0,
                  scPercentage: parseFloat(data.scPercentage) || 0,
                  accountHeadName: data.accountHeadName,
                  sectionCode: data.sectionCode
                };
                onSaveTds(updated);
              } else if (type === "bwo") {
                const updated = {
                  id: editingItem?.id || undefined,
                  partyName: data.partyName,
                  subGroup: data.subGroup,
                  billNo: data.billNo,
                  billDate: data.billDate,
                  credit: parseFloat(data.credit) || 0,
                  debit: parseFloat(data.debit) || 0,
                  remarks: data.remarks
                };
                onSaveBillWiseOpening(updated);
              }
              setIsModalOpen(false);
            }}>

              {type === "accounts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-xs font-semibold text-slate-700">
                  {/* --- LEFT SECTION --- */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block mb-1">Code</label>
                      <input name="code" defaultValue={editingItem?.code || ""} required disabled={!!editingItem} className="w-full p-2 border rounded text-xs bg-slate-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block mb-1">Account Group</label>
                      <select name="subGroupName" defaultValue={editingItem?.subGroupName || ""} required className="w-full p-2 border rounded text-xs">
                        <option value="">-- Select Group --</option>
                        {subGroupsList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Account Name</label>
                      <input name="name" defaultValue={editingItem?.name || ""} required className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Place</label>
                      <input name="place" defaultValue={editingItem?.place || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Address Line 1</label>
                      <input name="address1" defaultValue={editingItem?.address1 || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Address Line 2</label>
                      <input name="address2" defaultValue={editingItem?.address2 || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Address Line 3</label>
                      <input name="address3" defaultValue={editingItem?.address3 || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">State</label>
                      <input name="state" defaultValue={editingItem?.state || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Delivery Address Line 1</label>
                      <input name="deliveryAddress1" defaultValue={editingItem?.deliveryAddress1 || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Delivery Address Line 2</label>
                      <input name="deliveryAddress2" defaultValue={editingItem?.deliveryAddress2 || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Delivery Address Line 3</label>
                      <input name="deliveryAddress3" defaultValue={editingItem?.deliveryAddress3 || ""} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block mb-1">Opening Credit</label>
                      <input type="number" step="any" name="openingCredit" defaultValue={editingItem?.openingCredit || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block mb-1">Opening Debit</label>
                      <input type="number" step="any" name="openingDebit" defaultValue={editingItem?.openingDebit || ""} className="w-full p-2 border rounded text-xs font-mono" />
                    </div>
                  </div>

                  {/* --- RIGHT SECTION --- */}
                  <div className="flex flex-col gap-3">
                    <div><label className="block mb-1">CST No</label><input name="cstNo" defaultValue={editingItem?.cstNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">TIN No</label><input name="tinNo" defaultValue={editingItem?.tinNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Phone No</label><input name="phoneNo" defaultValue={editingItem?.phoneNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Email</label><input type="email" name="email" defaultValue={editingItem?.email || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Fax</label><input name="fax" defaultValue={editingItem?.fax || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Website</label><input type="url" name="website" defaultValue={editingItem?.website || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Account No</label><input name="accountNo" defaultValue={editingItem?.accountNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Contact</label><input name="contactPerson" defaultValue={editingItem?.contactPerson || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Cell No</label><input name="cellNo" defaultValue={editingItem?.cellNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">Voucher Description</label><input name="voucherDescription" defaultValue={editingItem?.voucherDescription || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">PAN No</label><input name="panNo" defaultValue={editingItem?.panNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                    <div><label className="block mb-1">GST No</label><input name="gstNo" defaultValue={editingItem?.gstNo || ""} className="w-full p-2 border rounded text-xs" /></div>
                  </div>
                </div>
              )}

              {type === "subgroups" && (
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="col-span-2">
                    <label className="block mb-1">Subgroup Description</label>
                    <input name="name" defaultValue={editingItem?.name || ""} required className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">Main Group</label>
                    <select name="groupName" defaultValue={editingItem?.groupName || ""} className="w-full p-2 border rounded text-xs">
                      {database.groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Ledger Mapping Type</label>
                    <select name="ledgerType" defaultValue={editingItem?.ledgerType || ""} className="w-full p-2 border rounded text-xs">
                      <option value="GENERAL LEDGER">GENERAL LEDGER</option>
                      <option value="SUB LEDGER">SUB LEDGER</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Trial Balance Sl No</label>
                    <input type="number" name="tbSlNo" defaultValue={editingItem?.tbSlNo || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">P&L Category Mapping Code</label>
                    <input type="number" name="pAndL" defaultValue={editingItem?.pAndL || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                </div>
              )}

              {type === "tds" && (
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="col-span-2">
                    <label className="block mb-1">TDS Service Type Definition</label>
                    <input name="name" defaultValue={editingItem?.name || ""} required className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">TDS Slab Rate (%)</label>
                    <input type="number" step="any" name="tdsPercentage" defaultValue={editingItem?.tdsPercentage || ""} required className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">Surcharge (%)</label>
                    <input type="number" step="any" name="scPercentage" defaultValue={editingItem?.scPercentage || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1">Account Head Ledger (Credit Postings)</label>
                    <input name="accountHeadName" defaultValue={editingItem?.accountHeadName || ""} required className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1">Tax Code Section (e.g. 194 C)</label>
                    <input name="sectionCode" defaultValue={editingItem?.sectionCode || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                </div>
              )}

              {type === "bwo" && (
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div className="col-span-2 font-mono text-slate-500 bg-slate-100 p-2 text-[10px] rounded">
                    Assign precise historic invoice balances for aging/bill-wise reports.
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1">Party Descriptor</label>
                    <select name="partyName" defaultValue={editingItem?.partyName || ""} className="w-full p-2 border rounded text-xs font-mono">
                      {accountsList.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Creditor Sub-Group</label>
                    <input name="subGroup" defaultValue={editingItem?.subGroup || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">Opening Bill/Invoice No</label>
                    <input name="billNo" defaultValue={editingItem?.billNo || ""} required className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">Bill Register Date</label>
                    <input type="date" name="billDate" defaultValue={editingItem?.billDate || new Date().toISOString().split('T')[0]} required className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">Debit Amount (Rs)</label>
                    <input type="number" step="any" name="debit" defaultValue={editingItem?.debit || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div>
                    <label className="block mb-1">Credit Amount (Rs)</label>
                    <input type="number" step="any" name="credit" defaultValue={editingItem?.credit || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1">Remarks</label>
                    <input name="remarks" defaultValue={editingItem?.remarks || ""} className="w-full p-2 border rounded text-xs" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-semibold cursor-pointer">
                  {type === "accounts" ? "Update" : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
