export function unique_id () {
  const timestamp = Date.now().toString(36);
  const randomData = Math.random().toString(36).slice(2, 10);
  return `${timestamp}${randomData}`;
}
