export function testPrimitive(any: any): boolean {
  if (!any) return true;
  return (
    typeof any === "string" ||
    typeof any === "number" ||
    typeof any === "boolean"
  );
}
export default testPrimitive;
