export default function getFacetsByType(
  selectedFacets: Record<string, string[]>,
  type: string
) {
  if (!selectedFacets[type] || selectedFacets[type].length < 1) {
    return null;
  }
  return selectedFacets[type];
}
