# Specification

## Summary
**Goal:** Fix the Wish create/edit crash caused by an invalid empty-string value used in the bouquet attachment Select dropdown, while preserving the ability to have no bouquet selected.

**Planned changes:**
- Update bouquet Select dropdowns on **CreateWishPage** and **EditWishPage** to avoid any `<SelectItem value="">` usage, while still supporting a “No bouquet” / cleared state.
- Ensure bouquet selection state maps correctly to the submit payload: when cleared/“No bouquet”, send `bouquetId: null` and avoid any BigInt conversion for non-numeric sentinel values.
- Keep the Select placeholder (“Select a bouquet (optional)”) visible when no bouquet is selected.

**User-visible outcome:** Users can open Create Wish and Edit Wish without error banners/console crashes, choose a bouquet optionally, or clear/remove it so the wish saves with `bouquetId = null` and the placeholder displays.
