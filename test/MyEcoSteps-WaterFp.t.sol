// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {MyEcoStepsWaterFp} from "../src/MyEcoSteps-WaterFp.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MyEcoStepsWaterFpTest is Test {
    MyEcoStepsWaterFp public myEcoStepsWaterFp;
    ERC20 public eduToken;

    address public user = address(1);
    address public waterOrg = 0xD8CE04A50ec0bF9eAf07507B1e4eafF892B10Dc1;

    function setUp() public {
        eduToken = new ERC20("EduToken", "EDU");
        myEcoStepsWaterFp = new MyEcoStepsWaterFp(address(eduToken));
    }

    function testPurchaseAndDonation() public {
        uint256 purchaseAmount = 100 * 10**18; // 100 EDU

        eduToken.mint(user, purchaseAmount);
        vm.prank(user);
        eduToken.approve(address(myEcoStepsWaterFp), purchaseAmount);

        vm.prank(user);
        myEcoStepsWaterFp.purchase(purchaseAmount, waterOrg);

        (address _user, uint256 amount, address organization, uint256 timestamp) = myEcoStepsWaterFp.getPurchaseInfo(user);

        assertEq(_user, user);
        assertEq(amount, 80 * 10**18); // 80% of the purchase
        assertEq(organization, waterOrg);
    }
}
