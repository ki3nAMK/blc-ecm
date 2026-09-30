//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
  function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
  address payable public immutable adminAddress;
  address payable[] public sellerAddresses;
  mapping(address => bool) public isValidSeller;

  modifier onlyAdmin() {
    require(msg.sender == adminAddress, 'Only admin can call this method!');
    _;
  }

  modifier onlyValidSeller() {
    require(isValidSeller[msg.sender], 'Seller not authorized!');
    _;
  }

  struct Product {
    string id;
    uint256 escrowAmount;
    uint256 price;
    address payable seller;
    bool exists;
  }

  mapping(string => address payable) public buyers;
  mapping(address => mapping(string => Product)) public sellers;

  constructor(address payable _adminAddress, address payable[] memory _sellerAddresses) {
    adminAddress = _adminAddress;

    for (uint256 i = 0; i < _sellerAddresses.length; i++) {
      address payable seller = _sellerAddresses[i];
      require(seller != address(0), 'Zero address not allowed');

      if (!isValidSeller[seller]) {
        isValidSeller[seller] = true;
        sellerAddresses.push(seller);
      }
    }
  }

  function list(
    string memory productId,
    uint256 _escrowAmount,
    uint256 _price
  ) public onlyValidSeller {
    require(bytes(productId).length > 0, 'Product ID empty');
    require(_escrowAmount > 0, 'Escrow amount must be > 0');
    require(_price > 0, 'Price must be > 0');

    require(!sellers[msg.sender][productId].exists, 'Product already listed by you');

    Product memory newProduct = Product({
      id: productId,
      escrowAmount: _escrowAmount,
      price: _price,
      seller: payable(msg.sender),
      exists: true
    });

    sellers[msg.sender][productId] = newProduct;
  }

  function addSeller(address payable _newSeller) external onlyAdmin {
    require(_newSeller != address(0), 'Zero address');
    if (!isValidSeller[_newSeller]) {
      isValidSeller[_newSeller] = true;
      sellerAddresses.push(_newSeller);
    }
  }

  function removeSeller(address payable _seller) external onlyAdmin {
    require(isValidSeller[_seller], 'Not a seller');
    isValidSeller[_seller] = false;

    for (uint256 i = 0; i < sellerAddresses.length; i++) {
      if (sellerAddresses[i] == _seller) {
        sellerAddresses[i] = sellerAddresses[sellerAddresses.length - 1];
        sellerAddresses.pop();
        break;
      }
    }
  }

  function isSeller(address _addr) external view returns (bool) {
    return isValidSeller[_addr];
  }
}
