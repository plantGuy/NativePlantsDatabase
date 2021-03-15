var formFields = {};

$(document).ready(() => {
  main();
});

function main() {
  getFields((fields) => {
    formFields = fields;
    displauFields("searchPanel", fields, true);

    //displauFields("results", fields, false);
    //displauFields("searchPanel", fields, true);
  });
  //displauFields(target, fieldlist, input = false)
}

function normalize(valueList, field, RecID) {
  console.log("insert function to normalize data here");
}

function getrelatedFields(fieldName) {
  //some data was spread over many fields, this finds the related data
  var matches = formFields.find((field) => {
    if (field.dbName == fieldName) {
      if (field.values[0].relatedField) {
        return field.values;
      }
    }
  });
  if (matches) {
    return matches.values.map((value) => {
      return value;
    });
  }
}

function getPlants(next) {
  var search = {};

  $("#plantsList").css("display", "block");

  var inputs = document.getElementsByClassName("srchField");

  Array.prototype.forEach.call(inputs, (fld) => {
    if (fld.value) {
      if (isNaN(fld.value)) {
        search[fld.id] = fld.value;
      } else {
        search[fld.id] = parseInt(fld.value);
      }
    }
  });
  getData(search, (data) => {
    console.log(data);
    var template = document.getElementById("PNGuide").innerHTML;
    var renderPlants = Handlebars.compile(template);
    var tmpHTML = renderPlants({
      plant: data,
    });
    document.getElementById("plantsList").innerHTML = tmpHTML;
  });
}

function displauFields(target, fieldlist, input = false) {
  fieldlist.forEach((field) => {
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
}

function getFields(next) {
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
      return next(data);
    },
  });
}

function getData(search, next) {
  //var search = {};

  //var inputs = document.getElementsByClassName("srchField");

  // Array.prototype.forEach.call(inputs, (fld) => {
  //   if (fld.value) {
  //     if (isNaN(fld.value)) {
  //       search[fld.id] = fld.value;
  //     } else {
  //       search[fld.id] = parseInt(fld.value);
  //     }
  //   }
  // });
  console.log(search);

  $.ajax({
    //http://localhost:3000/JSON/nativePlants?search={%22Species%22:%22Asclepias%22}
    url: "/JSON/nativePlants",
    type: "GET",
    dataType: "JSON",
    data: {
      search: JSON.stringify(search),
      //partial: true,
    },
    error: function (error) {
      console.log(error);
    },
    success: function (data) {
      return next(data);
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
