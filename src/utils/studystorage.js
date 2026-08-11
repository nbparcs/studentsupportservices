export function saveStudyData(data){

  const existing =
    JSON.parse(localStorage.getItem("studyResults")) || [];

  existing.push(data);

  localStorage.setItem(
    "studyResults",
    JSON.stringify(existing)
  );

}


export function getStudyData(){

 return JSON.parse(
   localStorage.getItem("studyResults")
 ) || [];

}