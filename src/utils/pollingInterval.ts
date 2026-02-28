export function getPollingInterval(): number {
  const now = new Date();
  const hour = now.getHours();

  // Jam sibuk
  if ((hour >= 9 && hour < 10) || (hour >= 17 && hour < 18)) {
    return 30 * 1000; // 30 detik
  }

  // Jam normal
  return 60 * 60 * 1000; // 1 jam
  // return 30 * 1000; // 30 detik
}
