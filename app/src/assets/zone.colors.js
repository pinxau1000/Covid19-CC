const alpha = 40;
const zoneColors = [
          '#4CAF50', '#4CAF50', '#4CAF50', '#4CAF50',
          '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
          '#FF9800', '#FF5722', '#F44336', '#FF0000'
      ];
const zoneColorsAlpha = [
          `#4CAF50${alpha}`, `#4CAF50${alpha}`, `#4CAF50${alpha}`, `#4CAF50${alpha}`,
          `#8BC34A${alpha}`, `#CDDC39${alpha}`, `#FFEB3B${alpha}`, `#FFC107${alpha}`,
          `#FF9800${alpha}`, `#FF5722${alpha}`, `#F44336${alpha}`, `#FF0000${alpha}`
      ];
const zoneColorDisabled = '#CFD8DC';

const zoneColorsReversed = Array.from(zoneColors).reverse();
const zoneColorsAlphaReversed = Array.from(zoneColorsAlpha).reverse();
export {
    zoneColors,
    zoneColorsAlpha,
    zoneColorsReversed,
    zoneColorsAlphaReversed,
    zoneColorDisabled
};
