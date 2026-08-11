let currentAOIs = [];


/*
  Find all elements with data-aoi attributes
*/
export function updateAOIs() {

  const elements = document.querySelectorAll("[data-aoi]");


  currentAOIs = Array.from(elements).map((element) => ({

    name: element.dataset.aoi,

    element: element,

  }));


  console.log(
    "AOIs found:",
    currentAOIs.map((aoi) => aoi.name)
  );

}



/*
  Get current AOIs
*/
export function getAOIs() {

  return currentAOIs;

}



/*
  Find which AOI contains gaze coordinates
*/
export function findAOI(x, y) {


  for (const aoi of currentAOIs) {


    const rect =
      aoi.element.getBoundingClientRect();



    if (

      x >= rect.left &&

      x <= rect.right &&

      y >= rect.top &&

      y <= rect.bottom

    ) {

      return aoi.name;

    }

  }



  return "Outside AOI";

}