// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MyEcoStepsWaterFp {
    struct Purchase {
        address user;
        uint256 amount;
        address organization;
        uint256 timestamp;
    }

    mapping(address => Purchase) public purchases;

    address public owner;
    address public waterOrg1 = 0xD8CE04A50ec0bF9eAf07507B1e4eafF892B10Dc1;
    address public waterOrg2 = 0xceb5E25083D38eD1B2791CcC8192F0f3F051275A;
    address public waterOrg3 = 0x3aA497610C81D5fd4542624ea814E2C37baCc387;
    uint256 public donationPercentage = 20;
    ERC20 public eduToken;

    event PurchaseRecorded(address indexed user, uint256 amount, address organization, uint256 timestamp);
    event DonationSent(address indexed organization, uint256 amount);

    constructor(address _eduToken) {
        owner = msg.sender;
        eduToken = ERC20(_eduToken);
    }

    function purchase(uint256 amount, address organization) public {
        require(organization == waterOrg1 || organization == waterOrg2 || organization == waterOrg3, "Invalid organization address");

        uint256 donationAmount = (amount * donationPercentage) / 100;
        uint256 remainingAmount = amount - donationAmount;

        // Transfer tokens for the purchase
        eduToken.transferFrom(msg.sender, address(this), amount);
        // Transfer the donation to the selected organization
        eduToken.transfer(organization, donationAmount);

        // Record the purchase
        purchases[msg.sender] = Purchase({
            user: msg.sender,
            amount: remainingAmount,
            organization: organization,
            timestamp: block.timestamp
        });

        emit PurchaseRecorded(msg.sender, remainingAmount, organization, block.timestamp);
        emit DonationSent(organization, donationAmount);
    }

    function getPurchaseInfo(address user) public view returns (Purchase memory) {
        require(block.timestamp < purchases[user].timestamp + 365 days, "Purchase information has expired");
        return purchases[user];
    }
}
