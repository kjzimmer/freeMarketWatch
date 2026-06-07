const { Client } = require('pg');
const DB = 'postgresql://postgres:Xm-[+9;{_CG}UO4@localhost:5432/freeMarketWatch';

async function run() {
  const client = new Client({ connectionString: DB });
  await client.connect();

  const tables = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
  );
  console.log('\nTables:', tables.rows.map(r => r.tablename).join(', '));

  const instr = await client.query(
    'SELECT ticker, group_name FROM market_instruments ORDER BY id'
  );
  console.log(`\nInstruments (${instr.rowCount}):`);
  instr.rows.forEach(r => console.log(`  ${r.ticker.padEnd(6)} ${r.group_name}`));

  await client.end();
}

run().catch(err => { console.error(err.message); process.exit(1); });
