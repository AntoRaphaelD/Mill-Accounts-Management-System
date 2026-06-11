import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

export default function GroupMaster({ 
  database, 
  onSaveGroup,
  onDeleteGroup 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filter List based on Search Term
  const groupsList = database.groups || [];

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Delete Action Dispatcher
  const handleDelete = (id) => {
    if(!confirm("Are you sure you want to delete this group entry?")) return;
    if (onDeleteGroup) onDeleteGroup(id);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#F8FAFC]" id="group-master-root">
      
      {/* Search Filter Panel */}
      <div className="p-6 bg-white border-b border-[#E2E8F0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4" id="master-search-bar">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search groups by ID, name, or description..."
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
          <Plus className="w-4 h-4" /> Add New Group
        </button>
      </div>

      {/* Grid Content Section */}
      <div className="flex-1 overflow-auto p-6" id="master-table-wrapper">
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
          
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4 w-32">ID</th>
                <th className="p-4">Group Description</th>
                <th className="p-4">Main Description</th>
                <th className="p-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {groupsList
                .filter(g => 
                  (g.name && g.name.toLowerCase().includes(searchTerm)) || 
                  (g.id && g.id.toLowerCase().includes(searchTerm)) || 
                  (g.mainDescription && g.mainDescription.toLowerCase().includes(searchTerm))
                )
                .map(group => (
                  <tr key={group.id} className="hover:bg-[#F8FAFC]">
                    <td className="p-4 font-mono text-[#2563EB] font-semibold">{group.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{group.name}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                        {group.mainDescription}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setEditingItem(group); setIsModalOpen(true); }} className="text-slate-500 hover:text-[#2563EB] cursor-pointer" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(group.id)} className="text-slate-500 hover:text-red-600 cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {groupsList.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">No groups found in the database.</div>
          )}
        </div>
      </div>

      {/* Pop-up Dialog Modal for Creating/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E293B]/40 flex items-center justify-center z-50 p-4" id="group-modal">
          <div className="bg-white rounded-lg shadow-xl border border-[#E2E8F0] p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-bold text-[#1E293B] text-sm uppercase tracking-wider">
                {editingItem ? "✏️ Edit" : "➕ Create"} Group
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = Object.fromEntries(fd.entries());

              const updated = {
                id: editingItem?.id || data.id || undefined,
                name: data.name,
                mainDescription: data.mainDescription
              };
              if (onSaveGroup) onSaveGroup(updated);
              setIsModalOpen(false);
            }}>

              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
                <div><label className="block mb-1">Group ID (Optional)</label><input name="id" defaultValue={editingItem?.id || ""} disabled={!!editingItem} placeholder="Auto-generated if left blank" className="w-full p-2 border rounded text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#2563EB]" /></div>
                <div><label className="block mb-1">Group Description</label><input name="name" defaultValue={editingItem?.name || ""} required placeholder="e.g. Current Assets" className="w-full p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-[#2563EB]" /></div>
                <div><label className="block mb-1">Main Description (Category)</label><select name="mainDescription" defaultValue={editingItem?.mainDescription || ""} required className="w-full p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-[#2563EB]"><option value="">-- Select Main Category --</option><option value="Assets">Assets</option><option value="Liabilities">Liabilities</option><option value="Incomes">Incomes</option><option value="Expenses">Expenses</option><option value="Profit & Loss A/c">Profit & Loss A/c</option></select></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0] mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-semibold cursor-pointer">{editingItem ? "Update Group" : "Save Group"}</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
