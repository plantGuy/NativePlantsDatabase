function getPlants() {
  var name = $(ScientificName).val();
  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/nativePlants",
    type: "GET",
    data: {
      search: { strSciName: name },
    },
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      console.log(data);
      $("#strCommonName").val(data.strCommonName);
      $("#flgNativeTo").val(data.flgNativeTo);
      $("#strSpecialUses").val(data.strSpecialUses);
      $("#strPlantingRecommendations").val(data.strPlantingRecommendations);
      $("#strGrowthPatterns").val(data.strGrowthPatterns);
    },
  });
}
