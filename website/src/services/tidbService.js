// Redirect website tidbService exports to Hostinger mysqlService
export * from '../../../src/services/mysqlService';
export {
  initMySQLTables as initTiDBTables,
  saveInquiryToMySQL as saveInquiryToTiDB,
  loadAllInquiriesFromMySQL as loadAllInquiriesFromTiDB,
  saveCustomerToMySQL as saveCustomerToTiDB,
  loadAllCustomersFromMySQL as loadAllCustomersFromTiDB,
  updateInquiryStatusInMySQL as updateInquiryStatusInTiDB,
  deleteInquiryFromMySQL as deleteInquiryFromMySQL,
  purgeDemoDataFromMySQL as purgeDemoDataFromTiDB
} from '../../../src/services/mysqlService';
