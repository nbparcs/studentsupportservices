let currentAOIs = [];

export function updateAOIs() {
  const elements = document.querySelectorAll("[data-aoi]");

  currentAOIs = Array.from(elements)
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    })
    .map((element) => ({
      name: element.dataset.aoi,
      element,
    }));

  console.log("AOIs found:", currentAOIs.map((aoi) => aoi.name));

  return currentAOIs;
}

export function getAOIs() {
  return currentAOIs;
}

export function findAOI(x, y) {
  // Refresh if the page has no registered AOIs.
  if (currentAOIs.length === 0) {
    updateAOIs();
  }

  // Prefer the smallest matching AOI for more specific labels.
  const matchingAOIs = currentAOIs
    .filter(({ element }) => {
      if (!element.isConnected) return false;

      const rect = element.getBoundingClientRect();

      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
    })
    .sort((a, b) => {
      const rectA = a.element.getBoundingClientRect();
      const rectB = b.element.getBoundingClientRect();

      return (
        rectA.width * rectA.height -
        rectB.width * rectB.height
      );
    });

  return matchingAOIs[0]?.name ?? "Outside AOI";
}
