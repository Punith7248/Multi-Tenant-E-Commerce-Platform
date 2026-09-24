// Single source of truth for every enum. Models, middleware and controllers all import from here.

const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
});

const ORDER_STATUS = Object.freeze({
  PENDING: 'pending', // created at checkout, waiting for Stripe's webhook
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

// Legal next states. The schema only checks that a status is *a* valid value;
// the transition rule is enforced in the order controller (Week 3) with an atomic filter:
//   Order.findOneAndUpdate({ _id, storeId, status: from }, { status: to })
const ORDER_STATUS_TRANSITIONS = Object.freeze({
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PAID]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
});

module.exports = {
  ROLES,
  ROLE_VALUES: Object.values(ROLES),
  ORDER_STATUS,
  ORDER_STATUS_VALUES: Object.values(ORDER_STATUS),
  ORDER_STATUS_TRANSITIONS,
};
