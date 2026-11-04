import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sampleData} from '../sample-data.mjs';
import {validateRows,total,change,forecast,businessValue,previousMonth,csvEscape} from '../model.mjs';
import {assertPrivateStorage} from '../tools/storage.mjs';

test('fictional monthly portfolio reconciles cost and adoption',()=>{
 const rows=validateRows(sampleData.rows),oct=total(rows.filter(r=>r.month==='2026-10'));
 assert.equal(rows.length,24);assert.equal(oct.credits,716000);assert.equal(oct.mau,4900);assert.equal(oct.pau,3025);assert.equal(oct.spend,17128);assert.equal(oct.azureCost+oct.copilotCost,oct.spend);
});
test('validation rejects duplicate snapshots, impossible adoption and nonfinite numbers',()=>{
 const row=sampleData.rows[0];assert.throws(()=>validateRows([row,row]),/duplicate/);assert.throws(()=>validateRows([{...row,pau:row.mau+1}]),/PAU/);assert.throws(()=>validateRows([{...row,azureCost:NaN}]),/azureCost/);assert.throws(()=>validateRows([{...row,mau:1.5}]),/integer/);assert.throws(()=>validateRows([{...row,month:'2026-13'}]),/month/);
});
test('forecast compounds spend across year boundary',()=>{
 const result=forecast({month:'2026-12',spend:100},.1);assert.equal(result[0].month,'2027-01');assert.ok(Math.abs(result[2].spend-133.1)<1e-8);assert.equal(previousMonth('2026-01'),'2025-12');assert.equal(change(20,0),null);
});
test('business value handles net loss and undefined zero-cost ROI',()=>{
 assert.deepEqual(businessValue(100,1000,40,.5),{benefit:2000,net:1000,roi:100,multiple:2});assert.equal(businessValue(0,100).roi,-100);assert.equal(businessValue(10,0).roi,null);
});
test('CSV export neutralizes spreadsheet formulas and escapes quotes',()=>{
 assert.equal(csvEscape('=HYPERLINK("x")'),'"\'=HYPERLINK(""x"")"');assert.equal(csvEscape('Example, Inc.'),'"Example, Inc."');
});
test('private storage fails closed inside the public checkout',async()=>{await assert.rejects(assertPrivateStorage(fileURLToPath(new URL('../',import.meta.url))),/public repository/);});
