var _ = require("lodash");

function handleGetClient(users) {
  const admin = _.find(
    users,
    (usr) =>
      usr.address.toLowerCase() === process.env.ADMIN_ADDRESS.toLowerCase()
  );

  const seller1 = _.find(
    users,
    (usr) =>
      usr.address.toLowerCase() === process.env.SELLER1_ADDRESS.toLowerCase()
  );

  const seller2 = _.find(
    users,
    (usr) =>
      usr.address.toLowerCase() === process.env.SELLER2_ADDRESS.toLowerCase()
  );

  const seller3 = _.find(
    users,
    (usr) =>
      usr.address.toLowerCase() === process.env.SELLER3_ADDRESS.toLowerCase()
  );

  const buyer = _.find(
    users,
    (usr) =>
      usr.address.toLowerCase() === process.env.BUYER_ADDRESS.toLowerCase()
  ) || null;

  return {
    admin,
    seller1,
    seller2,
    seller3,
    buyer,
  };
}

module.exports = {
  handleGetClient,
};

