$(document).ready(function() {
  $("#add").click(function(e, poxos) {
    var lastField = $("#buildyourform div:last");
    var intId =
      (lastField && lastField.length && lastField.data("idx") + 1) || 2;
    var fieldWrapper = $(
      '<div class="fieldwrapper" style=\'display: flex;flex-direction: row\' id="field' +
        "-" +
        intId +
        '"/>'
    );
    fieldWrapper.data("idx", intId);
    var fName = $(
      '<input type="file"  name=\'item\'/><input name="name" class="form-control" type="text" required placeholder="Item Name"/><input name="price"  class="form-control" type="number" placeholder="Item Price" required/><input class="form-control" name="desc" type="text" placeholder="Item Description"/>'
    );
    var removeButton = $(
      '<button type="button" class="button hollow circle" data-quantity="minus" data-field="quantity">\n' +
        '      <i class="fa fa-minus" aria-hidden="true"></i>\n' +
        "    </button>"
    );
    removeButton.click(function() {
      $(this)
        .parent()
        .remove();
    });
    fieldWrapper.append(fName);
    fieldWrapper.append(removeButton);
    $(".For-append").append(fieldWrapper);
  });

  $("#preview").click(function() {
    $("#yourform").remove();
    var fieldSet = $(
      '<fieldset id="yourform"><legend>Your Form</legend></fieldset>'
    );
    $("#buildyourform div").each(function() {
      var id =
        "input" +
        $(this)
          .attr("id")
          .replace("field", "");
      var label = $(
        '<label for="' +
          id +
          '">' +
          $(this)
            .find("input.fieldname")
            .first()
            .val() +
          "</label>"
      );

      fieldSet.append(label);
    });
    $("body").append(fieldSet);
  });
  $(document).on("click", ".removeItem", function() {
    console.log("Haaaaaaaaaaaaaaaa");
    $(this)
      .parent()
      .remove();
  });
});
var removable = document.getElementsByClassName("removeItem");
removable.onClick.listen(function(e) {
  removable.clear();
});
