export const numericFields = ['credits','mau','pau','azureCost','copilotCost','creditCapacity','budget','tasks','hoursSaved'];
export function validateRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 10000) throw new Error('Expected 1–10,000 monthly customer records.');
  const keys = new Set();
  return rows.map((row, i) => {
    const fail = message => { throw new Error(`Record ${i + 1}: ${message}`); };
    if (!row || typeof row !== 'object') fail('invalid record.');
    if (typeof row.customer !== 'string' || !row.customer.trim() || row.customer.length > 120 || /[\u0000-\u001f\u007f]/.test(row.customer)) fail('invalid customer.');
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(row.month)) fail('month must be YYYY-MM.');
    const copy = {customer: row.customer.trim(), month: row.month};
    for (const key of numericFields) {
      if (typeof row[key] !== 'number' || !Number.isFinite(row[key]) || row[key] < 0 || row[key] > 1e12) fail(`invalid ${key}.`);
      if (['credits','mau','pau','creditCapacity','tasks'].includes(key) && !Number.isInteger(row[key])) fail(`${key} must be an integer.`);
      copy[key] = row[key];
    }
    if (copy.pau > copy.mau) fail('PAU cannot exceed MAU.');
    const id = JSON.stringify([copy.customer, copy.month]);
    if (keys.has(id)) fail('duplicate customer/month snapshot.');
    keys.add(id);
    return copy;
  });
}
export const spend = row => row.azureCost + row.copilotCost;
export function total(rows) {
  const result = Object.fromEntries(numericFields.map(key => [key, 0]));
  for (const row of rows) for (const key of numericFields) result[key] += row[key];
  result.spend = spend(result);
  return result;
}
export function previousMonth(month) { return addMonth(month, -1); }
export function addMonth(month, offset) {
  const [year, m] = month.split('-').map(Number);
  return new Date(Date.UTC(year, m - 1 + offset, 1)).toISOString().slice(0, 7);
}
export function change(current, previous) { return previous > 0 ? (current / previous - 1) * 100 : null; }
export function baselineGrowth(series) {
  const last = series.slice(-3);
  const changes = last.slice(1).map((p, i) => last[i].spend > 0 ? p.spend / last[i].spend - 1 : null).filter(x => x !== null);
  return changes.length ? Math.max(-.2, Math.min(.2, changes.reduce((a,b)=>a+b,0)/changes.length)) : 0;
}
export function forecast(base, growth, periods = 3) {
  return Array.from({length: periods}, (_,i) => ({month: addMonth(base.month, i + 1), spend: base.spend * (1 + growth) ** (i + 1)}));
}
export function businessValue(hours, cost, hourlyRate = 45, realization = .7) {
  const benefit = hours * hourlyRate * realization;
  return {benefit, net: benefit - cost, roi: cost > 0 ? (benefit - cost) / cost * 100 : null, multiple: cost > 0 ? benefit / cost : null};
}
export function csvEscape(value) {
  let string = String(value);
  if (/^[\s]*[=+\-@]/.test(string)) string = `'${string}`;
  return `"${string.replaceAll('"','""')}"`;
}
