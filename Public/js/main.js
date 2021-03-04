function getPlants() {
  var name = $(ScientificName).val();
  var strSciName = name;

  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/nativePlants",
    type: "GET",
    data: {
      search: JSON.stringify({ strSciName }),
    },
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      console.log(data[0].strCommonName);
      $("#strCommonName").html(makeList(data[0].strCommonName));
      $("#flgNativeTo").html(makeList(data[0].flgNativeTo));
      $("#strSpecialUses").html(makeList(data[0].strSpecialUses));
      $("#strPlantingRecommendations").html(
        makeList(data[0].strPlantingRecommendations)
      );
      $("#strGrowthPatterns").html(makeList(data[0].strGrowthPatterns));
    },
  });
}

function makeList(object) {
  var result = "";
  if (Array.isArray(object)) {
    result = result + "<UL>";
    object.forEach((element) => {
      result = result + `<li>${element}</li>`;
    });
    result = result + "</UL>";
  } else {
    result = `<P>${object}</p>`;
  }
  return result;
}
