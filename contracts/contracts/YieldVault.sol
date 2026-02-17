// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title YieldVault
 * @dev Stub smart contract for yield farming agent skill on BNB testnet
 * Compatible with vault_id, token, shares, and amount structures from mockdata.json
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract YieldVault {
    // ======================== State Variables ========================
    
    string public vaultId;
    address public underlying;
    uint256 public totalShares;
    uint256 public totalAssets;
    uint256 public accumulatedYield;
    
    address public owner;
    bool public paused;
    
    // User positions: user => shares balance
    mapping(address => uint256) public shareBalance;
    mapping(address => uint256) public lastDepositBlock;
    
    // Vault configuration
    uint256 public feePercentage = 500; // 5% = 500/10000
    uint256 public constant FEE_PRECISION = 10000;
    
    // ======================== Events ========================
    
    event ExecutionRecorded(
        string indexed vaultId,
        string action,
        address indexed user,
        uint256 amount,
        uint256 shares,
        uint256 timestamp
    );
    
    event ActionExecuted(
        string indexed vaultId,
        string action,
        address indexed user,
        uint256 indexed amount,
        bool success,
        string message
    );
    
    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 shares, uint256 amount);
    event Harvest(address indexed user, uint256 yieldAmount);
    event Compound(uint256 yield, uint256 newShares);
    event FeeDeducted(uint256 amount);
    
    // ======================== Constructor ========================
    
    constructor(
        string memory _vaultId,
        address _underlying
    ) {
        require(bytes(_vaultId).length > 0, "Vault ID required");
        require(_underlying != address(0), "Invalid underlying token");
        
        vaultId = _vaultId;
        underlying = _underlying;
        owner = msg.sender;
        paused = false;
    }
    
    // ======================== Modifiers ========================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Vault is paused");
        _;
    }
    
    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }
    
    // ======================== Core Functions ========================
    
    /**
     * @dev Deposit tokens into the vault and receive shares
     * @param amount Amount of underlying tokens to deposit
     */
    function deposit(uint256 amount)
        external
        whenNotPaused
        validAmount(amount)
        returns (uint256 sharesIssued)
    {
        // Transfer tokens from user to vault
        require(
            IERC20(underlying).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        // Calculate shares (1:1 on first deposit, then based on price)
        sharesIssued = calculateSharesFromAssets(amount);
        
        // Update state
        shareBalance[msg.sender] += sharesIssued;
        totalShares += sharesIssued;
        totalAssets += amount;
        lastDepositBlock[msg.sender] = block.number;
        
        // Emit events
        emit Deposit(msg.sender, amount, sharesIssued);
        emit ExecutionRecorded(
            vaultId,
            "deposit",
            msg.sender,
            amount,
            sharesIssued,
            block.timestamp
        );
        emit ActionExecuted(
            vaultId,
            "deposit",
            msg.sender,
            amount,
            true,
            "Deposit successful"
        );
        
        return sharesIssued;
    }
    
    /**
     * @dev Withdraw tokens from the vault by burning shares
     * @param shares Amount of shares to burn
     */
    function withdraw(uint256 shares)
        external
        whenNotPaused
        validAmount(shares)
        returns (uint256 amountRedeemed)
    {
        require(shareBalance[msg.sender] >= shares, "Insufficient shares");
        
        // Calculate amount to withdraw
        amountRedeemed = calculateAssetsFromShares(shares);
        require(amountRedeemed > 0, "Withdrawal amount is 0");
        
        // Deduct fee
        uint256 fee = (amountRedeemed * feePercentage) / FEE_PRECISION;
        uint256 netAmount = amountRedeemed - fee;
        
        // Update state
        shareBalance[msg.sender] -= shares;
        totalShares -= shares;
        totalAssets -= amountRedeemed;
        
        // Transfer to user
        require(
            IERC20(underlying).transfer(msg.sender, netAmount),
            "Transfer failed"
        );
        
        // Emit events
        emit Withdraw(msg.sender, shares, netAmount);
        emit FeeDeducted(fee);
        emit ExecutionRecorded(
            vaultId,
            "withdraw",
            msg.sender,
            netAmount,
            shares,
            block.timestamp
        );
        emit ActionExecuted(
            vaultId,
            "withdraw",
            msg.sender,
            netAmount,
            true,
            "Withdrawal successful"
        );
        
        return netAmount;
    }
    
    /**
     * @dev Harvest yields without reinvesting
     * In a real implementation, this would claim rewards from the underlying protocol
     */
    function harvest()
        external
        whenNotPaused
        returns (uint256 yieldAmount)
    {
        require(shareBalance[msg.sender] > 0, "No shares to harvest");
        
        // Stub: calculate yield based on shares and mock APR
        yieldAmount = calculateUserYield(msg.sender);
        require(yieldAmount > 0, "No yield available");
        
        // Transfer yield to user (in real implementation, this would come from protocol)
        require(
            IERC20(underlying).transfer(msg.sender, yieldAmount),
            "Yield transfer failed"
        );
        
        accumulatedYield += yieldAmount;
        
        // Emit events
        emit Harvest(msg.sender, yieldAmount);
        emit ExecutionRecorded(
            vaultId,
            "harvest",
            msg.sender,
            yieldAmount,
            0,
            block.timestamp
        );
        emit ActionExecuted(
            vaultId,
            "harvest",
            msg.sender,
            yieldAmount,
            true,
            "Harvest successful"
        );
        
        return yieldAmount;
    }
    
    /**
     * @dev Compound yields by reinvesting them as new shares
     */
    function compound()
        external
        whenNotPaused
        returns (uint256 newShares)
    {
        require(shareBalance[msg.sender] > 0, "No shares to compound");
        
        // Calculate compounding yield
        uint256 yieldAmount = calculateUserYield(msg.sender);
        require(yieldAmount > 0, "No yield to compound");
        
        // Calculate new shares from yield
        newShares = calculateSharesFromAssets(yieldAmount);
        
        // Update state
        shareBalance[msg.sender] += newShares;
        totalShares += newShares;
        totalAssets += yieldAmount;
        accumulatedYield += yieldAmount;
        
        // Emit events
        emit Compound(yieldAmount, newShares);
        emit ExecutionRecorded(
            vaultId,
            "compound",
            msg.sender,
            yieldAmount,
            newShares,
            block.timestamp
        );
        emit ActionExecuted(
            vaultId,
            "compound",
            msg.sender,
            yieldAmount,
            true,
            "Compound successful"
        );
        
        return newShares;
    }
    
    // ======================== View Functions ========================
    
    /**
     * @dev Get user's share balance
     */
    function getShareBalance(address user) external view returns (uint256) {
        return shareBalance[user];
    }
    
    /**
     * @dev Get total assets in vault
     */
    function getTotalAssets() external view returns (uint256) {
        return totalAssets;
    }
    
    /**
     * @dev Get total shares issued
     */
    function getTotalShares() external view returns (uint256) {
        return totalShares;
    }
    
    /**
     * @dev Convert assets to shares (simple stub: 1 asset = 1 share initially)
     */
    function calculateSharesFromAssets(uint256 assets) public view returns (uint256) {
        if (totalAssets == 0 || totalShares == 0) {
            return assets; // 1:1 on empty vault
        }
        return (assets * totalShares) / totalAssets;
    }
    
    /**
     * @dev Convert shares to assets
     */
    function calculateAssetsFromShares(uint256 shares) public view returns (uint256) {
        if (totalShares == 0) {
            return 0;
        }
        return (shares * totalAssets) / totalShares;
    }
    
    /**
     * @dev Calculate yield for a user (stub: 10% annual, daily accrual)
     */
    function calculateUserYield(address user) public view returns (uint256) {
        if (shareBalance[user] == 0) {
            return 0;
        }
        
        uint256 userAssets = calculateAssetsFromShares(shareBalance[user]);
        // Stub: simple calculation (0.027% daily = ~10% APY)
        return (userAssets * 27) / 100000;
    }
    
    /**
     * @dev Get vault info compatible with mockdata.json structure
     */
    function getVaultInfo()
        external
        view
        returns (
            string memory id,
            address tokenAddress,
            uint256 total,
            uint256 shares
        )
    {
        return (vaultId, underlying, totalAssets, totalShares);
    }
    
    // ======================== Admin Functions ========================
    
    /**
     * @dev Pause vault (emergency only)
     */
    function pause() external onlyOwner {
        paused = true;
    }
    
    /**
     * @dev Resume vault
     */
    function unpause() external onlyOwner {
        paused = false;
    }
    
    /**
     * @dev Update fee percentage
     */
    function setFeePercentage(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high (max 10%)");
        feePercentage = newFee;
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
