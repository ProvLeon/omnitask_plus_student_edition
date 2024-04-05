// src/utils/pubSub.ts
type Callback = (data: any) => void;

const events: Record<string, Callback[]> = {};

export const subscribe = (event: string, callback: Callback) => {
  if (!events[event]) {
    events[event] = [];
  }
  events[event].push(callback);
  return () => unsubscribe(event, callback);
};

export const unsubscribe = (event: string, callback: Callback) => {
  if (events[event]) {
    events[event] = events[event].filter(cb => cb !== callback);
  }
};

export const publish = (event: string, data: any) => {
  if (events[event]) {
    events[event].forEach(callback => callback(data));
  }
};
