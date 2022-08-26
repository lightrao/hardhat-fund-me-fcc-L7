// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://docs.soliditylang.org/en/v0.8.15/internals/layout_in_storage.html
contract FunWithStorage {
    uint256 favoriteNumber; // Stored at slot 0
    bool someBool; // Stored at slot 1
    uint256[] myArray; /* Array Length Stored at slot 2, but the objects will be located starting at keccak256(2)(since 2 is the storage slot of the array)
    and it is laid out One element after the other */
    mapping(uint256 => bool) myMap; /* An empty slot is held at slot 3
    and the elements will be stored at keccak256(h(k) . p)
    p: The storage slot (aka, 3)
    k: The key in hex
    h: Some function based on the type. For uint256, it just pads the hex
    */
    uint256 constant NOT_IN_STORAGE = 123;
    uint256 immutable i_not_in_storage;

    constructor() {
        favoriteNumber = 25; // See stored spot above // SSTORE
        someBool = true; // See stored spot above // SSTORE
        myArray.push(222); // SSTORE
        myMap[0] = true; // SSTORE
        i_not_in_storage = 123;
    }

    function doStuff() public view {
        uint256 newVar = favoriteNumber + 1; // SLOAD
        bool otherVar = someBool; // SLOAD
        // ^^ memory variables
    }
}
