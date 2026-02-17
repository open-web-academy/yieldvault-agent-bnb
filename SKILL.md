# Yield Farming Agent Skill

Autonomous decision engine para gestión optimizada de estrategias de yield farming en múltiples vaults.

## Features

- **Deterministic Decision Engine**: 1 acción por ciclo, sin randomness
- **Cross-Vault Rebalancing**: Optimización automática de APR neto
- **Risk-Aware**: Penalty por risk_score, límite máximo de allocation
- **Audit Trail**: Execution records con hash SHA256 de decisiones
- **Testnet by Default**: BNB testnet (chainId 97), configurable para mainnet

## Configuration

### Default Parameters

```json
{
  "chainId": 97,
  "harvest_threshold_usd": 25,
  "rebalance_apr_delta": 0.02,
  "max_allocation_percent": 0.35
}
```

### Config Override

Create `config.json` to override defaults:

```json
{
  "chainId": 56,
  "harvest_threshold_usd": 50
}
```

## Vault Schema

```json
{
  "id": "string (unique vault id)",
  "name": "string",
  "tvl_usd": "number",
  "apr": "number (0-1 format, e.g., 0.25 = 25%)",
  "underlying": "string (token symbol)",
  "strategy": "string (e.g., liquidity-mining, auto-compound)",
  "fees": "number (0-1 format, e.g., 0.05 = 5%)",
  "risk_score": "number (0-1 scale, 0=no risk, 1=max risk)"
}
```

## Decision Logic

### Step 1: Calculate NET_APR per Vault

```
risk_penalty = risk_score * 0.10  (10% penalty per risk unit)
net_apr = apr - fees - risk_penalty
```

**Filter:** Only vaults where `risk_score <= 0.5`

### Step 2: Determine Best Vault

```
best_vault = vault with highest net_apr (within risk filter)
```

### Step 3: Choose Action (Priority Order)

1. **HARVEST** if `best_vault.pending_rewards >= harvest_threshold_usd`
2. **COMPOUND** if `net_apr_compound_gain >= rebalance_apr_delta` AND no pending harvest
3. **REBALANCE** if:
   - Exists vault with `net_apr > best_vault.net_apr + rebalance_apr_delta` (>= 2% delta)
   - Destination `risk_score <= best_vault.risk_score`
   - Source allocation > 0
   - Rebalance amount won't exceed `max_allocation_percent` at destination
4. **NOOP** (reason: "all_optimized" or "no_viable_action")

### Step 4: Enforce Constraints

- **max_allocation_percent**: No vault > 35% of total allocation
- **risk_score filter**: Only consider vaults with risk_score <= 0.5
- **Amount Format**: All amounts as decimal strings

## Action Schema

```json
{
  "action": "DEPOSIT|WITHDRAW|HARVEST|COMPOUND|REBALANCE|NOOP",
  "vault_id": "string",
  "token": "string (required for DEPOSIT, REBALANCE)",
  "amount": "string (decimal format)",
  "from_vault_id": "string (REBALANCE only)",
  "reason": "string (NOOP only)"
}
```

## Execution Record Schema

```json
{
  "timestamp": "ISO8601",
  "cycle_num": "number",
  "chainId": "number",
  "decision": {
    "best_vault_id": "string",
    "best_vault_net_apr": "string (decimal)",
    "action": {...},
    "rationale": "string"
  },
  "vault_states": [
    {
      "id": "string",
      "net_apr": "string",
      "allocation_percent": "string",
      "pending_rewards_usd": "string"
    }
  ],
  "decision_hash": "string (SHA256 of decision object)",
  "execution_hash": "string (SHA256 of full record)"
}
```

## Usage

### Node.js / JavaScript

```javascript
const YieldFarmingAgent = require('./index.js');

const agent = new YieldFarmingAgent({
  chainId: 97,
  harvest_threshold_usd: 25,
  rebalance_apr_delta: 0.02,
  max_allocation_percent: 0.35
});

const vaults = require('./mockdata.json');
const currentAllocation = { /* your allocation state */ };

const executionRecord = agent.decide(vaults, currentAllocation);
console.log(JSON.stringify(executionRecord, null, 2));
```

### REST Endpoint (Future)

```
POST /yield-farming-agent/decide
Body: {
  vaults: [...],
  current_allocation: {...},
  config: {...}
}
Response: execution_record
```

## Hash Audit

Every execution record includes:
- **decision_hash**: SHA256 of `decision` object (ensures decision integrity)
- **execution_hash**: SHA256 of full record (ensures audit trail immutability)

Verify integrity:
```javascript
const crypto = require('crypto');
const decisionStr = JSON.stringify(record.decision);
const computed = crypto.createHash('sha256').update(decisionStr).digest('hex');
console.assert(computed === record.decision_hash, 'Decision hash mismatch!');
```

## Files

- `index.js` - Engine implementation
- `mockdata.json` - Sample vault data
- `config.default.json` - Default configuration
- `execution.example.json` - Example execution record
- `SKILL.md` - This file

## Next Steps (On-Chain)

1. **Deploy to Blockchain**: Adapt decision output to smart contract calldata
2. **Event Emission**: Emit `ExecutionRecorded(cycle, decisionHash)` on-chain
3. **Access Control**: Add keeper/executor role checks
4. **Multi-sig**: Consider gov approval for large rebalances
5. **Monitor**: Off-chain watcher to detect/alert decision divergence

## License

MIT
