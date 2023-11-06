import { OrderInfo } from "../types/global";

export const filterByToday = (data: OrderInfo[]) => {
    // Filter for orders that were placed today
    const today = new Date();
    return data.filter((item) => {
      const orderDate = new Date(item.Order_Date);
      return (
        orderDate.toDateString() === today.toDateString() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
  };

 export const filterByThisWeek = (data: OrderInfo[]) => {
    // Filter for orders placed within the current week
    const now = new Date().getTime();  // Convert current date to milliseconds
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;  // Calculate one week ago in milliseconds
    return data.filter((item) => {
      const orderDate = new Date(item.Order_Date).getTime();  // Convert order date to milliseconds
      return orderDate >= oneWeekAgo;
    });
  };

 export const filterByThisMonth = (data: OrderInfo[]) => {
    const now = new Date();
    return data.filter((item) => {
      const orderDate = new Date(item.Order_Date);
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    });
  };

export  const filterByThisYear = (data: OrderInfo[]) => {
    const now = new Date();
    return data.filter((item) => {
      const orderDate = new Date(item.Order_Date);
      return orderDate.getFullYear() === now.getFullYear();
    });
  };
