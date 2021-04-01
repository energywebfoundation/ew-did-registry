pragma solidity 0.8.0;


interface IOfferable {
  function offer(address _offeredTo) external;

  function acceptOffer() external;

  function rejectOffer() external;

  function cancelOffer() external;

  function update(bytes memory _data, uint256 value)
    external
    returns (bool success);
}
