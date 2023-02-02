export class PermissionConstants {
  public static VIEW_LOAN_TNG_STATUS_PERMISSION: any = {
    INITIALIZED: 'dashboardApplications:findInitializeTngLoan',
    AUCTION: 'dashboardApplications:findPendingForMatchingTngLoan',
    DOCUMENT_AWAITING: 'dashboardApplications:findDocumentAwaitingTngLoan',
    DOCUMENTATION_COMPLETE: 'dashboardApplications:findDocumentCompleteTngLoan',
    FUNDED: 'dashboardApplications:findAwaitingContractTngLoan',
    CONTRACT_ACCEPTED: 'dashboardApplications:findContractAcceptedTngLoan',
    AWAITING_DISBURSEMENT:
      'dashboardApplications:findAwaitingDisbursementTngLoan',
    DISBURSED: 'dashboardApplications:findDisbursedTngLoan',
    IN_REPAYMENT: 'dashboardApplications:findUnderRepaymentTngLoan',
    COMPLETED: 'dashboardApplications:findCompletedTngLoan',
    REJECTED: 'dashboardApplications:findRejectedTngLoan',
    WITHDRAW: 'dashboardApplications:findWithdrawTngLoan',
    CONTRACT_REJECTED: 'dashboardApplications:findContractRejectTngLoan',
  };

  public static VIEW_LOAN_VAC_STATUS_PERMISSION: any = {
    INITIALIZED: 'dashboardApplications:findInitializeVacLoan',
    AUCTION: 'dashboardApplications:findPendingForMatchingVacLoan',
    DOCUMENT_AWAITING: 'dashboardApplications:findDocumentAwaitingVacLoan',
    DOCUMENTATION_COMPLETE: 'dashboardApplications:findDocumentCompleteVacLoan',
    FUNDED: 'dashboardApplications:findAwaitingContractVacLoan',
    CONTRACT_ACCEPTED: 'dashboardApplications:findContractAcceptedVacLoan',
    AWAITING_DISBURSEMENT:
      'dashboardApplications:findAwaitingDisbursementVacLoan',
    DISBURSED: 'dashboardApplications:findDisbursedVacLoan',
    IN_REPAYMENT: 'dashboardApplications:findUnderRepaymentVacLoan',
    COMPLETED: 'dashboardApplications:findCompletedVacLoan',
    REJECTED: 'dashboardApplications:findRejectedVacLoan',
    WITHDRAW: 'dashboardApplications:findWithdrawVacLoan',
    CONTRACT_REJECTED: 'dashboardApplications:findContractRejectVacLoan',
  };

  public static CHANGE_LOAN_TNG_STATUS_PERMISSION: any = {
    INITIALIZED: 'paydays:updateStatusInitializeTngLoan',
    AUCTION: 'paydays:updateStatusPendingForMatchingTngLoan',
    DOCUMENT_AWAITING: 'paydays:updateStatusDocumentAwaitingTngLoan',
    DOCUMENTATION_COMPLETE: 'paydays:updateStatusDocumentCompleteTngLoan',
    FUNDED: 'paydays:updateStatusAwaitingContractTngLoan',
    CONTRACT_ACCEPTED: 'paydays:updateStatusContractAcceptedTngLoan',
    AWAITING_DISBURSEMENT: 'paydays:updateStatusAwaitingDisbursementTngLoan',
    DISBURSED: 'paydays:updateStatusDisbursedTngLoan',
    IN_REPAYMENT: 'paydays:updateStatusUnderRepaymentTngLoan',
    COMPLETED: 'paydays:updateStatusCompletedTngLoan',
    REJECTED: 'paydays:updateStatusRejectedTngLoan',
    WITHDRAW: 'paydays:updateStatusWithdrawTngLoan',
    CONTRACT_REJECTED: 'paydays:updateStatusContractRejectTngLoan',
  };

  public static CHANGE_LOAN_VAC_STATUS_PERMISSION: any = {
    INITIALIZED: 'paydays:updateStatusInitializeVacLoan',
    AUCTION: 'paydays:updateStatusPendingForMatchingVacLoan',
    DOCUMENT_AWAITING: 'paydays:updateStatusDocumentAwaitingVacLoan',
    DOCUMENTATION_COMPLETE: 'paydays:updateStatusDocumentCompleteVacLoan',
    FUNDED: 'paydays:updateStatusAwaitingContractVacLoan',
    CONTRACT_ACCEPTED: 'paydays:updateStatusContractAcceptedVacLoan',
    AWAITING_DISBURSEMENT: 'paydays:updateStatusAwaitingDisbursementVacLoan',
    DISBURSED: 'paydays:updateStatusDisbursedVacLoan',
    IN_REPAYMENT: 'paydays:updateStatusUnderRepaymentVacLoan',
    COMPLETED: 'paydays:updateStatusCompletedVacLoan',
    REJECTED: 'paydays:updateStatusRejectedVacLoan',
    WITHDRAW: 'paydays:updateStatusWithdrawVacLoan',
    CONTRACT_REJECTED: 'paydays:updateStatusContractRejectVacLoan',
  };

  public static APPLICATION_DOCUMENT_TYPE_PERMISSION: any = {
    GET_LIST: 'monexCore:searchPaginationRequiredDocumentType',
    CREATE: 'monexCore:createApplicationDocumentType',
    UPDATE: 'monexCore:updateApplicationDocumentType',
    DELETE: 'monexCore:deleteApplicationDocumentType',
  };

  public static APPLICATION_DOCUMENT_PERMISSION: any = {
    GET_LIST: 'monexCore:searchRequiredDocumentPagination',
    CREATE: 'monexCore:createApplicationDocument',
    UPDATE: 'monexCore:updateApplicationDocument',
    DELETE: 'monexCore:deleteApplicationDocument',
  };

  public static CONTRACT_TEMPLATE_PERMISSION: any = {
    GET_LIST: 'monexCore:searchPaginationContractTemplate'
  };

  public static DASHBOARD_PERMISSION: any = {
    GET_LIST_BNPL: 'dashboardBnplApplications:findBnplApplications',
    GET_BY_ID_BNPL: 'dashboardBnplApplications:getBnplApplicationById',
    GET_LIST_TNG: 'dashboardApplications:findTngApplications',
    GET_LIST_HMG: 'dashboardHmgApplications:findApplications',
    GET_BY_ID_HMG: 'dashboardHmgApplications:getLoanById',
    GET_LIST_VAC: 'dashboardApplications:findVacApplications',
    GET_LIST_MERCHANT: 'dashboardMerchants:getMerchants',
    GET_LIST_CUSTOMER: 'dashboardCustomers:getCustomers',
    GET_BY_ID_CUSTOMER: 'dashboardCustomers:getCustomerById',
    GET_LIST_ADMIN_ACCOUNT: 'dashboardAdminAccounts:getAdminAccounts',
    GET_BY_ID_ADMIN_ACCOUNT: 'dashboardAdminAccounts:getAdminAccountById',
    GET_EKYC_INFO: 'dashboardEkyc:getEkycInfo',
    GET_LIST_EKYC_INFO_BY_CUSTOMER_ID:
      'dashboardCustomers:getEkycInfoByCustomerId',
    GET_LIST_GROUP: 'dashboardGroups:getGroups',
  };

  public static VIEW_BNPL_STATUS_PERMISSION: any = {
    PENDING: 'dashboardApplications:findPendingBnplLoan',
    UNDOAPPROVAL: 'dashboardApplications:findUndoApprovalBnplLoan',
    APPROVE: 'dashboardApplications:findApproveBnplLoan',
    REJECT: 'dashboardApplications:findRejectBnplLoan',
    DISBURSE: 'dashboardApplications:findDisburseBnplLoan',
    CONTRACT_ACCEPTED: 'dashboardApplications:findContractAcceptedBnplLoan',
    CONTRACT_AWAITING: 'dashboardApplications:findContractAwaitingBnplLoan',
    WITHDRAW: 'dashboardApplications:findWithdrawBnplLoan',
    COMPLETED: 'dashboardApplications:findCompletedBnplLoan',
  };

  public static OPERATOR_PERMISSION: any = {
    GET_BNPL_USER_STATUS: 'operatorBnpl:getByUserStatus',
  };
}
