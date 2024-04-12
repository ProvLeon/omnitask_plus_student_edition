// src/utils/pubSub.ts

// Define a type for the callback function which takes any type of data as argument.
type Callback = (data: any) => void;

// Initialize an object to hold arrays of callback functions keyed by event names.
const events: Record<string, Callback[]> = {};

/**
 * Subscribes a callback function to a specific event.
 * @param event The name of the event to subscribe to.
 * @param callback The callback function to execute when the event is published.
 * @returns A function to unsubscribe the provided callback from the event.
 */
export const subscribe = (event: string, callback: Callback) => {
  // If the event does not exist, initialize it with an empty array.
  if (!events[event]) {
    events[event] = [];
  }
  // Add the callback to the list of callbacks for the event.
  events[event].push(callback);
  // Return a function that can be called to unsubscribe the callback from the event.
  return () => unsubscribe(event, callback);
};

/**
 * Unsubscribes a callback function from a specific event.
 * @param event The name of the event to unsubscribe from.
 * @param callback The callback function to remove from the event's subscription list.
 */
export const unsubscribe = (event: string, callback: Callback) => {
  // If the event exists, filter out the callback from the list of callbacks.
  if (events[event]) {
    events[event] = events[event].filter(cb => cb !== callback);
  }
};

/**
 * Publishes an event, executing all subscribed callbacks with the provided data.
 * @param event The name of the event to publish.
 * @param data The data to pass to each callback function.
 */
export const publish = (event: string, data: any) => {
  // If the event exists, execute each callback with the provided data.
  if (events[event]) {
    events[event].forEach(callback => callback(data));
  }
};
