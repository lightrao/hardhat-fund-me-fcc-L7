// SPDX-License-Identifier: MIT
// Pragam
pragma solidity ^0.8.8;
// imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
// Error codes
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts

/** @title A contract for crowd fundding
 *  @author Light Rao
 *  @notice This contract is to demao a simple fundding contract
 *  @dev This implements price feeds as our library
 */
contract FundMe {
    // 1.Type declarations
    using PriceConverter for uint256;
    // 2.State variables
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    AggregatorV3Interface public priceFeed;
    // 3.Events
    // _;
    // 4.Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // 5.Functions
    /// constructor
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /// receive
    receive() external payable {
        fund();
    }

    /// fallback
    fallback() external payable {
        fund();
    }

    /// external
    /// _;
    /// public

    /**
     *  @notice This function funds this contract
     *  @dev This implements price feeds as our library
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function getVersion() public view returns (uint256) {
        return priceFeed.version();
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0; // reset map structure's value to 0
        }
        funders = new address[](0); // funders point to recreated array which include 0 items

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
    /// internal

    /// private

    /// view / pure
}
