import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, Database, ListFilter } from 'lucide-react';
import AccountMaster from './masters/AccountMaster';
import GroupMaster from './masters/GroupMaster';
import SubGroupMaster from './masters/SubGroupMaster';
import TDSMaster from './masters/TDSMaster';
import ServiceTaxMaster from './masters/ServiceTaxMaster';
import PLSettingsMaster from './masters/PLSettingsMaster';
import BSMainGroupMaster from './masters/BSMainGroupMaster';
import BSGroupMaster from './masters/BSGroupMaster';
import BillWiseOpeningMaster from './masters/BillWiseOpeningMaster';
import ReverseChargeMaster from './masters/ReverseChargeMaster';

const BASE_URL = "http://localhost:5000";

export default function MastersSection({
  accounts, groups, subgroups, tdsMasters, serviceTaxMasters,
  plSettings, bsMainGroups, bsGroups, billWiseOpenings, reverseTypes,
  setAccounts, setGroups, setSubgroups, setTdsMasters, setServiceTaxMasters,
  setPlSettings, setBsMainGroups, setBsGroups, setBillWiseOpenings, setReverseTypes,
  logAudit, activeTab = 'accounts'
}) {
  
  const handleSaveTds = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setTdsMasters(prev => {
          const idx = prev.findIndex(i => i.code === result.data.code);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save TDS:", err);
    }
  };

  const handleDeleteTds = async (code) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tds/${code}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setTdsMasters(prev => prev.filter(i => i.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete TDS:", err);
    }
  };

  const handleSaveSubGroup = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/subgroups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setSubgroups(prev => {
          const idx = prev.findIndex(i => i.id === result.data.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save SubGroup:", err);
    }
  };

  const handleDeleteSubGroup = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/subgroups/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setSubgroups(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete SubGroup:", err);
    }
  };

  const handleSaveServiceTax = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/servicetax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setServiceTaxMasters(prev => {
          const idx = prev.findIndex(i => i.code === result.data.code);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save Service Tax:", err);
    }
  };

  const handleDeleteServiceTax = async (code) => {
    try {
      const res = await fetch(`${BASE_URL}/api/servicetax/${code}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setServiceTaxMasters(prev => prev.filter(i => i.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete Service Tax:", err);
    }
  };

  const handleSavePlSetting = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/plsettings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setPlSettings(prev => {
          const idx = prev.findIndex(i => i.id === result.data.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save PL Setting:", err);
    }
  };

  const handleDeletePlSetting = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/plsettings/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setPlSettings(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete PL Setting:", err);
    }
  };

  const handleSaveBsMainGroup = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bsmaingroups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setBsMainGroups(prev => {
          const idx = prev.findIndex(i => i.code === result.data.code);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save BS Main Group:", err);
    }
  };

  const handleDeleteBsMainGroup = async (code) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bsmaingroups/${code}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setBsMainGroups(prev => prev.filter(i => i.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete BS Main Group:", err);
    }
  };

  const handleSaveBsGroup = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bsgroups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setBsGroups(prev => {
          const idx = prev.findIndex(i => i.code === result.data.code);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save BS Group:", err);
    }
  };

  const handleDeleteBsGroup = async (code) => {
    try {
      const res = await fetch(`${BASE_URL}/api/bsgroups/${code}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setBsGroups(prev => prev.filter(i => i.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete BS Group:", err);
    }
  };

  const handleSaveReverseCharge = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reverse-charges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setReverseTypes(prev => {
          const idx = prev.findIndex(i => i.code === result.data.code);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = result.data;
            return next;
          }
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error("Failed to save Reverse Charge:", err);
    }
  };

  const handleDeleteReverseCharge = async (code) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reverse-charges/${code}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setReverseTypes(prev => prev.filter(i => i.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete Reverse Charge:", err);
    }
  };

  const fullDB = { accounts, groups, subgroups, tdsMasters, serviceTaxMasters, plSettings, bsMainGroups, bsGroups, reverseTypes, billWiseOpenings };

  return (
      activeTab === 'subgroup-master' || activeTab === 'subgroup' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <SubGroupMaster database={fullDB} onSave={handleSaveSubGroup} onDelete={handleDeleteSubGroup} />
        </div>
      ) : activeTab === 'tds-master' || activeTab === 'tds' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <TDSMaster database={fullDB} onSave={handleSaveTds} onDelete={handleDeleteTds} />
        </div>
      ) : activeTab === 'st-master' || activeTab === 'servicetax' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <ServiceTaxMaster database={fullDB} onSave={handleSaveServiceTax} onDelete={handleDeleteServiceTax} />
        </div>
      ) : activeTab === 'pl-settings' || activeTab === 'plsettings' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <PLSettingsMaster database={fullDB} onSave={handleSavePlSetting} onDelete={handleDeletePlSetting} />
        </div>
      ) : activeTab === 'bs-main-group' || activeTab === 'bsmain' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <BSMainGroupMaster database={fullDB} onSave={handleSaveBsMainGroup} onDelete={handleDeleteBsMainGroup} />
        </div>
      ) : activeTab === 'bs-group' || activeTab === 'bsgroup' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <BSGroupMaster database={fullDB} onSave={handleSaveBsGroup} onDelete={handleDeleteBsGroup} />
        </div>
      ) : activeTab === 'bill-wise-opening' || activeTab === 'billwise' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <BillWiseOpeningMaster database={fullDB} onSave={setBillWiseOpenings} onDelete={(id) => setBillWiseOpenings(prev => prev.filter(x => x.id !== id))} />
        </div>
      ) : activeTab === 'reverse-charge' || activeTab === 'reverse' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <ReverseChargeMaster database={fullDB} onSave={handleSaveReverseCharge} onDelete={handleDeleteReverseCharge} />
        </div>
      ) : activeTab === 'group-master' || activeTab === 'group' ? (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <GroupMaster database={fullDB} onSaveGroup={setGroups} onDeleteGroup={(id) => setGroups(prev => prev.filter(x => x.id !== id))} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-lg shadow-xs bg-white">
          <AccountMaster type="accounts" database={fullDB} onSaveAccount={setAccounts} onDeleteAccount={(code) => setAccounts(prev => prev.filter(a => a.code !== code))} />
        </div>
      )
  );
}
