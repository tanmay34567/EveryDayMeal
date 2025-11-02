import apiInstance from './api';
import { studentAuth, studentMeals, studentReviews } from './studentService';
import { vendorAuth, vendorMenus, vendorOrders, vendorReviews } from './vendorService';
import { vendorApplicationService } from './vendorApplicationService';
import contactService from './contactService';

export {
  apiInstance as api,
  studentAuth,
  studentMeals,
  studentReviews,
  vendorAuth,
  vendorMenus,
  vendorOrders,
  vendorReviews,
  contactService,
  vendorApplicationService
};
