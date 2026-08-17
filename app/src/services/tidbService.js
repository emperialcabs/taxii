// Legacy TiDB alias file — Redirects to Hostinger MySQL Database Service
export * from './mysqlService';
export {
  initMySQLTables as initTiDBTables,
  saveInquiryToMySQL as saveInquiryToTiDB,
  loadAllInquiriesFromMySQL as loadAllInquiriesFromTiDB,
  saveCustomerToMySQL as saveCustomerToTiDB,
  loadAllCustomersFromMySQL as loadAllCustomersFromTiDB,
  updateInquiryStatusInMySQL as updateInquiryStatusInTiDB,
  deleteInquiryFromMySQL as deleteInquiryFromTiDB,
  purgeDemoDataFromMySQL as purgeDemoDataFromTiDB
} from './mysqlService';
