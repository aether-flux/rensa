export function unique_id () : string {
  const timestamp: string = Date.now().toString(36);
  const randomData: string = Math.random().toString(36).slice(2, 10);
  return `${timestamp}${randomData}`;
}
