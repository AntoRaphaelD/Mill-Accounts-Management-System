import { createSeedDatabase } from "./sampleData";

// Professional ERP database layer with dynamic server API synchronisation and optimistic local state cache.
// Keeps calculated accounting methods for ledger, cashbook, trial balance, P&L, and balance sheet active.

const BASE_URL = "http://localhost:5000"; // Ensure this matches your backend port

// The dynamic local cache state, initialized to empty and filled on runtime module load from the Express backend
let dbState = createSeedDatabase();

const listeners = new Set();

function withSeedFallback(data) {
  const seed = createSeedDatabase();
  const merged = { ...seed, ...data };
  for (const key of Object.keys(seed)) {
    if (Array.isArray(seed[key]) && (!Array.isArray(data[key]) || data[key].length === 0)) {
      merged[key] = seed[key];
    }
  }
  return merged;
}

export function subscribeToDB(listener) {
  listeners.add(listener);
  // Send current cache state immediately to the listener
  listener({ ...dbState });
  return () => {
    listeners.delete(listener);
  };
}

function notifyDB() {
  listeners.forEach(l => l({ ...dbState }));
}

export function getDB() {
  return dbState;
}

// Background API Synchronizer helper
async function apiCall(url, method = "POST", body = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" }
    };
    if (body) options.body = JSON.stringify(body);
    
    // Use the full URL to ensure it hits the backend on port 5000
    const res = await fetch(`${BASE_URL}${url}`, options);
    const result = await res.json();
    console.log(`[API Response] ${url}:`, result);
    return result;
  } catch (error) {
    console.error(`[API Error] ${url}:`, error);
  }
}

// Immediately on module load, fire off a query to pull the latest state from the backend
fetch(`${BASE_URL}/api/db`) // Add the base URL here
  .then(res => {
    if (!res.ok) throw new Error("Could not fetch ERP db");
    return res.json();
  })
  .then(data => {
    if (data && typeof data === "object") {
      dbState = withSeedFallback(data);
      notifyDB();
    }
  })
  .catch(err => {
    console.error("Critical: Could not connect to fullstack backend.", err);
  });

// Active user APIs
export function setCurrentUser(user) {
  dbState.currentUser = user || "SIVA";
  addAuditLog("USER LOGGED", `Switched acting user to ${dbState.currentUser}`);
  apiCall("/api/user", "POST", { user });
  notifyDB();
}

export function getCurrentUser() {
  return dbState.currentUser;
}

// Audit Log APIs
export function addAuditLog(action, details) {
  const log = {
    id: "LOG" + Date.now() + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    userName: dbState.currentUser,
    action,
    details
  };
  dbState.auditLogs.unshift(log);
  if (dbState.auditLogs.length > 200) {
    dbState.auditLogs.pop();
  }
  apiCall("/api/audit", "POST", { action, details });
  notifyDB();
}

// Group Operations
export function getGroups() { return dbState.groups; }
export function saveGroup(group) {
  const idx = dbState.groups.findIndex(g => g.id === group.id);
  let payload = { ...group };
  if (idx >= 0) {
    dbState.groups[idx] = payload;
  } else {
    payload.id = "G" + Date.now();
    dbState.groups.push(payload);
  }
  addAuditLog("GROUP SAVE", `Saved Group ${payload.name}`);
  apiCall("/api/groups", "POST", payload);
  notifyDB();
}
export function deleteGroup(id) {
  dbState.groups = dbState.groups.filter(g => g.id !== id);
  addAuditLog("GROUP DELETE", `Deleted Group ID ${id}`);
  apiCall(`/api/groups/${id}`, "DELETE");
  notifyDB();
}

// SubGroups Operations
export function getSubGroups() { return dbState.subGroups; }
export async function saveSubGroup(sg) {
  const result = await apiCall("/api/subgroups", "POST", sg);

  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.subGroups.findIndex(s => s.id === savedItem.id);

    if (idx >= 0) {
      dbState.subGroups[idx] = savedItem;
    } else {
      dbState.subGroups.push(savedItem);
    }
    
    addAuditLog("SUBGROUP SAVE", `Saved SubGroup: ${savedItem.name}`);
    notifyDB();
  } else {
    console.error("SubGroup save failed:", result);
  }
}
export function deleteSubGroup(id) {
  dbState.subGroups = dbState.subGroups.filter(s => s.id !== id);
  addAuditLog("SUBGROUP DELETE", `Deleted SubGroup ID ${id}`);
  apiCall(`/api/subgroups/${id}`, "DELETE");
  notifyDB();
}

// Accounts Operations
export function getAccounts() { return dbState.accounts; }
export function saveAccount(acc) {
  const idx = dbState.accounts.findIndex(a => a.code === acc.code);
  if (idx >= 0) {
    dbState.accounts[idx] = acc;
  } else {
    dbState.accounts.push(acc);
  }
  addAuditLog("ACCOUNT SAVE", `Saved Account ${acc.name} (${acc.code})`);
  apiCall("/api/accounts", "POST", acc);
  notifyDB();
}
export function deleteAccount(code) {
  dbState.accounts = dbState.accounts.filter(a => a.code !== code);
  addAuditLog("ACCOUNT DELETE", `Deleted Account Code ${code}`);
  apiCall(`/api/accounts/${code}`, "DELETE");
  notifyDB();
}

// Vouchers Operations
export function getVouchers() { return dbState.vouchers; }
export function saveVoucher(v) {
  const idx = dbState.vouchers.findIndex(item => item.id === v.id);
  
  // Calculate Totals elegantly
  let calculatedTotal = 0;
  if(v.items && v.items.length) {
    calculatedTotal = v.items.reduce((sum, current) => sum + (parseFloat(current.debit) || 0), 0);
    if (calculatedTotal === 0) {
      calculatedTotal = v.items.reduce((sum, current) => sum + (parseFloat(current.credit) || 0), 0);
    }
  }

  const voucherData = {
    ...v,
    totalAmount: calculatedTotal,
    userName: dbState.currentUser,
    createdAt: v.createdAt || new Date().toISOString()
  };

  if (idx >= 0) {
    dbState.vouchers[idx] = voucherData;
    addAuditLog("VOUCHER UPDATE", `Updated ${v.type} Voucher No ${v.voucherNo}`);
  } else {
    voucherData.id = "V" + Date.now() + Math.floor(Math.random()*1000);
    dbState.vouchers.unshift(voucherData);
    addAuditLog("VOUCHER ADD", `Added ${v.type} Voucher No ${v.voucherNo}`);
  }
  apiCall("/api/vouchers", "POST", voucherData);
  notifyDB();
  return voucherData;
}
export function deleteVoucher(id) {
  const v = dbState.vouchers.find(item => item.id === id);
  dbState.vouchers = dbState.vouchers.filter(item => item.id !== id);
  if (v) {
    addAuditLog("VOUCHER DELETE", `Deleted ${v.type} Voucher No ${v.voucherNo}`);
  }
  apiCall(`/api/vouchers/${id}`, "DELETE");
  notifyDB();
}

// TDS Operations
export function getTds() { return dbState.tds; }
export async function saveTds(item) {
  // 1. Call the backend first to get the canonical, saved object
  const result = await apiCall("/api/tds", "POST", item);

  // 2. If the save was successful, update the local state
  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.tds.findIndex(t => t.code === savedItem.code);

    if (idx >= 0) {
      // Update existing item
      dbState.tds[idx] = savedItem;
    } else {
      // Add new item
      dbState.tds.push(savedItem);
    }
    
    addAuditLog("TDS MASTER SAVE", `Saved TDS: ${savedItem.name} (${savedItem.code})`);
    notifyDB(); // 3. Notify the UI of the change
  } else {
    console.error("TDS save failed:", result);
    // Here you could add logic to show an error to the user
    alert("Failed to save TDS record to the server.");
  }
}
export function deleteTds(code) {
  dbState.tds = dbState.tds.filter(t => t.code !== code);
  addAuditLog("TDS MASTER DELETE", `Deleted TDS code ${code}`);
  apiCall(`/api/tds/${code}`, "DELETE");
  notifyDB();
}

// Service Tax Operations
export function getServiceTax() { return dbState.serviceTax; }
export async function saveServiceTax(item) {
  const result = await apiCall("/api/servicetax", "POST", item);

  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.serviceTax.findIndex(s => s.code === savedItem.code);

    if (idx >= 0) {
      dbState.serviceTax[idx] = savedItem;
    } else {
      dbState.serviceTax.push(savedItem);
    }
    
    addAuditLog("ST MASTER SAVE", `Saved Service Tax rate: ${savedItem.name}`);
    notifyDB();
  } else {
    console.error("Service Tax save failed:", result);
  }
}
export function deleteServiceTax(code) {
  dbState.serviceTax = dbState.serviceTax.filter(s => s.code !== code);
  addAuditLog("ST MASTER DELETE", `Deleted Service Tax code ${code}`);
  apiCall(`/api/servicetax/${code}`, "DELETE");
  notifyDB();
}

// P&L Configuration Operations
export function getPlSettings() { return dbState.plSettings; }
export async function savePlSetting(item) {
  const result = await apiCall("/api/plsettings", "POST", item);

  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.plSettings.findIndex(p => p.id === savedItem.id);

    if (idx >= 0) {
      dbState.plSettings[idx] = savedItem;
    } else {
      dbState.plSettings.push(savedItem);
    }
    
    addAuditLog("PL SETTINGS SAVE", `Saved PL Settings configuration for ${savedItem.groupDescription}`);
    notifyDB();
  } else {
    console.error("P&L Settings save failed:", result);
  }
}
export function deletePlSetting(id) {
  dbState.plSettings = dbState.plSettings.filter(p => p.id !== id);
  addAuditLog("PL SETTINGS DELETE", `Deleted PL Settings ID ${id}`);
  apiCall(`/api/plsettings/${id}`, "DELETE");
  notifyDB();
}

// Balance Sheet Operations
export function getBsMainGroups() { return dbState.bsMainGroups; }
export async function saveBsMainGroup(item) {
  const result = await apiCall("/api/bsmaingroups", "POST", item);
  
  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.bsMainGroups.findIndex(b => b.code === savedItem.code);
    if (idx >= 0) {
      dbState.bsMainGroups[idx] = savedItem;
    } else {
      dbState.bsMainGroups.push(savedItem);
    }
    addAuditLog("BS MAIN GROUP SAVE", `Saved BS Main Group: ${savedItem.mainGroup}`);
    notifyDB();
  } else {
    console.error("BS Main Group save failed:", result);
  }
}

export function deleteBsMainGroup(code) {
  dbState.bsMainGroups = dbState.bsMainGroups.filter(b => b.code !== code);
  apiCall(`/api/bsmaingroups/${code}`, "DELETE");
  notifyDB();
}

export function getBsGroups() { return dbState.bsGroups; }
export async function saveBsGroup(item) {
  const result = await apiCall("/api/bsgroups", "POST", item);
  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.bsGroups.findIndex(b => b.code === savedItem.code);
    if (idx >= 0) {
      dbState.bsGroups[idx] = savedItem;
    } else {
      dbState.bsGroups.push(savedItem);
    }
    addAuditLog("BS GROUP SAVE", `Saved BS Group: ${savedItem.bsGroup}`);
    notifyDB();
  } else {
    console.error("BS Group save failed:", result);
  }
}
export function deleteBsGroup(code) {
  dbState.bsGroups = dbState.bsGroups.filter(b => b.code !== code);
  apiCall(`/api/bsgroups/${code}`, "DELETE");
  notifyDB();
}

// Reverse Charge RCM Operations
export function getReverseTypes() { return dbState.reverseTypes; }
export async function saveReverseType(item) {
  const result = await apiCall("/api/reverse-charges", "POST", item);
  if (result?.success && result.data) {
    const savedItem = result.data;
    const idx = dbState.reverseTypes.findIndex(r => r.code === savedItem.code);
    if (idx >= 0) {
      dbState.reverseTypes[idx] = savedItem;
    } else {
      dbState.reverseTypes.push(savedItem);
    }
    addAuditLog("REVERSE CHARGE SAVE", `Saved RCM: ${savedItem.purchaseType}`);
    notifyDB();
  } else {
    console.error("Reverse Charge save failed:", result);
  }
}
export function deleteReverseType(code) {
  dbState.reverseTypes = dbState.reverseTypes.filter(r => r.code !== code);
  apiCall(`/api/reverse-charges/${code}`, "DELETE");
  notifyDB();
}

export function getReverseBills() { return dbState.reverseBills; }
export function saveReverseBill(item) {
  const idx = dbState.reverseBills.findIndex(r => r.id === item.id);
  let payload = { ...item };
  if (idx >= 0) {
    dbState.reverseBills[idx] = payload;
  } else {
    payload.id = "RB" + Date.now();
    dbState.reverseBills.unshift(payload);
  }
  addAuditLog("REVERSE BILL SAVE", `Saved RCM Bill for ${payload.partyName}`);
  apiCall("/api/reverse-bills", "POST", payload);
  notifyDB();
}
export function deleteReverseBill(id) {
  dbState.reverseBills = dbState.reverseBills.filter(r => r.id !== id);
  apiCall(`/api/reverse-bills/${id}`, "DELETE");
  notifyDB();
}

// Bill Wise Opening Operations
export function getBillWiseOpenings() { return dbState.billWiseOpenings; }
export function saveBillWiseOpening(item) {
  const idx = dbState.billWiseOpenings.findIndex(b => b.id === item.id);
  let payload = { ...item };
  if (idx >= 0) {
    dbState.billWiseOpenings[idx] = payload;
  } else {
    payload.id = "BWO" + Date.now();
    dbState.billWiseOpenings.push(payload);
  }
  apiCall("/api/bill-wise-openings", "POST", payload);
  notifyDB();
}
export function deleteBillWiseOpening(id) {
  dbState.billWiseOpenings = dbState.billWiseOpenings.filter(b => b.id !== id);
  apiCall(`/api/bill-wise-openings/${id}`, "DELETE");
  notifyDB();
}

// Closing Stock Operations
export function getClosingStock() { return dbState.closingStock; }
export function saveClosingStock(item) {
  const idx = dbState.closingStock.findIndex(c => c.id === item.id);
  let payload = { ...item };
  if (idx >= 0) {
    dbState.closingStock[idx] = payload;
  } else {
    payload.id = "CS" + Date.now();
    dbState.closingStock.push(payload);
  }
  apiCall("/api/closing-stocks", "POST", payload);
  notifyDB();
}
export function deleteClosingStock(id) {
  dbState.closingStock = dbState.closingStock.filter(c => c.id !== id);
  apiCall(`/api/closing-stocks/${id}`, "DELETE");
  notifyDB();
}


// --- CALCULATED ACCOUNTING ENGINE ---

// Generates general ledger lines for an account with start/end date
export function computeGeneralLedgerRange(accountCode, fromStr, toStr) {
  const acc = dbState.accounts.find(a => a.code === accountCode);
  if (!acc) return { account: null, lines: [], openingBalance: 0, endingBalance: 0 };

  const fromDate = new Date(fromStr || "1970-01-01");
  const toDate = new Date(toStr || "9999-12-31");

  // Initial opening balances from master
  let opBal = (acc.openingDebit || 0) - (acc.openingCredit || 0);

  // Filter vouchers that target this account
  const list = [];
  const sortedVrs = [...dbState.vouchers].sort((a,b) => new Date(a.voucherDate).getTime() - new Date(b.voucherDate).getTime());

  for (const v of sortedVrs) {
    const vDate = new Date(v.voucherDate);
    const targetedLine = v.items ? v.items.filter(item => item.accountCode === accountCode) : [];

    for (const item of targetedLine) {
      const lineDebit = parseFloat(item.debit) || 0;
      const lineCredit = parseFloat(item.credit) || 0;

      if (vDate < fromDate) {
        // Accumulate into opening balance if preceding requested start date
        opBal += (lineDebit - lineCredit);
      } else if (vDate <= toDate) {
        list.push({
          voucherId: v.id,
          voucherNo: v.voucherNo,
          voucherDate: v.voucherDate,
          type: v.type,
          narration: item.narration || v.narration,
          debit: lineDebit,
          credit: lineCredit,
          rawItem: item
        });
      }
    }
  }

  // Calculate ongoing balances in the range
  let bal = opBal;
  const lines = list.map(line => {
    bal += (line.debit - line.credit);
    return {
      ...line,
      balance: bal
    };
  });

  return {
    account: acc,
    lines,
    openingBalance: opBal,
    endingBalance: bal
  };
}

// Compute Trial Balance for all accounts at a given date
export function computeTrialBalance(toDateStr) {
  const toDate = new Date(toDateStr || "9999-12-31");

  const results = dbState.accounts.map(acc => {
    let balance = (acc.openingDebit || 0) - (acc.openingCredit || 0);

    for (const v of dbState.vouchers) {
      if (new Date(v.voucherDate) <= toDate) {
        if(v.items) {
          for (const item of v.items) {
            if (item.accountCode === acc.code) {
              balance += ((parseFloat(item.debit) || 0) - (parseFloat(item.credit) || 0));
            }
          }
        }
      }
    }

    return {
      code: acc.code,
      name: acc.name,
      subGroupName: acc.subGroupName,
      groupName: acc.groupName,
      balance,
      debit: balance > 0 ? balance : 0,
      credit: balance < 0 ? Math.abs(balance) : 0
    };
  });

  const filtered = results.filter(r => r.balance !== 0);
  const totalDebit = filtered.reduce((s, r) => s + r.debit, 0);
  const totalCredit = filtered.reduce((s, r) => s + r.credit, 0);

  return {
    accounts: filtered,
    totalDebit,
    totalCredit
  };
}

// Generate Cash Book reports (Page 10, 11) for CASH-ON-HAND ledger (like CASH - MILL)
export function computeCashBook(cashAccountCode = "1001007", fromStr, toStr) {
  const ledgerResult = computeGeneralLedgerRange(cashAccountCode, fromStr, toStr);
  
  // Pivot debit (receipts) vs credit (payments)
  const receipts = [];
  const payments = [];

  for (const line of ledgerResult.lines) {
    if (line.debit > 0) {
      receipts.push(line);
    }
    if (line.credit > 0) {
      payments.push(line);
    }
  }

  return {
    account: ledgerResult.account,
    lines: ledgerResult.lines,
    openingBalance: ledgerResult.openingBalance,
    endingBalance: ledgerResult.endingBalance,
    receipts,
    payments
  };
}

// Generates Profit & Loss Statement (Page 18)
export function computeProfitLoss(fromStr, toStr) {
  const tb = computeTrialBalance(toStr);
  
  // Categorize accounts based on their Group definitions
  // Direct Incomes, Sales -> Revenue
  // Direct Expenses, Opening Stock -> Direct Costs
  // Indirect Incomes -> Other Income
  // Indirect Expenses -> Indirect Costs
  
  let salesRevenue = 0;
  const salesDetails = [];
  let otherIncome = 0;
  const otherIncomeDetails = [];
  let directExpenses = 0;
  const directExpDetails = [];
  let administrativeExpenses = 0;
  const adminExpDetails = [];

  for (const item of tb.accounts) {
    const acc = dbState.accounts.find(a => a.code === item.code);
    const grp = dbState.groups.find(g => g.name === acc?.groupName);

    const mainCategory = grp ? grp.mainDescription : "";

    if (mainCategory === "Incomes" || acc?.groupName === "Sales Accounts") {
      const revenueVal = Math.abs(item.balance);
      if (acc?.groupName === "Sales Accounts") {
        salesRevenue += revenueVal;
        salesDetails.push({ name: acc.name, code: acc.code, value: revenueVal });
      } else {
        otherIncome += revenueVal;
        otherIncomeDetails.push({ name: acc.name, code: acc.code, value: revenueVal });
      }
    } else if (mainCategory === "Expenses") {
      const expenseVal = Math.abs(item.balance);
      if (acc?.groupName === "Direct Expenses") {
        directExpenses += expenseVal;
        directExpDetails.push({ name: acc.name, code: acc.code, value: expenseVal });
      } else {
        administrativeExpenses += expenseVal;
        adminExpDetails.push({ name: acc.name, code: acc.code, value: expenseVal });
      }
    }
  }

  // Dynamic Stock values
  let openingStock = 0;
  const openingStockAccounts = dbState.accounts.filter(a => a.subGroupName === "OPENING STOCK");
  if (openingStockAccounts.length > 0) {
    openingStock = openingStockAccounts.reduce((sum, a) => sum + (parseFloat(a.openingDebit) || 0) - (parseFloat(a.openingCredit) || 0), 0);
  }
  let closingStock = 0;
  if (dbState.closingStock && dbState.closingStock.length > 0) {
    closingStock = dbState.closingStock.reduce((sum, item) => sum + (parseFloat(item.credit) || parseFloat(item.debit) || 0), 0);
  }

  const totalDirectCosts = directExpenses + openingStock;
  const grossProfit = salesRevenue + closingStock - totalDirectCosts;
  const netProfit = grossProfit + otherIncome - administrativeExpenses;

  return {
    salesRevenue,
    salesDetails,
    otherIncome,
    otherIncomeDetails,
    openingStock,
    closingStock,
    directExpenses,
    directExpDetails,
    totalDirectCosts,
    grossProfit,
    administrativeExpenses,
    adminExpDetails,
    netProfit
  };
}

// Generates Balance Sheet Statement (Page 21)
export function computeBalanceSheet(toDateStr) {
  const tb = computeTrialBalance(toDateStr);
  const pl = computeProfitLoss("1970-01-01", toDateStr);

  const liabilities = [];
  const assets = [];

  // Categorize
  let shareCapital = 0;
  let reservesAndSurplus = 0;
  let currentLiabilities = 0;
  let fixedAssets = 0;
  let currentAssets = 0;
  let bankBalances = 0;
  let cashOnHand = 0;

  for (const item of tb.accounts) {
    const acc = dbState.accounts.find(a => a.code === item.code);
    const grp = dbState.groups.find(g => g.name === acc?.groupName);
    
    const mainCategory = grp ? grp.mainDescription : "";
    const balVal = item.balance; // >0 is Debit, <0 is Credit

    if (mainCategory === "Liabilities" && acc?.groupName !== "Capital Account") {
      currentLiabilities += Math.abs(balVal);
      liabilities.push({ name: acc.name, code: acc.code, value: Math.abs(balVal), group: acc.subGroupName });
    } else if (mainCategory === "Assets" || acc?.groupName === "Fixed Assets") {
      if (acc?.groupName === "Fixed Assets") {
        fixedAssets += balVal;
        assets.push({ name: acc.name, code: acc.code, value: balVal, group: "Fixed Assets" });
      } else if (acc?.subGroupName === "CASH - ON - HAND") {
        cashOnHand += balVal;
        assets.push({ name: acc.name, code: acc.code, value: balVal, group: "Cash on Hand" });
      } else if (acc?.subGroupName === "BANK ACCOUNTS") {
        bankBalances += balVal;
        assets.push({ name: acc.name, code: acc.code, value: balVal, group: "Bank Balances" });
      } else {
        currentAssets += balVal;
        assets.push({ name: acc.name, code: acc.code, value: balVal, group: acc.subGroupName || "Current Assets" });
      }
    }
  }

  reservesAndSurplus += pl.netProfit;

  const totalLiabilities = shareCapital + reservesAndSurplus + currentLiabilities;
  const totalAssets = fixedAssets + currentAssets + bankBalances + cashOnHand + pl.closingStock;

  return {
    shareCapital,
    reservesAndSurplus,
    currentLiabilities,
    liabilities,
    fixedAssets,
    currentAssets: currentAssets + pl.closingStock,
    closingStock: pl.closingStock,
    bankBalances,
    cashOnHand,
    assets,
    totalLiabilities,
    totalAssets,
    unbalancedAmount: Math.abs(totalLiabilities - totalAssets)
  };
}
