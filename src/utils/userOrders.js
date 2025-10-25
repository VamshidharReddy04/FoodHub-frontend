// utils/userOrders.js
function getCurrentUserToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userToken') || null;
}
function storageKeyFor(token) {
  return `orders_${token}`;
}
// Dispatch a custom event to notify order updates
function dispatchOrdersUpdated(token) {
  try {
    window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { token } }));
  } catch (e) {}
}
// Get orders for current user
export function getOrdersForCurrentUser() {
  const token = getCurrentUserToken();
  if (!token) return [];
  try {
    return JSON.parse(localStorage.getItem(storageKeyFor(token)) || '[]');
  } catch {
    return [];
  }
}
export function saveOrdersForCurrentUser(orders) {
  const token = getCurrentUserToken();
  if (!token) return false;
  localStorage.setItem(storageKeyFor(token), JSON.stringify(orders || []));
  dispatchOrdersUpdated(token);
  return true;
}
const timers = new Map(); // key: token_orderId -> intervalId
export function startSimulationForOrder(orderId) {
  const token = getCurrentUserToken();
  if (!token || !orderId) return;
  const key = `${token}_${orderId}`;
  if (timers.has(key)) return;

  const tick = () => {
    const orders = getOrdersForCurrentUser() || [];
    let changed = false;
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const current = Number(o.progress || 0);
        if (current >= 100) return o;
        const inc = Math.floor(8 + Math.random() * 18); // 8-25%
        const next = Math.min(100, current + inc);
        changed = true;
        return { ...o, progress: next, status: next >= 100 ? 'Reached' : 'Out for delivery' };
      }
      return o;
    });
    if (changed) saveOrdersForCurrentUser(updated);
    const finished = updated.find(o => o.id === orderId && Number(o.progress || 0) >= 100);
    if (finished) stopSimulationForOrder(orderId);
  };
  const id = setInterval(tick, 2000);
  timers.set(key, id);
}
export function stopSimulationForOrder(orderId) {
  const token = getCurrentUserToken();
  if (!token || !orderId) return;
  const key = `${token}_${orderId}`;
  const id = timers.get(key);
  if (id) {
    clearInterval(id);
    timers.delete(key);
  }
}
export function startSimulationsForAll() {
  const orders = getOrdersForCurrentUser() || [];
  orders.forEach(o => {
    if (Number(o.progress || 0) < 100) startSimulationForOrder(o.id);
  });
}
export function addOrderForCurrentUser(order) {
  const token = getCurrentUserToken();
  if (!token || !order) return false;
  const key = storageKeyFor(token);
  const existing = getOrdersForCurrentUser() || [];
  existing.unshift(order);
  localStorage.setItem(key, JSON.stringify(existing));
  dispatchOrdersUpdated(token);
  startSimulationForOrder(order.id);
  try { window.dispatchEvent(new CustomEvent('orderAdded', { detail: { token, order } })); } catch (e) {}
  return true;
}
export function removeUndeliveredOrdersForCurrentUser() {
  const token = getCurrentUserToken();
  if (!token) return false;
  const key = storageKeyFor(token);
  const existing = getOrdersForCurrentUser() || [];
  const kept = existing.filter(o => !!o.delivered);
  localStorage.setItem(key, JSON.stringify(kept));
  dispatchOrdersUpdated(token);
  return true;
}
export function clearOrdersForCurrentUser() {
  const token = getCurrentUserToken();
  if (!token) return false;
  localStorage.removeItem(storageKeyFor(token));
  dispatchOrdersUpdated(token);
  return true;
}