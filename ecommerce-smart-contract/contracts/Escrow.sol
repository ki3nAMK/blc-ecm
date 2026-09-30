// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Escrow is ERC1155Holder, ReentrancyGuard {
    enum OrderStatus {
        Pending,
        Deposited,
        Finalized,
        Received,
        Canceled,
        Done
    }

    address payable public immutable adminAddress;
    address public erc1155Address;

    mapping(address => bool) public isValidSeller;
    address payable[] public sellerAddresses;

    // productId => Product
    mapping(bytes32 => Product) public products;

    // productId => FlashSale
    mapping(bytes32 => FlashSale) public flashSales;

    // buyer => orderId => Order
    mapping(address => mapping(bytes32 => Order)) public orders;

    mapping(address => bool) public isValidCustomer;
    address payable[] public customers;

    // --- Structs
    struct Product {
        uint256 escrowAmount; // per unit escrow (wei)
        uint256 price; // per unit full price (wei)
        address payable seller;
        uint256 quantity; // available quantity held IN ESCROW (contract)
        bool isExist;
        uint256 tokenId; // ERC1155 token id
    }

    struct Order {
        bytes32 productId;
        OrderStatus status;
        bool approvedBySeller;
        uint256 quantity;
        address referrer; // address(0) = no referrer
        uint256 unitPrice; // per-unit price locked in at depositEarnest time
        uint256 unitEscrow; // per-unit escrow locked in at depositEarnest time
    }

    struct FlashSale {
        uint256 discountedPrice; // per-unit sale price (wei)
        uint256 discountedEscrow; // per-unit sale escrow (wei)
        uint256 startTime; // unix seconds
        uint256 endTime; // unix seconds
        bool active;
    }

    // --- Events
    event ProductListed(
        bytes32 indexed productId,
        address indexed seller,
        uint256 tokenId,
        uint256 quantity,
        uint256 price,
        uint256 escrowAmount
    );
    event EarnestDeposited(
        address indexed buyer,
        bytes32 indexed orderId,
        bytes32 indexed productId,
        uint256 quantity,
        uint256 amount
    );
    event OrderApproved(bytes32 indexed orderId, address indexed seller);
    event RestDeposited(
        address indexed buyer,
        bytes32 indexed orderId,
        uint256 amount
    );
    event OrderFinalized(bytes32 indexed orderId, address indexed seller);
    event ProductReceived(address indexed buyer, bytes32 indexed orderId);
    event OrderCompleted(
        bytes32 indexed orderId,
        address indexed buyer,
        uint256 totalPrice,
        uint256 fee
    );
    event OrderCanceled(
        address indexed buyer,
        bytes32 indexed orderId,
        uint256 refund
    );
    event ReferralPaid(
        bytes32 indexed orderId,
        address indexed referrer,
        address indexed buyer,
        uint256 amount
    );
    event SellerAdded(address indexed seller);
    event SellerRemoved(address indexed seller);
    event FlashSaleSet(
        bytes32 indexed productId,
        address indexed seller,
        uint256 discountedPrice,
        uint256 discountedEscrow,
        uint256 startTime,
        uint256 endTime
    );
    event FlashSaleCanceled(bytes32 indexed productId, address indexed seller);

    // --- Modifiers
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin");
        _;
    }

    modifier onlyValidSeller() {
        require(isValidSeller[msg.sender], "Not seller");
        _;
    }

    modifier onlyOwnerOfProduct(bytes32 productId) {
        require(products[productId].isExist, "Product not exist");
        require(
            products[productId].seller == msg.sender,
            "Only owner of this product"
        );
        _;
    }

    modifier onlyBuyerOfProduct(bytes32 orderId) {
        require(
            orders[msg.sender][orderId].productId != bytes32(0),
            "Only buyer of this product"
        );
        _;
    }

    modifier orderExists(address buyer, bytes32 orderId) {
        require(
            orders[buyer][orderId].productId != bytes32(0),
            "Order does not exist"
        );
        _;
    }

    // --- Constructor
    constructor(
        address payable _adminAddress,
        address payable[] memory _sellerAddresses,
        address _erc1155Address
    ) {
        require(_adminAddress != address(0), "admin zero");
        adminAddress = _adminAddress;
        erc1155Address = _erc1155Address;

        for (uint256 i = 0; i < _sellerAddresses.length; i++) {
            address payable seller = _sellerAddresses[i];
            require(seller != address(0), "seller zero");
            if (!isValidSeller[seller]) {
                isValidSeller[seller] = true;
                sellerAddresses.push(seller);
                emit SellerAdded(seller);
            }
        }
    }

    // ------------------------
    // PRODUCTS (seller lists product and transfers ERC1155 into escrow)
    // ------------------------
    /// @notice Seller lists product and transfers `quantity` tokens into the escrow contract.
    /// @dev Seller MUST call `setApprovalForAll(escrowAddress, true)` on the ERC1155 contract before calling.
    function list(
        bytes32 productId,
        uint256 _escrowAmount,
        uint256 _price,
        uint256 _quantity,
        uint256 _tokenId
    ) external onlyValidSeller {
        require(_escrowAmount > 0, "escrow>0");
        require(_price > 0, "price>0");
        require(_quantity > 0, "quantity>0");
        require(!products[productId].isExist, "Product exists");

        IERC1155(erc1155Address).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            _quantity,
            ""
        );

        products[productId] = Product({
            escrowAmount: _escrowAmount,
            price: _price,
            seller: payable(msg.sender),
            quantity: _quantity,
            isExist: true,
            tokenId: _tokenId
        });

        emit ProductListed(
            productId,
            msg.sender,
            _tokenId,
            _quantity,
            _price,
            _escrowAmount
        );
    }

    // ------------------------
    // FLASH SALES
    // ------------------------
    /// @notice Seller starts a time-boxed discount on their own product.
    function setFlashSale(
        bytes32 productId,
        uint256 discountedPrice,
        uint256 discountedEscrow,
        uint256 startTime,
        uint256 endTime
    ) external onlyValidSeller onlyOwnerOfProduct(productId) {
        Product storage p = products[productId];

        require(discountedPrice > 0, "discountedPrice>0");
        require(discountedPrice < p.price, "must be a discount");
        require(
            discountedEscrow > 0 && discountedEscrow <= discountedPrice,
            "bad escrow"
        );
        require(startTime < endTime, "bad window");
        require(endTime > block.timestamp, "already ended");

        FlashSale storage existing = flashSales[productId];
        require(
            !(existing.active && block.timestamp <= existing.endTime),
            "sale already active/scheduled"
        );

        flashSales[productId] = FlashSale({
            discountedPrice: discountedPrice,
            discountedEscrow: discountedEscrow,
            startTime: startTime,
            endTime: endTime,
            active: true
        });

        emit FlashSaleSet(
            productId,
            msg.sender,
            discountedPrice,
            discountedEscrow,
            startTime,
            endTime
        );
    }

    /// @notice Seller cancels their own flash sale early. Orders already deposited during
    /// the sale keep their snapshotted price — this only stops *new* deposits from
    /// getting the discount.
    function cancelFlashSale(
        bytes32 productId
    ) external onlyValidSeller onlyOwnerOfProduct(productId) {
        require(flashSales[productId].active, "no active sale");
        delete flashSales[productId];
        emit FlashSaleCanceled(productId, msg.sender);
    }

    /// @notice Returns the price/escrow that would apply to a purchase right now —
    /// the flash-sale price if one is active and within its time window, else the
    /// product's normal listed price.
    function getEffectivePrice(
        bytes32 productId
    ) public view returns (uint256 effPrice, uint256 effEscrow) {
        Product storage p = products[productId];
        FlashSale storage fs = flashSales[productId];
        if (
            fs.active &&
            block.timestamp >= fs.startTime &&
            block.timestamp <= fs.endTime
        ) {
            return (fs.discountedPrice, fs.discountedEscrow);
        }
        return (p.price, p.escrowAmount);
    }

    // ------------------------
    // ORDERS
    // ------------------------
    /// @notice Buyer deposits earnest (escrow) for an order
    function depositEarnest(
        bytes32 productId,
        bytes32 orderId,
        uint32 _quantity,
        address referrer
    ) external payable nonReentrant {
        Product storage currentProduct = products[productId];

        require(currentProduct.isExist, "Product not exist");
        require(_quantity > 0, "Quantity must be > 0");
        require(
            currentProduct.quantity >= _quantity,
            "Not enough product in stock!"
        );

        (uint256 unitPrice, uint256 unitEscrow) = getEffectivePrice(
            productId
        );
        require(msg.value == unitEscrow * _quantity, "Wrong escrow");
        require(referrer != msg.sender, "Cannot refer yourself");

        if (!isValidCustomer[msg.sender]) {
            isValidCustomer[msg.sender] = true;
            customers.push(payable(msg.sender));
        }

        // create order (overwrites existing orderId for same buyer — ensure unique orderId externally)
        orders[msg.sender][orderId] = Order({
            productId: productId,
            status: OrderStatus.Pending,
            approvedBySeller: false,
            quantity: _quantity,
            referrer: referrer,
            unitPrice: unitPrice,
            unitEscrow: unitEscrow
        });

        // reserve the quantity
        currentProduct.quantity = currentProduct.quantity - _quantity;

        emit EarnestDeposited(
            msg.sender,
            orderId,
            productId,
            _quantity,
            msg.value
        );
    }

    /// @notice Seller can mark the order as approved (optional flow)
    function approveProduct(
        bytes32 productId,
        bytes32 orderId,
        address buyer
    )
        public
        onlyValidSeller
        onlyOwnerOfProduct(productId)
        orderExists(buyer, orderId)
    {
        Order storage currentOrder = orders[buyer][orderId];
        require(!currentOrder.approvedBySeller, "Already approved");

        currentOrder.approvedBySeller = true;
        emit OrderApproved(orderId, msg.sender);
    }

    /// @notice Buyer cancels while Pending -> refund earnest and restore stock
    function cancelDeposit(
        bytes32 orderId
    ) external nonReentrant onlyBuyerOfProduct(orderId) {
        Order storage currentOrder = orders[msg.sender][orderId];
        Product storage currentProduct = products[currentOrder.productId];

        require(
            currentOrder.status == OrderStatus.Pending,
            "Order not cancellable"
        );

        uint256 totalRefund = currentOrder.unitEscrow *
            currentOrder.quantity;

        // Effects: restore product quantity and delete order
        currentProduct.quantity += currentOrder.quantity;
        delete orders[msg.sender][orderId];

        // Interaction: refund buyer
        (bool success, ) = payable(msg.sender).call{value: totalRefund}("");
        require(success, "Refund failed");

        emit OrderCanceled(msg.sender, orderId, totalRefund);
    }

    /// @notice Buyer deposits the rest of the price (after escrow)
    function depositRestAmount(
        bytes32 orderId
    ) external payable nonReentrant onlyBuyerOfProduct(orderId) {
        Order storage currentOrder = orders[msg.sender][orderId];
        require(
            currentOrder.status == OrderStatus.Pending,
            "Order not pending"
        );

        uint256 rest = (currentOrder.unitPrice - currentOrder.unitEscrow) *
            currentOrder.quantity;
        require(msg.value == rest, "Value must equal rest of price");

        currentOrder.status = OrderStatus.Deposited;

        emit RestDeposited(msg.sender, orderId, msg.value);
    }

    /// @notice Seller finalizes (marks ready / confirms shipped)
    function finalizeOrder(
        bytes32 orderId,
        address buyer
    ) external onlyValidSeller orderExists(buyer, orderId) {
        Order storage currentOrder = orders[buyer][orderId];
        require(
            currentOrder.status == OrderStatus.Deposited,
            "Order must be deposited"
        );

        Product storage currentProduct = products[currentOrder.productId];
        require(
            currentProduct.seller == msg.sender,
            "Only owner of this product"
        );

        currentOrder.status = OrderStatus.Finalized;
        emit OrderFinalized(orderId, msg.sender);
    }

    /// @notice Buyer confirms received
    function approveReceiveProduct(
        bytes32 orderId
    ) public onlyBuyerOfProduct(orderId) {
        Order storage currentOrder = orders[msg.sender][orderId];
        require(
            currentOrder.status == OrderStatus.Finalized,
            "Order not finalized"
        );

        currentOrder.status = OrderStatus.Received;
        emit ProductReceived(msg.sender, orderId);
    }

    /// @notice Seller calls to complete the order: transfer NFT to buyer and distribute funds (seller + admin fee)
    function rewardOrder(
        bytes32 orderId,
        address buyer
    ) external nonReentrant onlyValidSeller orderExists(buyer, orderId) {
        Order storage currentOrder = orders[buyer][orderId];
        require(
            currentOrder.status == OrderStatus.Received,
            "Order must be received"
        );

        Product storage currentProduct = products[currentOrder.productId];
        require(
            currentProduct.seller == msg.sender,
            "Only owner of this product"
        );

        uint256 totalPrice = currentOrder.unitPrice * currentOrder.quantity;
        require(
            address(this).balance >= totalPrice,
            "Insufficient contract balance for payout"
        );

        // Ensure escrow holds the tokens
        uint256 contractTokenBalance = IERC1155(erc1155Address).balanceOf(
            address(this),
            currentProduct.tokenId
        );
        require(
            contractTokenBalance >= currentOrder.quantity,
            "Escrow does not hold enough tokens"
        );

        uint256 fee = (totalPrice * 10) / 100; // 10% total platform cut
        uint256 sellerAmount = totalPrice - fee;

        address referrer = currentOrder.referrer;
        uint256 referrerCut = 0;
        if (referrer != address(0)) {
            referrerCut = (totalPrice * 2) / 100; // 2% referral commission
        }
        uint256 adminCut = fee - referrerCut; // remainder to admin; sums to `fee` by construction

        // Effects: mark done first
        currentOrder.status = OrderStatus.Done;

        // Interaction 1: transfer ERC1155 token from contract -> buyer
        IERC1155(erc1155Address).safeTransferFrom(
            address(this),
            buyer,
            currentProduct.tokenId,
            currentOrder.quantity,
            ""
        );

        // Interaction 2: pay seller, referrer (if any), and admin (push)
        (bool successSeller, ) = currentProduct.seller.call{
            value: sellerAmount
        }("");
        require(successSeller, "Transfer to seller failed");

        if (referrerCut > 0) {
            (bool successReferrer, ) = payable(referrer).call{
                value: referrerCut
            }("");
            require(successReferrer, "Transfer to referrer failed");
        }

        (bool successAdmin, ) = adminAddress.call{value: adminCut}("");
        require(successAdmin, "Transfer fee to admin failed");

        if (referrerCut > 0) {
            emit ReferralPaid(orderId, referrer, buyer, referrerCut);
        }

        emit OrderCompleted(orderId, buyer, totalPrice, fee);
    }

    // ------------------------
    // Seller management (admin)
    // ------------------------
    function addSeller(address payable _newSeller) external onlyAdmin {
        require(_newSeller != address(0), "zero");
        if (!isValidSeller[_newSeller]) {
            isValidSeller[_newSeller] = true;
            sellerAddresses.push(_newSeller);
            emit SellerAdded(_newSeller);
        }
    }

    function removeSeller(address payable _seller) external onlyAdmin {
        require(isValidSeller[_seller], "Not seller");
        isValidSeller[_seller] = false;

        uint256 len = sellerAddresses.length;
        for (uint256 i = 0; i < len; i++) {
            if (sellerAddresses[i] == _seller) {
                sellerAddresses[i] = sellerAddresses[len - 1];
                sellerAddresses.pop();
                break;
            }
        }

        emit SellerRemoved(_seller);
    }

    // ------------------------
    // Helpers
    // ------------------------
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function isSeller(address _addr) external view returns (bool) {
        return isValidSeller[_addr];
    }

    // allow contract to receive ETH
    receive() external payable {}
}
