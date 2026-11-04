// Entirely fictional, deterministic monthly snapshots. No source reports or real identities.
const customers = [
  {customer:'Northstar Retail',credits:284000,mau:1890,pau:1150,azureCost:4810,copilotCost:2272,creditCapacity:350000,budget:8500,tasks:26400,hoursSaved:1850},
  {customer:'Meridian Financial',credits:212000,mau:1420,pau:980,azureCost:3240,copilotCost:1696,creditCapacity:250000,budget:6000,tasks:19200,hoursSaved:1320},
  {customer:'Alpine Manufacturing',credits:128000,mau:920,pau:510,azureCost:1890,copilotCost:1024,creditCapacity:200000,budget:4000,tasks:13100,hoursSaved:780},
  {customer:'Solstice Health',credits:92000,mau:670,pau:385,azureCost:1460,copilotCost:736,creditCapacity:100000,budget:3000,tasks:9500,hoursSaved:640}
];
const factors = [.52,.61,.70,.79,.89,1];
export const sampleData = {
  fictional:true,
  asOf:'2026-10-31',
  currency:'USD',
  rows: factors.flatMap((factor,i) => customers.map((customer,j) => {
    const row = {...customer, month:`2026-${String(i+5).padStart(2,'0')}`};
    for (const key of ['credits','mau','pau','azureCost','copilotCost','tasks','hoursSaved']) row[key] = Math.round(customer[key] * factor * (1 + (5-i)*j*.012));
    return row;
  }))
};
