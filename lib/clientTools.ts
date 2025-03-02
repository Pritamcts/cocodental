import { ClientToolImplementation } from "ultravox-client";

// Client-implemented tool for Order Details
export const updateOrderTool: ClientToolImplementation = (parameters) => {
  console.debug("Received order details update parameters:", parameters);
  const { ...orderData } = parameters;
  console.debug("Received order details update:", orderData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("orderDetailsUpdated", {
      detail: orderData,
    });
    window.dispatchEvent(event);
  }

  return "Updated the order details.";
};






// export const getAvailabilityTool: ClientToolImplementation = () => {
//   console.debug("Fetching all available time slot:");

//   if (typeof window !== "undefined") {
//     const event = new CustomEvent("fetchAvailability");
//     window.dispatchEvent(event);
//   }

//   return "fetched all available time slots";
// };