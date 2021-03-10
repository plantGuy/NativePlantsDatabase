$(document).ready(() => {
  main();
});

function main() {
  getFields("results", false);
  getFields("searchPanel", true);
}

function getPlants() {
  $(".field").empty();
  getData((data) => {
    console.log(data);
    fields = $(".field"); //get the list of fields on the form
    for (i = 0; i < fields.length; i++) {
      let field = $(fields[i]).attr("ID").replaceAll("result", ""); //get the ID of the current field

      if (data[field]) {
        let values = data[field].Values; //retrieve field values
        console.log(values);
        if (values) {
          if (Array.isArray(values)) {
            $("#result" + field).append(`<UL ID="list${field}">`);
            makeList(values, field); // If multple values format as list
          } else {
            let result = `<P>${values}</p>`; //If only one value display
            $("#result" + field).html(result);
          }
        }
      }
    }
  });
}

function getFields(target, input = false) {
  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/fields",
    type: "GET",
    dataType: "JSON",
    data: {},
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      data.forEach((field) => {
        //Add each field to the target div
        if (input == true) {
          if (field.values) {
            $("#" + target).append(`
          <div class='srchFieldDiv'>
          <label for='${field.dbName}'>${field.fieldName}</label>
          <select ID='${field.dbName}' Name='${field.dbName}'  class='srchField' >
          </Div>`);
            $("#" + field.dbName).append('<option value="" selected></option>');
            field.values.forEach((value) => {
              //populate select options
              console.log(value);
              console.log(field.dbName);
              $("#" + field.dbName).append(
                `<option value='${value.ValueID}'>${value.Value}</Option>`
              );
            });
          } else {
            $("#" + target).append(
              $("#searchPanel").append(`
          <div class='srchFieldDiv'>
          <label for='${field.dbName}'>${field.fieldName}</label>
          <input ID='${field.dbName}' class='srchField' Name='${field.dbName}'>
          </Div>`)
            );
          }
        } else {
          $("#" + target).append(
            `<div style='width:auto;float:left;'>
                <div class="resultLabel">${field.fieldName}</div>
                <div id="result${field.dbName}" class="field"></div>
              </div>
          `
          );
        }
      });
    },
  });
}

function getData(next) {
  var search = {};

  var inputs = document.getElementsByClassName("srchField");

  Array.prototype.forEach.call(inputs, (fld) => {
    if (fld.value) {
      search[fld.id] = fld.value;
    }
  });
  console.log(search);

  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/nativePlants",
    type: "GET",
    dataType: "JSON",
    data: {
      search: JSON.stringify(search),
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
      result = result + `<li>${fldValue.Value}</li>`; //builds a list of values
      x = x + 1;
      if (x == valList.length + 1) {
        $("#result" + field + " UL").html(result); //if the last item then return. Could rewrite with Promise.all
        resolve(result);
      }
    });
  });
}
