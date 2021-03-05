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
      makeList(data[0].strCommonName, "strCommonName");
      makeList(data[0].flgNativeTo, "flgNativeTo");
      makeList(data[0].strSpecialUses, "strSpecialUses");
      makeList(
        data[0].strPlantingRecommendations,
        "strPlantingRecommendations"
      );

      makeList(data[0].strGrowthPatterns, "strGrowthPatterns");
    },
  });
}

function getFieldValue(field, fldID, next) {
  console.log(fldID);

  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/fieldValues",
    type: "GET",
    data: {
      fieldID: fldID,
      field: field,
    },
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      console.log(data);
      return next(data[0].Value);
    },
  });
}

function makeList(valObject, field) {
  var result = "";
  if (Array.isArray(valObject)) {
    result = result + "<UL>";
    var x = 0;
    valObject.forEach((fieldID) => {
      console.log(fieldID);
      getFieldValue(field, fieldID, (fldValue) => {
        console.log(fldValue);
        result = result + `<li>${fldValue}</li>`;
        console.log(result);
        x = x + 1;
        if (x == valObject.length) {
          result = result + "</UL>";
          $("#" + field).html(result);
          return result;
        }
      });
    });
  } else {
    result = `<P>${valObject}</p>`;
    $("#" + field).html(result);
  }
}
