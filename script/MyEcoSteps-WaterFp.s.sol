// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {MyEcoStepsWaterFp} from "../src/MyEcoSteps-WaterFp.sol";

contract MyEcoStepsWaterFpScript is Script {
    MyEcoStepsWaterFp public myEcoStepsWaterFp;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy the contract with the address of the EDU token (replace with actual token address)
        myEcoStepsWaterFp = new MyEcoStepsWaterFp(0xc2BC0B330D39F4380946a6bEAf951829B31FF887);

        vm.stopBroadcast();
    }
}
