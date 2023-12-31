export type UserInfo = {
  Address: string;
  Client_Id: string;
  Email_Address: string;
  First_Name: string;
  Last_Name: string;
  Password: string;
  Phone_Number: string;
  Registration_Date: string;
  Role: string;
  id: string;
  Verified: boolean;
};
export type inventoryList = {
  Availability: boolean;
  Category: string;
  Created_By: string;
  Created_On: string;
  Description: string;
  Image_Url: string;
  Inventory_Id: string;
  Last_Updated_By: string;
  Last_Updated_On: string;
  Name: string;
  Price: number;
  Quantity_In_Stock: number;
  Duration: number;
  id: string;
};
export type AnnouncementInfo = {
  Announcement_Id:string;
  Announcement_Name:string;
  Created_By:string;
  Created_On:string;
  Image_Url:string;
  Visibility:boolean;
  id: string;
}

export type OrderInfo = {
  Order_Id: string;
  Order_Type: string;
  Order_Date: string;
  Status: string;
  Completed_On: string;
  Has_Checklist: string;
  Checklist_Id: string;
  Client_Id: string;
  Client_Name: string;
  Address: string;
  Phone_Number: string;
  SMS_Request_Count: number;
  Total_Weight: string;
  Load_Count: string;
  Total_Price: string;
  Payment_Method: string;
  Wash_Cycle_Id: string;
  Wash_Cycle: string;
  Wash_Cost: string;
  Dry_Cycle_Id: string;
  Dry_Cycle: string;
  Dry_Cost: string;
  Detergent_Id: string;
  Detergent: string;
  Detergent_Cost: string;
  Fabric_Conditioner_Id: string;
  Fabric_Conditioner: string;
  Fabcon_Cost: string;
  Services_Id: string;
  Services: string;
  Service_Cost: string;
  id: string;
};


