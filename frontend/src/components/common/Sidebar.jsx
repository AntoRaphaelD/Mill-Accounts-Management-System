import React from "react";
import { 
  BookOpen, 
  Layers, 
  FileText, 
  Settings, 
  TrendingUp, 
  Users, 
  PlusCircle, 
  Briefcase, 
  Receipt,
  FileCheck,
  Percent,
  ListRestart,
  CreditCard,
  Search,
  ClipboardList
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, currentUser, setCurrentUser }) {
  const usersList = ["SIVA", "SUDHA", "suresh"];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen, category: "Core" },
    { id: "accounts-master", label: "Accounts Master", icon: Users, category: "Masters" },
    { id: "group-master", label: "Group Master", icon: Layers, category: "Masters" },
    { id: "subgroup-master", label: "Sub Group Master", icon: Layers, category: "Masters" },
    { id: "tds-master", label: "TDS Type Master", icon: Percent, category: "Masters" },
    { id: "st-master", label: "ST Type Master", icon: Percent, category: "Masters" },
    { id: "pl-settings", label: "Profit & Loss Settings", icon: Settings, category: "Masters" },
    { id: "bs-main-group", label: "Balance Sheet Main Group", icon: Layers, category: "Masters" },
    { id: "bs-group", label: "Balance Sheet Group", icon: Layers, category: "Masters" },
    { id: "bill-wise-opening", label: "Bill Wise Opening", icon: FileText, category: "Masters" },
    { id: "reverse-charge", label: "Reverse Charge Master", icon: Settings, category: "Masters" },
    
    { id: "journal-voucher", label: "Journal Voucher", icon: FileText, category: "Vouchers" },
    { id: "cash-payment", label: "Cash Payment", icon: Receipt, category: "Vouchers" },
    { id: "bank-payment", label: "Bank Payment", icon: CreditCard, category: "Vouchers" },
    { id: "cash-receipt", label: "Cash Receipt", icon: FileCheck, category: "Vouchers" },
    { id: "bank-receipt", label: "Bank Receipt", icon: FileCheck, category: "Vouchers" },
    { id: "contra-entry", label: "Contra Entry", icon: ListRestart, category: "Vouchers" },
    { id: "reverse-bill", label: "Reverse Bill Entry", icon: PlusCircle, category: "Vouchers" },
    { id: "voucher-find", label: "Voucher Find", icon: Search, category: "Vouchers" },
    { id: "provisions-entry", label: "Provisions Entry", icon: Briefcase, category: "Vouchers" },
    { id: "debit-note", label: "Debit Note", icon: FileText, category: "Vouchers" },
    { id: "credit-note", label: "Credit Note", icon: FileText, category: "Vouchers" },

    { id: "c-form", label: "C Form", icon: ClipboardList, category: "Tax Forms" },
    { id: "f-form", label: "F Form", icon: ClipboardList, category: "Tax Forms" },
    { id: "h-form", label: "H Form", icon: ClipboardList, category: "Tax Forms" },
    { id: "e1-form", label: "E1 Form", icon: ClipboardList, category: "Tax Forms" },
    { id: "c-form-purchase", label: "C Form Purchase", icon: ClipboardList, category: "Tax Forms" },

    { id: "general-ledger", label: "General Ledger", icon: TrendingUp, category: "Reports" },
    { id: "trial-balance", label: "Trial Balance", icon: TrendingUp, category: "Reports" },
    { id: "profit-loss", label: "Profit & Loss", icon: TrendingUp, category: "Reports" },
    { id: "balance-sheet", label: "Balance Sheet", icon: TrendingUp, category: "Reports" },
    { id: "sales-tax", label: "Tax & TDS Statements", icon: Settings, category: "Reports" },
    { id: "audit-logs", label: "Audit Trial Logs", icon: Settings, category: "System" }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-screen select-none shrink-0" id="sidebar-container">
      {/* Platform Branding */}
      <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-3" id="sidebar-logo">
        <div className="w-8 h-8 bg-[#2563EB] rounded flex items-center justify-center text-white font-bold text-sm">
          KF
        </div>
        <div>
          <h1 className="font-bold text-[#1E293B] text-base leading-none">AccuFlow ERP</h1>
          <span className="text-[10px] text-[#2563EB] font-bold tracking-wider uppercase">Kayaar Exports</span>
        </div>
      </div>

      {/* Acting User Selecter */}
      <div className="p-4 bg-slate-50 border-b border-[#E2E8F0] text-xs" id="sidebar-user-selector">
        <label className="block text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
          Acting User (RBAC Match)
        </label>
        <select 
          value={currentUser} 
          onChange={(e) => setCurrentUser(e.target.value)}
          className="w-full p-1.5 bg-white border border-[#E2E8F0] rounded text-xs font-semibold text-[#1E293B] outline-none focus:ring-1 focus:ring-[#2563EB]"
        >
          {usersList.map(u => (
            <option key={u} value={u}>🧑‍💻 {u}</option>
          ))}
        </select>
      </div>

      {/* Main Navigation Item groups */}
      <div className="flex-1 overflow-y-auto py-4" id="sidebar-nav">
        {["Core", "Masters", "Vouchers", "Tax Forms", "Reports", "System"].map(cat => {
          const items = menuItems.filter(i => i.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-4">
              <h3 className="px-6 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                {cat}
              </h3>
              {items.map(item => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`nav-item w-full px-6 py-2.5 flex items-center gap-3 text-left text-xs font-medium cursor-pointer transition-all border-l-2 ${
                      isActive 
                        ? "bg-[#EFF6FF] text-[#2563EB] border-[#2563EB] font-bold" 
                        : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border-transparent"
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Session Footer details */}
      <div className="p-4 border-t border-[#E2E8F0] bg-slate-50 text-[10px] text-[#64748B]" id="sidebar-footer">
        <div>FY: 2026 - 2027</div>
        <div className="flex items-center gap-1.5 mt-1 font-semibold text-[#166534]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#166534] inline-block animate-pulse"></span>
          <span>Durable Local Engine Active</span>
        </div>
      </div>
    </aside>
  );
}
