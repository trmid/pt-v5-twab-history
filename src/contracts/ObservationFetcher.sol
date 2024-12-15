// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

uint256 constant MAX_CARDINALITY = 17520; // with min period of 1 hour, this allows for minimum two years of history

contract ObservationFetcher {

  struct AccountDetails {
    uint96 balance;
    uint96 delegateBalance;
    uint16 nextObservationIndex;
    uint16 cardinality;
  }

  struct Account {
    AccountDetails details;
    bytes32[MAX_CARDINALITY] observations;
  }

  mapping(address => mapping(address => Account)) internal userObservations;
  mapping(address => Account) internal totalSupplyObservations;
  mapping(address => mapping(address => address)) internal delegates;

  function getObservations(address vault, address account) external view returns (bytes32[] memory) {
    return _getObservations(userObservations[vault][account]);
  }

  function getObservations(address vault) external view returns (bytes32[] memory) {
    return _getObservations(totalSupplyObservations[vault]);
  }

  function _getObservations(Account storage account) internal view returns (bytes32[] memory observations) {
    bytes32[MAX_CARDINALITY] storage accountObservations = account.observations;
    uint256 length = account.details.cardinality;
    observations = new bytes32[](length);
    uint256 nextIndex = account.details.nextObservationIndex;
    uint256 i = length < MAX_CARDINALITY ? 0 : nextIndex;
    uint256 end = length < MAX_CARDINALITY ? length : MAX_CARDINALITY + nextIndex;
    while (i < end) {
      observations[i] = accountObservations[i % MAX_CARDINALITY];
      i++;
    }
  }

}
