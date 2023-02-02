export enum BNPL_STATUS {
  PENDING = 'PENDING',
  UNDOAPPROVAL = 'UNDOAPPROVAL',
  APPROVE = 'APPROVE',
  DISBURSE = 'DISBURSE',
  CONTRACT_ACCEPTED = 'CONTRACT_ACCEPTED',
  CONTRACT_AWAITING = 'CONTRACT_AWAITING',
  WITHDRAW = 'WITHDRAW',
  COMPLETED = 'COMPLETED',
}

export enum REPAYMENT_STATUS {
  OVERDUE = 'OVERDUE',
  BADDEBT = 'BADDEBT',
  PAYMENT_TERM_1 = 'PAYMENT_TERM_1',
  PAYMENT_TERM_2 = 'PAYMENT_TERM_2',
  PAYMENT_TERM_3 = 'PAYMENT_TERM_3',
}

export enum MERCHANT_SELL_TYPE_TEXT {
  OFFLINE = 'merchant.merchant_sell_type.offline',
  ONLINE = 'merchant.merchant_sell_type.online',
  ALL = 'merchant.merchant_sell_type.all',
}

export enum GPAY_REPAYMENT_STATUS {
  ORDER_SUCCESS = 'success',
  ORDER_PENDING = 'pending',
  ORDER_PROCESSING = 'processing',
  ORDER_FAILED = 'failed',
  ORDER_CANCEL = 'cancel',
  ORDER_VERIFYING = 'verifying',
}

export enum BNPL_PERIOD {
  PERIOD_TIME_1 = 'PERIOD_TIME_1',
  PERIOD_TIME_2 = 'PERIOD_TIME_2',
  PERIOD_TIME_3 = 'PERIOD_TIME_3',
  PERIOD_TIME_4 = 'PERIOD_TIME_4',
}

export enum BNPL_PAYMENT_TYPE {
  SINGLE_PERIOD = 'SINGLE_PERIOD',
  ALL_PERIOD = 'ALL_PERIOD',
}

export enum PAYMENT_METHOD {
  GPAY_VA = 'GpayVirtualAccount',
  GPAY_NAPAS = 'GpayNapas',
  TRANSFER = 'TRANSFER',
  IN_CASH = 'IN_CASH',
}

export enum PAYMENT_METHOD_TEXT {
  GpayVirtualAccount = 'bnpl.repayment_transaction.payment_type.gpay_va',
  GpayNapas = 'bnpl.repayment_transaction.payment_type.gpay_napas',
  TRANSFER = 'bnpl.repayment_transaction.payment_type.transfer',
  IN_CASH = 'bnpl.repayment_transaction.payment_type.in_cash',
}
