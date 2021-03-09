function getPlants() {
  $(".field").empty();
  getData((data) => {
    console.log(data);
    fields = $(".field");
    for (i = 0; i < fields.length; i++) {
      let field = $(fields[i]).attr("ID");
      if (data[field]) {
        let values = data[field].Values;
        console.log(values);
        if (values) {
          if (Array.isArray(values)) {
            $("#" + field).append(`<UL ID="list${field}">`);
            //parseValues(values, field).then((newValues) => {
            makeList(values, field);
            //});
          } else {
            let result = `<P>${values}</p>`;
            $("#" + field).html(result);
          }
        }
      }
    }
  });
}

function parseValues(valueList, fieldName, next) {
  newValues = [];
  var y = 1;
  return new Promise((resolve, reject) => {
    for (x = 0; x < valueList.length; x++) {
      var fieldID = valueList[x];
      console.log(fieldID);
      $("#" + fieldName + " UL").append(
        `<li ID="li${fieldID.replace(/\s/g, "")}"></li>`
      );
      getFieldValue(fieldName, fieldID, (newValue) => {
        if (newValue) {
          newValues[x] = newValue;
        } else {
          $(`#li${fieldID}`).html(fieldID);
        }
        y++;
        if (y == valueList.length + 1) {
          resolve(newValues);
        }
      });
    }
  });
}

function getData(next) {
  var name = $(ScientificName).val();
  var strSciName = name;

  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/nativePlants",
    type: "GET",
    dataType: "JSON",
    data: {
      search: JSON.stringify({ strSciName }),
      partial: true,
    },
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      return next(data);
    },
  });
}

function getFieldValue(field, fldID, next) {
  console.log(fldID);

  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/fieldValues",
    type: "GET",
    dataType: "JSON",
    data: {
      fieldID: fldID.trim(),
      field: field,
    },
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      if (data && data.length > 0) {
        $(`#li${data[0].ValueID}`).html(data[0].Value);
      } else {
        $(`#li${fldID.replace(/\s/g, "")}`).html(fldID);
      }
      return next(data[0].Value);
    },
  });
}

function makeList(valList, field, next) {
  return new Promise((resolve, rejet) => {
    var result = "";

    var x = 1;
    valList.forEach((fldValue) => {
      console.log(fldValue);
      result = result + `<li>${fldValue.Value}</li>`;
      console.log(result);
      x = x + 1;
      if (x == valList.length + 1) {
        $("#" + field + " UL").html(result);
        resolve(result);
      }
    });
  });
}
