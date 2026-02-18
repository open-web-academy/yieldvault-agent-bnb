/**
 * DeFi Strategy Engine
 * Autonomous yield farming with real APR optimization
 * Strategies: Compounding, Rebalancing, Dynamic Harvesting
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class DeFiStrategyEngine {
  constructor(deployedConfig, walletPrivateKey, rpcUrl) {
    this.deployedConfig = deployedConfig;
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(walletPrivateKey, this.provider);
    this.vaults = deployedConfig.contracts;
    this.logFile = path.join(__dirname, 'execution-log.jsonl');
    this.performanceFile = path.join(__dirname, 'performance-metrics.json');
    
    // Initialize performance tracker
    this.performance = this.loadPerformanceMetrics();
  }

  loadPerformanceMetrics() {
    if (fs.existsSync(this.performanceFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.performanceFile, 'utf8'));
      } catch {
        return this.initializePerformance();
      }
    }
    return this.initializePerformance();
  }

  initializePerformance() {
    return {
      startTime: Date.now(),
      totalDeposited: 0,
      totalHarvested: 0,
      totalCompounded: 0,
      vaults: this.vaults.reduce((acc, v) => {
        acc[v.vaultId] = {
          deposits: 0,
          harvested: 0,
          compounded: 0,
          realizedAPR: 0,
          cumulativeYield: 0,
        };
        return acc;
      }, {}),
    };
  }

  savePerformanceMetrics() {
    fs.writeFileSync(this.performanceFile, JSON.stringify(this.performance, null, 2));
  }

  /**
   * STRATEGY 1: Compound Yield
   * Automatically reinvest harvested yield
   */
  async compoundYieldStrategy() {
    console.log('\n🔄 Executing Compound Yield Strategy...');
    
    const results = [];
    
    for (const vault of this.vaults) {
      try {
        const vaultContract = new ethers.Contract(
          vault.address,
          this.getVaultABI(),
          this.wallet
        );

        // Check pending rewards
        const pendingRewards = await vaultContract.getPendingRewards();
        const rewardsUSD = this.estimateValue(pendingRewards, vault.underlying);

        if (rewardsUSD >= this.deployedConfig.harvest_threshold_usd) {
          console.log(`\n📊 ${vault.vaultId}`);
          console.log(`  Pending: ${rewardsUSD.toFixed(2)} USD`);

          // Harvest
          const harvestTx = await vaultContract.harvest();
          await harvestTx.wait();
          console.log(`  ✓ Harvested: ${harvestTx.hash}`);

          // Compound (re-deposit)
          const balance = await vaultContract.balanceOf(this.wallet.address);
          const compoundTx = await vaultContract.deposit(balance);
          await compoundTx.wait();
          console.log(`  ✓ Compounded: ${compoundTx.hash}`);

          // Log action
          this.logAction({
            action: 'COMPOUND_YIELD',
            vault: vault.vaultId,
            rewards_usd: rewardsUSD,
            harvest_tx: harvestTx.hash,
            compound_tx: compoundTx.hash,
            confidence: 0.95,
          });

          // Update metrics
          this.performance.totalHarvested += rewardsUSD;
          this.performance.totalCompounded += rewardsUSD;
          this.performance.vaults[vault.vaultId].harvested += rewardsUSD;
          this.performance.vaults[vault.vaultId].compounded += rewardsUSD;

          results.push({
            vault: vault.vaultId,
            status: 'success',
            rewards: rewardsUSD,
          });
        } else {
          console.log(`\n⏸️ ${vault.vaultId}: Rewards too low (${rewardsUSD.toFixed(2)} USD)`);
        }
      } catch (error) {
        console.error(`❌ Error compounding ${vault.vaultId}:`, error.message);
        this.logAction({
          action: 'COMPOUND_ERROR',
          vault: vault.vaultId,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * STRATEGY 2: Rebalance Portfolio
   * Move capital from low-APR to high-APR vaults
   */
  async rebalanceStrategy() {
    console.log('\n⚖️ Executing Rebalance Strategy...');

    const vaultStats = await Promise.all(
      this.vaults.map(async (vault) => {
        const vaultContract = new ethers.Contract(
          vault.address,
          this.getVaultABI(),
          this.provider
        );
        const apr = await vaultContract.getCurrentAPR();
        const balance = await vaultContract.balanceOf(this.wallet.address);
        
        return {
          vault,
          apr: apr / 100,
          balance: parseFloat(ethers.utils.formatEther(balance)),
        };
      })
    );

    // Find best and worst performers
    const sorted = vaultStats.sort((a, b) => b.apr - a.apr);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    const aprDelta = best.apr - worst.apr;
    
    if (aprDelta > this.deployedConfig.rebalance_apr_delta) {
      console.log(`\n📈 APR Delta: ${aprDelta.toFixed(2)}% (rebalancing)`);
      console.log(`  From: ${worst.vault.vaultId} (${worst.apr.toFixed(2)}%)`);
      console.log(`  To:   ${best.vault.vaultId} (${best.apr.toFixed(2)}%)`);

      // Move 20% of worst vault to best vault
      const transferAmount = worst.balance * 0.2;
      
      const worstContract = new ethers.Contract(
        worst.vault.address,
        this.getVaultABI(),
        this.wallet
      );

      const bestContract = new ethers.Contract(
        best.vault.address,
        this.getVaultABI(),
        this.wallet
      );

      try {
        // Withdraw from worst
        const withdrawTx = await worstContract.withdraw(
          ethers.utils.parseEther(transferAmount.toString())
        );
        await withdrawTx.wait();

        // Deposit to best
        const depositTx = await bestContract.deposit(
          ethers.utils.parseEther(transferAmount.toString())
        );
        await depositTx.wait();

        console.log(`  ✓ Transferred ${transferAmount.toFixed(4)} tokens`);

        this.logAction({
          action: 'REBALANCE',
          from: worst.vault.vaultId,
          to: best.vault.vaultId,
          amount: transferAmount,
          apr_delta: aprDelta,
          withdraw_tx: withdrawTx.hash,
          deposit_tx: depositTx.hash,
        });

        return { status: 'success', transferred: transferAmount };
      } catch (error) {
        console.error('❌ Rebalance failed:', error.message);
        this.logAction({
          action: 'REBALANCE_ERROR',
          error: error.message,
        });
        return { status: 'error' };
      }
    } else {
      console.log(`\n⏸️ APR Delta too low (${aprDelta.toFixed(2)}%)`);
      return { status: 'skipped' };
    }
  }

  /**
   * STRATEGY 3: Dynamic Harvesting
   * Harvest based on pending yield + gas cost ratio
   */
  async dynamicHarvestStrategy() {
    console.log('\n🌾 Executing Dynamic Harvest Strategy...');

    const results = [];
    const gasPrice = await this.provider.getGasPrice();
    const estGasCost = gasPrice.mul(ethers.BigNumber.from('150000')); // Est gas for harvest
    const estGasCostUSD = parseFloat(ethers.utils.formatEther(estGasCost)) * 100; // Assume $100/BNB

    for (const vault of this.vaults) {
      try {
        const vaultContract = new ethers.Contract(
          vault.address,
          this.getVaultABI(),
          this.wallet
        );

        const pending = await vaultContract.getPendingRewards();
        const pendingUSD = this.estimateValue(pending, vault.underlying);

        // Only harvest if pending > 2x gas cost
        if (pendingUSD > estGasCostUSD * 2) {
          const harvestTx = await vaultContract.harvest();
          await harvestTx.wait();

          console.log(`\n✓ ${vault.vaultId}: Harvested ${pendingUSD.toFixed(2)} USD`);

          this.logAction({
            action: 'DYNAMIC_HARVEST',
            vault: vault.vaultId,
            pending_usd: pendingUSD,
            gas_cost_usd: estGasCostUSD,
            ratio: (pendingUSD / estGasCostUSD).toFixed(2),
            tx: harvestTx.hash,
          });

          results.push({ vault: vault.vaultId, harvested: pendingUSD });
        }
      } catch (error) {
        console.error(`Error in ${vault.vaultId}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Calculate real APR based on historical yield
   */
  calculateRealAPR(vaultId) {
    const elapsed = (Date.now() - this.performance.startTime) / (1000 * 60 * 60 * 24); // Days
    const vaultPerf = this.performance.vaults[vaultId];
    const deposited = vaultPerf.deposits || 1;
    
    const dailyYield = vaultPerf.harvested / Math.max(elapsed, 1);
    const realAPR = (dailyYield / deposited) * 365 * 100;

    return Math.max(0, realAPR);
  }

  logAction(data) {
    const record = {
      timestamp: Math.floor(Date.now() / 1000),
      cycle: this.getCycleNumber(),
      wallet: this.wallet.address,
      ...data,
    };

    fs.appendFileSync(this.logFile, JSON.stringify(record) + '\n');
  }

  getCycleNumber() {
    if (!fs.existsSync(this.logFile)) return 1;
    const lines = fs.readFileSync(this.logFile, 'utf8').split('\n').filter(l => l);
    return lines.length + 1;
  }

  estimateValue(amountWei, tokenAddress) {
    // Simplified: assume 1 token = $1 for testnet
    return parseFloat(ethers.utils.formatEther(amountWei));
  }

  getVaultABI() {
    return [
      'function harvest() external returns (uint256)',
      'function deposit(uint256 amount) external',
      'function withdraw(uint256 amount) external',
      'function balanceOf(address) external view returns (uint256)',
      'function getPendingRewards() external view returns (uint256)',
      'function getCurrentAPR() external view returns (uint256)',
    ];
  }

  async executeFullCycle() {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`DeFi Strategy Engine - Full Cycle`);
    console.log(`${new Date().toISOString()}`);
    console.log(`${'═'.repeat(60)}`);

    const cycleResults = {
      timestamp: Date.now(),
      compound: await this.compoundYieldStrategy(),
      rebalance: await this.rebalanceStrategy(),
      harvest: await this.dynamicHarvestStrategy(),
    };

    this.savePerformanceMetrics();

    console.log(`\n📊 Cycle Summary:`);
    console.log(`  Total Harvested: $${this.performance.totalHarvested.toFixed(2)}`);
    console.log(`  Total Compounded: $${this.performance.totalCompounded.toFixed(2)}`);

    return cycleResults;
  }
}

module.exports = DeFiStrategyEngine;
