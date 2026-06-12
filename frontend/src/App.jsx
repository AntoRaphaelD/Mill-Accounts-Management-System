import React, { useState, useEffect } from "react";
import Sidebar from "./components/common/Sidebar";
import PageHeader from "./components/common/PageHeader";
import AccountMaster from "./components/masters/AccountMaster";
import GroupMaster from "./components/masters/GroupMaster";
import SubGroupMaster from "./components/masters/SubGroupMaster";
import TDSMaster from "./components/masters/TDSMaster";
import ServiceTaxMaster from "./components/masters/ServiceTaxMaster";
import PLSettingsMaster from "./components/masters/PLSettingsMaster";
import BSMainGroupMaster from "./components/masters/BSMainGroupMaster";
import BSGroupMaster from "./components/masters/BSGroupMaster";
import ReverseChargeMaster from "./components/masters/ReverseChargeMaster";
import BillWiseOpeningMaster from "./components/masters/BillWiseOpeningMaster";
import JournalVoucher from "./components/vouchers/JournalVoucher";
import CashPayment from "./components/vouchers/CashPayment";
import ReverseBillEntry from "./components/vouchers/ReverseBillEntry";
import GeneralLedger from "./components/reports/GeneralLedger";
import ContraEntry from "./components/vouchers/ContraEntry";
import BankPayment from './components/vouchers/BankPayment';
import VoucherFind from "./components/vouchers/VoucherFind";
import CForm from "./components/vouchers/c-form";
import FForm from "./components/vouchers/f-form";
import HForm from "./components/vouchers/h-form";
import E1Form from "./components/vouchers/e1-form";
import CFormPurchase from "./components/vouchers/c-formPurchase";
import Provisions from "./components/vouchers/provisions";

import { 
  getDB, 
  subscribeToDB, 
  setCurrentUser, 
  saveVoucher, 
  deleteVoucher, 
  saveAccount, 
  deleteAccount, 
  saveSubGroup, 
  deleteSubGroup,
  saveGroup,
  deleteGroup,
  saveTds, 
  deleteTds,
  saveServiceTax,
  deleteServiceTax,
  savePlSetting,
  deletePlSetting,
  saveBsMainGroup,
  deleteBsMainGroup,
  saveBsGroup,
  deleteBsGroup,
  saveReverseType,
  deleteReverseType,
  addAuditLog,
  saveBillWiseOpening,
  deleteBillWiseOpening,
  computeTrialBalance,
  computeProfitLoss,
  computeBalanceSheet,
  saveCForm,
  deleteCForm,
  saveFForm,
  deleteFForm,
  saveHForm,
  deleteHForm,
  saveE1Form,
  deleteE1Form,
  saveCFormPurchase,
  deleteCFormPurchase
} from "./database";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  CreditCard, 
  ShieldAlert, 
  BookOpen, 
  Cpu, 
  Printer, 
  X,
  FileSpreadsheet
} from "lucide-react";

export default function App() {
  const [db, setDb] = useState(getDB());
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Retro print modal states
  const [printedVoucher, setPrintedVoucher] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const MissingComponent = ({ title, id }) => (
    <div className="flex-1 overflow-hidden flex flex-col" id={`${id}-tab`}>
      <PageHeader category="Masters" title={title} description="This master component is not available." />
      <div className="p-6">
        <div className="bg-white border rounded-lg p-8 text-center text-slate-500">
          <p>The component for this master screen (e.g., <strong>{title}.jsx</strong>) was not found.</p>
          <p className="text-xs mt-2">To implement this screen, please ensure the corresponding component file exists in the project.</p>
        </div>
      </div>
    </div>
  );


  // Subscribe to DB changes to stay beautifully reactively in-sync with local storage
  useEffect(() => {
    const unsubscribe = subscribeToDB((newDb) => {
      setDb(newDb);
    });
    return unsubscribe;
  }, []);

  const handleSetCurrentUser = (user) => {
    setCurrentUser(user);
  };

  // Vouchers Persistence bridge
  const handleSaveVoucher = (v) => {
    return saveVoucher(v);
  };

  // --- PRINT WRAP DETECTOR (Replicating "frmPrint" desktop print viewer) ---
  const triggerPrintModal = (vOrReport) => {
    setPrintedVoucher(vOrReport);
    setIsPrintModalOpen(true);
  };

  // Dynamic Dashboard Stats
  const tbStats = computeTrialBalance("2026-04-17");
  const plStats = computeProfitLoss("2026-04-01", "2026-04-17");
  
  const cashAccountsTotal = db.accounts
    .filter(a => a.subGroupName === "CASH - ON - HAND")
    .reduce((sum, current) => {
      const tbLine = tbStats.accounts.find(t => t.code === current.code);
      return sum + (tbLine ? tbLine.balance : (current.openingDebit - current.openingCredit));
    }, 0);

  const bankAccountsTotal = db.accounts
    .filter(a => a.subGroupName === "BANK ACCOUNTS")
    .reduce((sum, current) => {
      const tbLine = tbStats.accounts.find(t => t.code === current.code);
      return sum + (tbLine ? tbLine.balance : (current.openingDebit - current.openingCredit));
    }, 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-[#1E293B]" id="main-app-viewport">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={db.currentUser} 
        setCurrentUser={handleSetCurrentUser} 
      />

      {/* Main Content Workspace viewport */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0" id="main-content-flow">
        
        {/* Dynamic Nav Indicator */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] shadow-sm flex items-center justify-between px-8 select-none shrink-0" id="top-nav-bar">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span>Kayaar ERP</span> &rsaquo; 
            <span className="text-[#2563EB] font-bold uppercase">{activeTab.replace("-", " ")}</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-[#1E293B]">
            <span className="bg-blue-50 text-[#2563EB] px-2.5 py-1 rounded inline-flex items-center gap-1.5 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full inline-block animate-ping"></span>
              API PORT: 5000 DEV ACTIVE
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-200 text-[#2563EB] font-bold flex items-center justify-center rounded-full border border-[#E2E8F0]">
                {db.currentUser.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-700">Acting User: {db.currentUser}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route views router */}
        <div className="flex-1 flex flex-col overflow-hidden" id="workspace-viewport">
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === "dashboard" && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" id="dashboard-tab">
              <PageHeader 
                category="System" 
                title="Management Dashboard" 
                description="Live transactional balances, credit indices, and activity audit streams." 
              />
              
              {/* Financial Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="dashboard-widgets-grid">
                
                <div className="bg-white border rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-[10px] uppercase font-bold text-slate-400">Cash in Hand</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-slate-800">
                    Rs. {cashAccountsTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Sum of cash on hand balances</p>
                </div>

                <div className="bg-white border rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <CreditCard className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Bank Assets</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-[#2563EB]">
                    Rs. {bankAccountsTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">IOB & auxiliary registered bank accounts</p>
                </div>

                <div className="bg-white border rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <Users className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Accounts</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-slate-800">{db.accounts.length} Heads</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Registered clients & overhead codes</p>
                </div>

                <div className="bg-white border rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <Activity className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-[10px] uppercase font-bold text-slate-400">Transactions Ledger</span>
                  </div>
                  <h3 className="font-mono text-lg font-bold text-[#166534]">{db.vouchers.length} Vouchers</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Total Journal, Cash, and RCM entries</p>
                </div>

              </div>

              {/* Combined Balance and Audit logging row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                
                {/* Visual Overview metrics */}
                <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Enterprise Financial Status Overview</h3>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between pb-2 border-b border-dotted">
                        <span>Total Domestic Subtotal Gross Revenue:</span>
                        <span className="text-[#166534] font-bold">Rs. {plStats.salesRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-dotted">
                        <span>Estimated Gross Margin Trading:</span>
                        <span>Rs. {plStats.grossProfit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-dotted">
                        <span>Corporate Net Operating Surplus:</span>
                        <span className="text-[#2563EB] font-bold">Rs. {plStats.netProfit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Liability Retentions Estimated:</span>
                        <span>Rs. {(plStats.salesRevenue * 0.05).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border p-3.5 rounded text-slate-500 text-[10px] mt-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Durable Local persistence engine synchronizes real-time reports instantly inside the AI Studio preview.</span>
                  </div>
                </div>

                {/* Audit Trail indicators */}
                <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg flex flex-col h-[320px] overflow-hidden">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">System audit trail security logs</h3>
                  <div className="flex-1 overflow-y-auto space-y-2 text-[10.5px]">
                    {db.auditLogs.map(log => (
                      <div key={log.id} className="p-2 border border-slate-100 rounded hover:bg-slate-50 font-mono">
                        <div className="flex justify-between items-center mb-1 font-bold">
                          <span className="text-[#2563EB]">{log.action}</span>
                          <span className="text-slate-400 text-[9px]">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600 font-medium mb-1">{log.details}</p>
                        <div className="text-right text-[9px] text-[#64748B] uppercase font-bold">USER: {log.userName}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNTS MASTER */}
          {activeTab === "accounts-master" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="accounts-master-tab">
              <PageHeader category="Masters" title="Accounts head Master Explorer" description="Create and configure ledger accounts, places, Opening Credit/Debit, and contact parameters." />
              <AccountMaster 
                type="accounts" 
                database={db}
                onSaveAccount={saveAccount}
                onDeleteAccount={deleteAccount}
              />
            </div>
          )}

          {/* TAB: GROUP MASTER */}
          {activeTab === "group-master" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="group-master-tab">
              <PageHeader category="Masters" title="Group Master" description="Define high-level account groupings like Assets, Liabilities, etc." />
              <GroupMaster
                database={db}
                onSaveGroup={saveGroup}
                onDeleteGroup={deleteGroup}
              />
            </div>
          )}

          {/* TAB: SUBGROUP MASTER */}
          {activeTab === "subgroup-master" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="subgroup-master-tab">
              <PageHeader category="Masters" title="Sub Group Master" description="Define sub-group hierarchies, Trial Balance mapping index, and Profit & Loss placement." />
              <SubGroupMaster
                database={db}
                onSave={saveSubGroup}
                onDelete={deleteSubGroup}
              />
            </div>
          )}

          {/* TAB: TDS MASTER */}
          {activeTab === "tds-master" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="tds-master-tab">
              <PageHeader category="Masters" title="TDS Type Master" description="Configure legal slab percentages for Tax Deducted at Source." />
              <TDSMaster
                database={db}
                onSave={saveTds}
                onDelete={deleteTds}
              />
            </div>
          )}

          {/* TAB: ST MASTER */}
          {activeTab === "st-master" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="st-master-tab">
              <PageHeader category="Masters" title="Service Tax Master" description="Configure service tax percentages and related accounts." />
              <ServiceTaxMaster
                database={db}
                onSave={saveServiceTax}
                onDelete={deleteServiceTax}
              />
            </div>
          )}

          {/* TAB: P&L SETTINGS */}
          {activeTab === "pl-settings" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="pl-settings-tab">
              <PageHeader category="Masters" title="Profit & Loss Settings" description="Configure mappings for the Profit & Loss statement." />
              <PLSettingsMaster
                database={db}
                onSave={savePlSetting}
                onDelete={deletePlSetting}
              />
            </div>
          )}

          {/* TAB: BS MAIN GROUP */}
          {activeTab === "bs-main-group" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="bs-main-group-tab">
              <PageHeader category="Masters" title="Balance Sheet Main Group" description="Manage main groups for the Balance Sheet report." />
              <BSMainGroupMaster
                database={db}
                onSave={saveBsMainGroup}
                onDelete={deleteBsMainGroup}
              />
            </div>
          )}

          {/* TAB: BS GROUP */}
          {activeTab === "bs-group" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="bs-group-tab">
              <PageHeader category="Masters" title="Balance Sheet Group" description="Manage sub-group configurations for the Balance Sheet." />
              <BSGroupMaster
                database={db}
                onSave={saveBsGroup}
                onDelete={deleteBsGroup}
              />
            </div>
          )}

          {/* TAB: BILL WISE OPENING */}
          {activeTab === "bill-wise-opening" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="bill-wise-opening-tab">
              <PageHeader category="Masters" title="Bill Wise Opening" description="Manage opening balances for individual bills." />
              <BillWiseOpeningMaster
                database={db}
                onSave={saveBillWiseOpening}
                onDelete={deleteBillWiseOpening}
              />
            </div>
          )}

          {/* TAB: REVERSE CHARGE MASTER */}
          {activeTab === "reverse-charge" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="reverse-charge-tab">
              <PageHeader category="Masters" title="Reverse Charge Master" description="Configure RCM formula layouts and input/output ledger mapping combinations." />
              <ReverseChargeMaster
                database={db}
                onSave={saveReverseType}
                onDelete={deleteReverseType}
              />
            </div>
          )}

          {/* TAB 5: JOURNAL VOUCHER ENTRY FORM */}
          {activeTab === "journal-voucher" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="jv-entry-tab">
              <PageHeader category="Vouchers" title="Journal Voucher Entry Sheet" description="Input structural bookkeeping adjustments, transfers, and double-entry postings." />
              <JournalVoucher 
                database={db} 
                onSaveVoucher={handleSaveVoucher} 
                onDeleteVoucher={deleteVoucher}
                onPrint={triggerPrintModal}
              />
            </div>
          )}

          {/* TAB 6: CASH & BANK PAYMENT */}
          {activeTab === "cash-payment" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="cp-entry-tab">
              <PageHeader category="Vouchers" title="Cash & Bank Payments registry" description="Log liquid expenditures against corresponding debit heads (generates printed vouchers)." />
              <CashPayment 
                database={db}
                mode="CP"
                onSaveVoucher={handleSaveVoucher}
                onDeleteVoucher={deleteVoucher}
                onPrint={triggerPrintModal}
              />
            </div>
          )}

          {/* TAB 6B: BANK PAYMENT */}
          {activeTab === "bank-payment" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="bp-entry-tab">
              <PageHeader category="Vouchers" title="Bank Payments registry" description="Manage and print specialized bank payment vouchers." />
              <BankPayment 
                database={db}
                onSaveVoucher={handleSaveVoucher}
                onDeleteVoucher={deleteVoucher}
              />
            </div>
          )}

          {/* TAB 7: CASH & BANK RECEIPTS */}
          {activeTab === "cash-receipt" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="cr-entry-tab">
              <PageHeader category="Vouchers" title="Cash & Bank Receipts collection" description="Post incoming liquidity balances paid into your drawers (such as refunds or domestic sales)." />
              <CashPayment 
                database={db}
                mode="CR"
                onSaveVoucher={handleSaveVoucher}
                onDeleteVoucher={deleteVoucher}
                onPrint={triggerPrintModal}
              />
            </div>
          )}

          {/* TAB 8: CONTRA ENTRY VOUCHER */}
          {activeTab === "contra-entry" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="contra-entry-tab">
              <PageHeader category="Vouchers" title="Contra Bank / Cash Transfers" description="Record liquid inter-account movements between vault drawers and active bank limit accounts." />
              <ContraEntry
                database={db}
                onSaveVoucher={handleSaveVoucher}
                onDeleteVoucher={deleteVoucher}
              />
            </div>
          )}

          {/* TAB 9: REVERSE BILL ENTRY (RCM INVOICES) */}
          {activeTab === "reverse-bill" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="reverse-bill-entry-tab">
              <PageHeader category="Vouchers" title="Reverse Charge (RCM) Bill entry" description="Evaluate material inventory imports, freight services, HSN code totals, and reverse GST percentages." />
              <ReverseBillEntry 
                database={db}
                onSaveReverseBill={saveVoucher}
                onDeleteReverseBill={deleteVoucher}
                onPrint={triggerPrintModal}
              />
            </div>
          )}

          {/* TAB: VOUCHER FIND */}
          {activeTab === "voucher-find" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="voucher-find-tab">
              <PageHeader category="Vouchers" title="Find Vouchers" description="Search and locate specific vouchers through detailed criteria filters." />
              <VoucherFind database={db} />
            </div>
          )}

          {/* TAB 10: PROVISIONS ENTRY AND NOTES */}
          {activeTab === "provisions-entry" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="provisions-tab">
              <PageHeader category="Vouchers" title="Provisions, Notes & Allocations" description="Record year-end provisioning totals, debit notes, credit notes, and closing accounts." />
              <Provisions 
                database={db}
                onSaveVoucher={handleSaveVoucher}
                onDeleteVoucher={deleteVoucher}
              />
            </div>
          )}

          {/* TAX FORMS ROUTING */}
          {activeTab === "c-form" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="c-form-tab">
              <PageHeader category="Tax Forms" title="C Form Register" description="Manage C Form declarations and invoice mapping." />
              <CForm database={db} onSave={saveCForm} onDelete={deleteCForm} />
            </div>
          )}
          {activeTab === "f-form" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="f-form-tab">
              <PageHeader category="Tax Forms" title="F Form Register" description="Manage F Form declarations and invoice mapping." />
              <FForm database={db} onSave={saveFForm} onDelete={deleteFForm} />
            </div>
          )}
          {activeTab === "h-form" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="h-form-tab">
              <PageHeader category="Tax Forms" title="H Form Register" description="Manage H Form declarations and invoice mapping." />
              <HForm database={db} onSave={saveHForm} onDelete={deleteHForm} />
            </div>
          )}
          {activeTab === "e1-form" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="e1-form-tab">
              <PageHeader category="Tax Forms" title="E1 Form Register" description="Manage E1 Form declarations." />
              <E1Form database={db} onSave={saveE1Form} onDelete={deleteE1Form} />
            </div>
          )}
          {activeTab === "c-form-purchase" && (
            <div className="flex-1 overflow-hidden flex flex-col" id="c-form-purchase-tab">
              <PageHeader category="Tax Forms" title="C Form Purchase" description="Manage C Form Purchase records and bills." />
              <CFormPurchase database={db} onSave={saveCFormPurchase} onDelete={deleteCFormPurchase} />
            </div>
          )}

          {/* --- REPORT VIEWERS --- */}
          {activeTab === "general-ledger" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <PageHeader category="Reports" title="Corporate General Ledger Statement" description="Audit detailed debit/credit postings, initial balances, and running calculations over custom periods." />
              <GeneralLedger database={db} activeReport="ledger" onPrint={triggerPrintModal} />
            </div>
          )}

          {activeTab === "trial-balance" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <PageHeader category="Reports" title="Live Trial Balance sheet" description="Cumulative closing debit and credit balance sheet calculations for absolute mathematical validation." />
              <GeneralLedger database={db} activeReport="trial" onPrint={triggerPrintModal} />
            </div>
          )}

          {activeTab === "profit-loss" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <PageHeader category="Reports" title="Profit & Loss margin Statement" description="Trading reports, gross profit lines, administrative overheads expenses, and net corporate profit." />
              <GeneralLedger database={db} activeReport="pl" onPrint={triggerPrintModal} />
            </div>
          )}

          {activeTab === "balance-sheet" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <PageHeader category="Reports" title="Combined Corporate Balance Sheet" description="Consolidated capital, reserves, liabilities breakdown, and corporate property asset balances." />
              <GeneralLedger database={db} activeReport="bs" onPrint={triggerPrintModal} />
            </div>
          )}

          {activeTab === "sales-tax" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <PageHeader category="Reports" title="Government TDS and Sales Tax statements" description="Export statutory PAN card transaction retentions and tax certificates." />
              <GeneralLedger database={db} activeReport="sales-tax" onPrint={triggerPrintModal} />
            </div>
          )}

          {/* Audit Logs tab */}
          {activeTab === "audit-logs" && (
            <div className="flex-1 overflow-y-auto p-6" id="audit-logs-tab">
              <PageHeader category="System" title="Audit Trail Security Logs" description="Full historical logs of actions committed by various system users." />
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm max-w-4xl mx-auto mt-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b text-[#64748B] font-bold uppercase tracking-wider">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Detail</th>
                      <th className="p-4 text-right">Acting User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] font-mono text-[11px] leading-relaxed">
                    {db.auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-4 text-slate-400">{log.timestamp}</td>
                        <td className="p-4 text-blue-600 font-bold">{log.action}</td>
                        <td className="p-4 text-slate-600">{log.details}</td>
                        <td className="p-4 text-right font-bold text-slate-800">{log.userName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* --- HIGH-FIDELITY RETRO frmPrint DOT MATRIX PRINT VIEW MODAL --- */}
      {isPrintModalOpen && printedVoucher && (
        <div className="fixed inset-0 bg-[#0F172A]/75 flex items-center justify-center z-50 p-4 overflow-y-auto select-none" id="frmPrint-modal">
          <div className="bg-[#FAF8F5] border border-stone-300 rounded shadow-2xl p-8 max-w-3xl w-full text-[#1E293B] relative" style={{ fontFamily: "Courier New, Courier, monospace" }}>
            
            {/* Modal Closer */}
            <div className="absolute top-4 right-4 flex items-center gap-2 font-sans text-xs">
              <button 
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded flex items-center gap-1 font-bold font-sans cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Trigger System Print
              </button>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 bg-stone-200/50 p-1.5 rounded-full cursor-pointer flex items-center justify-center w-8 h-8"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vintage dot matrix paper header */}
            <div className="text-center font-bold text-xs uppercase scroll-py-1">
              <div>========================================================================</div>
              <div className="text-sm font-bold tracking-widest text-[#2563EB]">KAYAAR EXPORTS PRIVATE LIMITED</div>
              <div>COIMBATORE ROAD, K.R.NAGAR, KOVILPATTI - 628503</div>
              <div>========================================================================</div>
              
              {printedVoucher.type === "REPORT" ? (
                <div className="mt-2 font-extrabold text-[13px] bg-stone-200/50 py-1 font-sans">
                  *** {printedVoucher.reportType.toUpperCase()} FINANCIAL BOARD REPORT ***
                </div>
              ) : (
                <div className="mt-2 font-extrabold text-[13px] bg-stone-200/50 py-1 font-sans">
                  *** {printedVoucher.type === "JV" ? "BILL JOURNAL VOUCHER" : `${printedVoucher.type} CASHBOOK VOUCHER`} ***
                </div>
              )}
              
              <div className="text-left text-[11px] grid grid-cols-2 gap-y-1 my-4 normal-case font-normal text-slate-700">
                <div>Vou.No:  <span className="font-bold font-serif">{printedVoucher.voucherNo || printedVoucher.billNo || "96"}</span></div>
                <div className="text-right">Vou.Date: <span className="font-bold">{printedVoucher.voucherDate || printedVoucher.accDate || "17/04/2026"}</span></div>
                <div>Bill.No: <span className="font-bold">{printedVoucher.billNo || "N/A"}</span></div>
                <div className="text-right">Bill.Date:<span className="font-bold">{printedVoucher.billDate || "N/A"}</span></div>
                {printedVoucher.chequeNo && (
                  <>
                    <div>Cheque No: <span className="font-bold">{printedVoucher.chequeNo}</span></div>
                    <div className="text-right">Cheque Name: <span className="font-bold">{printedVoucher.chequeName}</span></div>
                  </>
                )}
              </div>
              
              <div>------------------------------------------------------------------------</div>
            </div>

            {/* Printable contents table */}
            <div className="mt-4 text-[11.5px] leading-relaxed">
              
              {printedVoucher.type === "REPORT" ? (
                <div className="p-4 bg-white/60 border rounded font-mono text-[10.5px]">
                  <p className="font-bold text-center mb-2">{printedVoucher.reportType.toUpperCase()} STATEMENT SPECIFICS</p>
                  <p>From limits: {printedVoucher.fromDate || "17/04/2026"}</p>
                  <p>To limits: {printedVoucher.toDate || "17/10/2026"}</p>
                  <p>Consolidated by: AccuFlow ERP Engine</p>
                  <p className="text-[9.5px] text-slate-400 mt-2">To view full formatted tabular ledgers, print the dot matrix layout or invoke Excel Export configurations.</p>
                </div>
              ) : (
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="font-bold">
                      <th className="pb-2">Sl.No</th>
                      <th className="pb-2">Account Description Head</th>
                      <th className="pb-2 text-right">Debit (Dr.)</th>
                      <th className="pb-2 text-right">Credit (Cr.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printedVoucher.items && printedVoucher.items.map((line, idx) => (
                      <tr key={idx} className="border-b border-dashed border-stone-200">
                        <td className="py-1">{idx + 1}</td>
                        <td className="py-1">
                          <span className="font-bold block">{line.accountName}</span>
                          {line.narration && <span className="text-[10px] text-stone-500 block max-w-sm truncate">{line.narration}</span>}
                        </td>
                        <td className="py-1 text-right">{(parseFloat(line.debit || line.amount || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-1 text-right">{(parseFloat(line.credit || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Print Summary Footer specifics of printable accounting files */}
              <div className="mt-6 text-right font-bold space-y-1">
                <div>-----------------------------------------------------</div>
                <div>Voucher Total: Rs. {(printedVoucher.totalAmount || printedVoucher.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                <div className="text-[10px] text-stone-500 font-normal uppercase italic mt-1.5">
                  *** Rs. {(printedVoucher.totalAmount || printedVoucher.grandTotal || 0).toLocaleString()} ONLY ***
                </div>
                <div>-----------------------------------------------------</div>
              </div>

              {/* Memo narration */}
              {printedVoucher.narration && (
                <div className="mt-4 p-2 bg-stone-100 rounded text-[10px] text-stone-500 leading-relaxed font-sans border">
                  <strong>VOUCHER REMARKS MEMO MEMORANDUM:</strong> <br/>
                  {printedVoucher.narration}
                </div>
              )}

            </div>

            {/* Vintage sign-offs on dotted ledger layout */}
            <div className="border-t border-dashed border-stone-400 pt-8 mt-12 text-[10px] text-stone-500 flex justify-between gap-4 font-mono select-none">
              <div>
                <span>PREPARED & VERIFIED BY</span>
                <div className="w-32 border-b border-stone-400 border-dashed mt-6"></div>
              </div>
              <div>
                <span>CHECKED BY: MD</span>
                <div className="w-32 border-b border-stone-400 border-dashed mt-6"></div>
              </div>
              <div className="text-right">
                <span>AUTHORISED SIGNATORY OFFICIAL</span>
                <div className="w-32 border-b border-stone-400 border-dashed mt-6 ml-auto"></div>
              </div>
            </div>

            {/* Printing guidance info */}
            <div className="text-center text-[9px] text-stone-400 mt-8">
              Printed on {new Date().toLocaleString()} | AccuFlow Desktop Emulator Pro
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
