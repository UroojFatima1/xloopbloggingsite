const rateMap = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const userData = rateMap.get(ip) || { count: 0, startTime: now };

  if (now - userData.startTime > windowMs) {
    rateMap.set(ip, { count: 1, startTime: now });
    return true;
  }

  if (userData.count >= limit) return false;

  userData.count++;
  rateMap.set(ip, userData);
  return true;
}
