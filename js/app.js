function paypalModal() {
  $.get("/templates/paypal-credit-modal.html", function (e) {
    (footerHTML =
      '<a href="/faq/paypal-credit" class="btn btn-info"><strong>Find Out More</strong> <i class="fa fa-chevron-right"></i></a>'),
      modalCustomButtons({
        id: "#modal_basic",
        title: "What is PayPal Credit?",
        html: e,
        footer: (footerHTML +=
          '<button type="button" class="btn btn-kf-orange" data-dismiss="modal"><strong>Close</strong> <i class="fa fa-times"></i></button>'),
      });
  });
}
function bumperModal() {
  $.get("/templates/bumper-credit-modal.html", function (e) {
    (footerHTML =
      '<a href="/about-us/bumper" class="btn btn-info"><strong>Find Out More</strong> <i class="fa fa-chevron-right"></i></a>'),
      modalCustomButtons({
        id: "#modal_basic",
        title: "Buy Now Pay Later",
        html: e,
        footer: (footerHTML +=
          '<button type="button" class="btn btn-kf-orange" data-dismiss="modal"><strong>Close</strong> <i class="fa fa-times"></i></button>'),
      });
  });
}
function modalBasic(e, a, t) {
  $(e + " .modal-title").html(a), $(e + " .modal-body").html(t), $(e).modal();
}
function modalCustomButtons(e) {
  $(e.id + " .modal-title").html(e.title),
    $(e.id + " .modal-body").html(e.html),
    $(e.id + " .modal-footer").html(e.footer),
    $(e.id).modal();
}
function addAirConditioningAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/air-conditioning/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {},
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addAirConditioningAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : "ACCEPTPRICING" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-accept-pricing", function () {
                $("#AcceptPricing").val("Y"),
                  addAirConditioningAppointmentToOrder(e, a),
                  $("#modal_custom-buttons").modal("hide"),
                  $("body").on("click", ".btn-accept-pricing").off("click");
              }))
            : "GASUNKNOWN" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-use-default-part", function () {
                $("#AcceptPricing").val("Y"),
                  $("#UseDefaultPart").val("Y"),
                  addAirConditioningAppointmentToOrder(e, a),
                  $("#modal_custom-buttons").modal("hide"),
                  $("body").on("click", ".btn-use-default-part").off("click");
              }))
            : $.ModalBasic(xml.find("TITLE").text(), xml.find("BODY").text()),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function airConditioningVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addAirConditioningAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("AIRCON", "basic", function () {
                addAirConditioningAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("AIRCON", "basic", function () {
                  $(".modal_vehicle-list").modal("hide"),
                    addAirConditioningAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  airConditioningVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addAirConCheckAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/air-conditioning/add-free-aircon-check.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {},
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addAirConCheckAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : "ACCEPTPRICING" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-accept-pricing", function () {
                $("#AcceptPricing").val("Y"),
                  addAirConCheckAppointmentToOrder(e, a),
                  $("#modal_custom-buttons").modal("hide"),
                  $("body").on("click", ".btn-accept-pricing").off("click");
              }))
            : "GASUNKNOWN" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-use-default-part", function () {
                $("#AcceptPricing").val("Y"),
                  $("#UseDefaultPart").val("Y"),
                  addAirConCheckAppointmentToOrder(e, a),
                  $("#modal_custom-buttons").modal("hide"),
                  $("body").on("click", ".btn-use-default-part").off("click");
              }))
            : $.ModalBasic(xml.find("TITLE").text(), xml.find("BODY").text()),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function airConCheckVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp?1",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addAirConCheckAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("AIRCON", "basic", function () {
                addAirConCheckAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("AIRCON", "basic", function () {
                  addAirConCheckAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  airConCheckVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addTyreInspectionAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/tyre-inspection/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addTyreInspectionAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function tyreInspectionVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addTyreInspectionAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                $(".modal_vehicle-list").modal("hide"),
                  addTyreInspectionAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  $(".modal_vehicle-list").modal("hide"),
                    addTyreInspectionAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  tyreInspectionVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addEssoOfferAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/esso-offer/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addEssoOfferAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function essoOfferVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addEssoOfferAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                $(".modal_vehicle-list").modal("hide"),
                  addEssoOfferAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  $(".modal_vehicle-list").modal("hide"),
                    addEssoOfferAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  essoOfferVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addKwikFitClubInspectionAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/club-apply/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addTyreInspectionAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function kwikFitClubVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addKwikFitClubInspectionAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("TYRES", "basic", function () {
                addKwikFitClubInspectionAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  addKwikFitClubInspectionAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  kwikFitClubVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addWheelAlignmentAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/wheel-alignment/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addWheelAlignmentAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function wheelAlignmentVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addWheelAlignmentAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                $(".modal_vehicle-list").modal("hide"),
                  addWheelAlignmentAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  $(".modal_vehicle-list").modal("hide"),
                    addWheelAlignmentAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  wheelAlignmentVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function basketCancel(e, a, t) {
  var i;
  (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/basket/cancel.asp",
      beforeSend: function (e, t) {
        jQuery.isFunction(a)
          ? a()
          : $("#modal_basic .modal-title").html(
              'Your Basket <i class="fa fa-circle-o-notch fa-spin"></i>'
            );
      },
      success: function (e, a, o) {
        jQuery.isFunction(t)
          ? t(e)
          : (jQuery.isXMLDoc(e)
              ? modalBasic(
                  "#modal_basic",
                  (xml = $(e)).find("TITLE").text(),
                  xml.find("BODY").text()
                )
              : modalBasic(
                  "#modal_basic",
                  'Unknown Error <i class="fa fa-exclamation"></i>',
                  i
                ),
            $(sel).enable().button("reset"));
      },
      error: function (e, a, t) {
        modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a),
          $(sel).enable().button("reset");
      },
    });
}
function basketExtrasAdd(e, a, t) {
  var i, o, n;
  (i = $(e)),
    $(i).attr(
      "data-loading-text",
      "<i class='fa fa-circle-o-notch fa-spin'></i> Add To Order"
    ),
    (o = {
      TyreID: $(i).attr("data-tyreid"),
      PartNumber: $(i).attr("data-partnumber"),
      BasketDisplayExtras: $("#BasketDisplayExtras").val(),
      ColDelConfirm: $(i).attr("data-coldelconfirm"),
    }),
    (n = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/basket/extras-add.asp",
      data: o,
      type: "POST",
      beforeSend: function (e, t) {
        $(i).button("loading"),
          jQuery.isFunction(a)
            ? a()
            : $("#modal_basic .modal-title").html(
                'Your Basket <i class="fa fa-circle-o-notch fa-spin"></i>'
              );
      },
      success: function (e, a, o) {
        jQuery.isFunction(t)
          ? t(e)
          : (jQuery.isXMLDoc(e)
              ? modalBasic(
                  "#modal_basic",
                  (xml = $(e)).find("TITLE").text(),
                  xml.find("BODY").text()
                )
              : modalBasic(
                  "#modal_basic",
                  'Unknown Error <i class="fa fa-exclamation"></i>',
                  n
                ),
            $(i).enable().button("reset"));
      },
      error: function (e, a, t) {
        modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a),
          $(sel).enable().button("reset");
      },
      complete: function () {
        $(i).button("reset");
      },
    });
}
function basketTyreInsuranceAdd(e, a, t) {
  var i, o, n;
  (i = $(e)),
    (o = { BasketDisplayExtras: $("#BasketDisplayExtras").val() }),
    (n = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/basket/tyre-insurance-add.asp",
      data: o,
      type: "POST",
      beforeSend: function (e, t) {
        jQuery.isFunction(a)
          ? a()
          : $("#modal_basic .modal-title").html(
              'Your Basket <i class="fa fa-circle-o-notch fa-spin"></i>'
            );
      },
      success: function (e, a, o) {
        jQuery.isFunction(t)
          ? t(e)
          : (jQuery.isXMLDoc(e)
              ? modalBasic(
                  "#modal_basic",
                  (xml = $(e)).find("TITLE").text(),
                  xml.find("BODY").text()
                )
              : modalBasic(
                  "#modal_basic",
                  'Unknown Error <i class="fa fa-exclamation"></i>',
                  n
                ),
            $(i).enable().button("reset"));
      },
      error: function (e, a, t) {
        modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a),
          $(i).enable().button("reset");
      },
    });
}
function basketUpdate(e, a, t) {
  var i, o;
  (sel = $(e)),
    (i = {
      Quantity: $(sel).val(),
      LookupLines: $(sel).attr("data-lookuplines"),
      BasketDisplayExtras: $("#BasketDisplayExtras").val(),
    }),
    (o = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/basket/update.asp",
      data: i,
      type: "POST",
      beforeSend: function (e, t) {
        $(".basket-loading").show(),
          jQuery.isFunction(a)
            ? a()
            : $("#modal_basic .modal-title").html(
                'Your Basket <i class="fa fa-circle-o-notch fa-spin"></i>'
              );
      },
      success: function (e, a, i) {
        jQuery.isFunction(t)
          ? t(e)
          : (jQuery.isXMLDoc(e)
              ? modalBasic(
                  "#modal_basic",
                  (xml = $(e)).find("TITLE").text(),
                  xml.find("BODY").text()
                )
              : modalBasic(
                  "#modal_basic",
                  'Unknown Error <i class="fa fa-exclamation"></i>',
                  o
                ),
            $(sel).prop("disabled", "disabled").button("reset"));
      },
      error: function (e, a, t) {
        modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a),
          $(sel).prop("disabled", !1).button("reset");
      },
      complete: function () {
        $(".basket-loading").hide();
      },
    });
}
function batteriesVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (a, i, o) {
        if (jQuery.isXMLDoc(a)) {
          var n = (xml = $(a)).find("STATUS").text();
          if ("SUCCESS" == n) {
            try {
              var r = $.parseJSON(xml.find("JSON").text());
            } catch (c) {
              var r = "";
            }
            if ("object" == typeof r) {
              var s = r.Vehicle;
              for (var l in s)
                s.hasOwnProperty(l) &&
                  $(e + " input[name='Vehicle." + l + "']").val(s[l]);
              $(e).submit();
            } else
              modalBasic(
                "#modal_basic",
                'JSON Data Error <i class="fa fa-exclamation"></i>',
                "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
              );
          } else
            "SUCCCESS" == n
              ? swzkgud(function () {
                  batteriesVehicleSearch(e, t);
                })
              : "NOTFOUND" == n
              ? $.ModalBasic(
                  "Vehicle Not Found.",
                  "<p>Sorry, we could not find the details for your vehicle. Please check your vehicle registration is correct.</p>"
                )
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function wiperBladesVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (a, i, o) {
        if (jQuery.isXMLDoc(a)) {
          var n = (xml = $(a)).find("STATUS").text();
          if ("SUCCESS" == n) {
            try {
              var r = $.parseJSON(xml.find("JSON").text());
            } catch (c) {
              var r = "";
            }
            if ("object" == typeof r) {
              var s = r.Vehicle;
              for (var l in s)
                s.hasOwnProperty(l) &&
                  $(e + " input[name='Vehicle." + l + "']").val(s[l]);
              $(e).submit();
            } else
              modalBasic(
                "#modal_basic",
                'JSON Data Error <i class="fa fa-exclamation"></i>',
                "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
              );
          } else
            "SUCCCESS" == n
              ? swzkgud(function () {
                  wiperBladesVehicleSearch(e, t);
                })
              : "NOTFOUND" == n
              ? $.ModalBasic(
                  "Vehicle Not Found.",
                  "<p>Sorry, we could not find the details for your vehicle. Please check your vehicle registration is correct.</p>"
                )
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function roadheroVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (a, i, o) {
        if (jQuery.isXMLDoc(a)) {
          var n = (xml = $(a)).find("STATUS").text();
          if ("SUCCESS" == n) {
            try {
              var r = $.parseJSON(xml.find("JSON").text());
            } catch (c) {
              var r = "";
            }
            if ("object" == typeof r) {
              var s = r.Vehicle;
              for (var l in s)
                s.hasOwnProperty(l) &&
                  $(e + " input[name='Vehicle." + l + "']").val(s[l]);
              $(e).submit();
            } else
              modalBasic(
                "#modal_basic",
                'JSON Data Error <i class="fa fa-exclamation"></i>',
                "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
              );
          } else
            "SUCCCESS" == n
              ? swzkgud(function () {
                  roadheroVehicleSearch(e, t);
                })
              : "NOTFOUND" == n
              ? $.ModalBasic(
                  "Vehicle Not Found.",
                  "<p>Sorry, we could not find the details for your vehicle. Please check your vehicle registration is correct.</p>"
                )
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function carMatsVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (a, i, o) {
        if (jQuery.isXMLDoc(a)) {
          var n = (xml = $(a)).find("STATUS").text();
          if ("SUCCESS" == n) {
            try {
              var r = $.parseJSON(xml.find("JSON").text());
            } catch (c) {
              var r = "";
            }
            if ("object" == typeof r) {
              var s = r.Vehicle;
              for (var l in s)
                s.hasOwnProperty(l) &&
                  $(e + " input[name='Vehicle." + l + "']").val(s[l]);
              $(e).submit();
            } else
              modalBasic(
                "#modal_basic",
                'JSON Data Error <i class="fa fa-exclamation"></i>',
                "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
              );
          } else
            "SUCCCESS" == n
              ? swzkgud(function () {
                  carMatsVehicleSearch(e, t);
                })
              : "NOTFOUND" == n
              ? $.ModalBasic(
                  "Vehicle Not Found.",
                  "<p>Sorry, we could not find the details for your vehicle. Please check your vehicle registration is correct.</p>"
                )
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addFreeWinterCheckAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/free-winter-check/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addFreeWinterCheckAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function freeWinterCheckVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addFreeWinterCheckAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("FREEWINTERCHECK", "basic", function () {
                $(".modal_vehicle-list").modal("hide"),
                  addFreeWinterCheckAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle(
                  "FREEWINTERCHECK",
                  "basic",
                  function () {
                    $(".modal_vehicle-list").modal("hide"),
                      addFreeWinterCheckAppointmentToOrder(e, a);
                  }
                )
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  freeWinterCheckVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addBrakesAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/brakes/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addBrakesAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function brakesVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addBrakesAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                $(".modal_vehicle-list").modal("hide"),
                  addBrakesAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  $(".modal_vehicle-list").modal("hide"),
                    addBrakesAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  brakesVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addExhaustsAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/exhausts/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addExhaustsAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function exhaustsVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addExhaustsAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                $(".modal_vehicle-list").modal("hide"),
                  addExhaustsAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  $(".modal_vehicle-list").modal("hide"),
                    addExhaustsAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  exhaustsVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function createNewBooking(e) {
  $.ajax({
    url: "/ajax/common/basket/remove.asp",
    success: function (a, t, i) {
      jQuery.isFunction(e) && e();
    },
    error: function (e, a, t) {
      alert(a + " - " + t);
    },
  });
}
function postcoderSelect(e) {
  "" != $(e).val()
    ? ((opt = $("#SelectAddress option:selected")),
      $("#Organisation").val($(opt).attr("data-organisation")),
      $("#Address1").val($(opt).attr("data-addrline1")),
      $("#Address2").val($(opt).attr("data-addrline2")),
      $("#Address3").val($(opt).attr("data-town")),
      $(".address-block").show())
    : ($("#Organisation").val(""),
      $("#Address1").val(""),
      $("#Address2").val(""),
      $("#Address3").val(""),
      $("#Address4").val(""),
      $(".address-block").show());
}
function postcoderLookup(e) {
  var a = e,
    t = $("#Postcode").val();
  -1 == t.indexOf(" ") &&
    ((start = t.substr(0, t.length - 3)),
    (end = t.substr(start.length, 3)),
    (t = start + " " + end)),
    $.ajax({
      url: "/ajax/common/postcoder/postcoder.asp",
      data: { Postcode: t },
      accepts: "text/json",
      dataType: "json",
      type: "POST",
      beforeSend: function (e, t) {
        $(a).find("i").attr("class", "fa fa-circle-o-notch");
      },
      success: function (e, a, t) {
        if (e.hasOwnProperty("Status")) {
          if ("found" == e.Status) {
            var i =
              '<option value="">Please select your address below</option>';
            (i +=
              '<optgroup label="Addresses for postcode ' +
              $("#Postcode").val() +
              '">'),
              $(e.Options).each(function (e, a) {
                (i += '<option value="' + a.OptionValue + '"'),
                  (i += ' data-organisation="' + a.Organisation + '"'),
                  (i += ' data-addrline1="' + a.AddrLine1 + '"'),
                  (i += ' data-addrline2="' + a.AddrLine2 + '"'),
                  (i += ' data-town="' + a.Town + '"'),
                  (i += ">" + a.OptionLabel + "</option>");
              }),
              (i += "<optgroup>"),
              (i += '<optgroup label="Manual Entry">'),
              (i +=
                '<option value="">I would like to enter my address manually</option>'),
              (i += "<optgroup>"),
              $("#SelectAddress").html(i).removeAttr("disabled");
          } else
            $("#SelectAddress")
              .html(
                '<option value="">Address Not Found - Please enter address manually.</option>'
              )
              .trigger("change"),
              $(".address-block").show();
        }
      },
      error: function (e, a, t) {
        $("#SelectAddress")
          .html(
            '<option value="">Address Not Found - Please enter address manually.</option>'
          )
          .trigger("change"),
          $(".address-block").show();
      },
      complete: function (e, t) {
        $(a).find("i").attr("class", "fa fa-search");
      },
    });
}
function regexAddOns(e) {
  $(e).is(":disabled") ||
    (null != $(e).val() &&
      ($(e).val().trim().match($(e).data("regex"))
        ? void 0 === $(e).attr("data-regex-matchvalue")
          ? $(e)
              .closest(".input-group")
              .find("i")
              .attr("class", "fa fa-check text-success")
          : $(e).val() == $("#" + $(e).attr("data-regex-matchvalue")).val()
          ? $(e)
              .closest(".input-group")
              .find("i")
              .attr("class", "fa fa-check text-success")
          : $(e)
              .closest(".input-group")
              .find("i")
              .attr("class", "fa fa-times text-danger")
        : "" == $(e).val()
        ? void 0 === $(e).attr("data-regex-group")
          ? $(e)
              .closest(".input-group")
              .find("i")
              .attr("class", "fa fa-asterisk text-info")
          : $(e)
              .closest(".input-group")
              .find("i")
              .attr("class", "fa fa-bolt text-info")
        : $(e)
            .closest(".input-group")
            .find("i")
            .attr("class", "fa fa-times text-danger")));
}
function refreshOrderDetailsAsideForExtras() {
  var e;
  (e = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/basket/refresh-order-details-aside-for-extras.asp",
      data: $("#frm").serialize(),
      type: "POST",
      success: function (a, t, i) {
        jQuery.isXMLDoc(a)
          ? "SUCCESS" == (xml = $(a)).find("STATUS").text()
            ? $(".order-details-aside").html(xml.find("BODY").text())
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              )
          : modalBasic(
              "#modal_basic",
              'Unknown Error <i class="fa fa-exclamation"></i>',
              e
            );
      },
      error: function (e, a, t) {
        modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a);
      },
    });
}
function smotVehicleSearch(e, a, t) {
  var i, o;
  (i = $(a)),
    (o = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/smot-carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, t) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(i).prop("disabled", "disabled").button("loading");
      },
      success: function (a, o, n) {
        if (jQuery.isXMLDoc(a)) {
          var r = (xml = $(a)).find("STATUS").text();
          if ("SUCCESS" == r) {
            $(e).attr("action", xml.find("BOOKINGENGINENEXTSTEP").text());
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              if (null == l.Make)
                vehicleListSelectVehicle(t, "full", function () {
                  $(e).submit();
                });
              else if (
                ("MOT" == t || "MOTANDSERVICE" == t) &&
                (0 == l.GrossWeight || l.GrossWeight >= 3e3) &&
                "LCVs (Heavy Vans 2601-3500 Kgs)" ==
                  l.VehicleCategoryDescription
              ) {
                $("body").on(
                  "click",
                  ".btn-c7-view-class-7-mot-centres",
                  function () {
                    document.location = "/mot/information/class-7";
                  }
                ),
                  $("body").on(
                    "click",
                    ".btn-c7-book-standard-mot",
                    function () {
                      $(e).submit();
                    }
                  );
                var u = {};
                (u.id = "#modal_custom-buttons"),
                  (u.title = "Does your vehicle require a Class 7 MOT?"),
                  (u.html =
                    "<p>A Class 7 MOT is required for goods vehicles between 3,000kg and 3,500kg design gross weight.</p>"),
                  (u.html +=
                    "<p>Kwik Fit offers Class 7 MOT tests at a number of Kwik Fit centres across the UK. To book, please contact your local Class 7 MOT test centre.</p>"),
                  (u.html +=
                    "<p>Please note: it is the customer's responsibility to check the MOT class of their vehicle before they book.</p>"),
                  (u.footer =
                    '<button class="btn btn-block btn-kf btn-warning btn-c7-view-class-7-mot-centres">Yes - View Class 7 MOT Centres <i class="fa fa-chevron-right" ></i></button>'),
                  (u.footer +=
                    '<button class="btn btn-block btn-kf btn-success btn-c7-book-standard-mot">No - Continue to book a standard MOT <i class="fa fa-chevron-right" ></i></button>'),
                  modalCustomButtons(u);
              } else $(e).submit();
            } else
              vehicleListSelectVehicle(t, "full", function () {
                $(e).submit();
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle(t, "full", function () {
                  $(e).submit();
                })
              : "CONCIERGE" == r
              ? $(e).attr("action", "/servicing/book/assist").submit()
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  smotVehicleSearch(e, i, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(i).prop("disabled", !1).button("reset");
      },
      error: function (e, a, t) {
        modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a),
          $(i).prop("disabled", !1).button("reset");
      },
    });
}
function tyrePressureSearch(e) {
  var a, t, i;
  (a = $(e)),
    (t = { vrn: $("#TyrePressureVRN").val() }),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: t,
      type: "POST",
      beforeSend: function (e, t) {
        $(".tyre-pressure-output").html("").hide(),
          $(a).disable().button("loading");
      },
      success: function (e, t, o) {
        if (jQuery.isXMLDoc(e)) {
          if ("SUCCESS" == (xml = $(e)).find("STATUS").text()) {
            try {
              var n = $.parseJSON(xml.find("JSON").text());
            } catch (r) {
              var n = "";
            }
            if ("object" == typeof n) {
              var c = n.Vehicle;
              0 == n.FrontTyres.length || 0 == n.RearTyres.length
                ? $(".tyre-pressure-output")
                    .html($("#TyrePressuresNotFound").html())
                    .show()
                : ((html = (html = (html = (html = (html = $(
                    "#TyrePressuresFound"
                  ).html()).replace("{VEHICLE.MAKE}", c.Make)).replace(
                    "{VEHICLE.MODEL}",
                    c.Model
                  )).replace("{VEHICLE.REGNUM}", c.RegNum)).replace(
                    "{VEHICLE.YEAR}",
                    c.Year
                  )),
                  $(".tyre-pressure-output").html(html),
                  (tyreHTML = ""),
                  (tyreTemplate = $("#TyrePressureRow").html()),
                  $(n.FrontTyres).each(function (e, a) {
                    (thisTyreSize =
                      a.Width +
                      "/" +
                      a.Ratio +
                      a.SpeedRating +
                      a.Rim.replace("R", "").replace(/\D/g, "")),
                      (thisPosition = "Front"),
                      (thisPressureBAR = Number(
                        Number((thisPressurePSI = a.PressureStandard)) /
                          14.5037738007
                      ).toFixed(1)),
                      (thisLoadIndex = a.LoadIndex),
                      "" == thisPressurePSI &&
                        ((thisPressurePSI = "Sorry, not found"),
                        (thisPressureBAR = "Sorry, not found")),
                      (tyreHTML += thisTyre =
                        (thisTyre = (thisTyre = (thisTyre = (thisTyre =
                          (thisTyre = tyreTemplate).replace(
                            "{TYRESIZE}",
                            thisTyreSize
                          )).replace("{POSITION}", thisPosition)).replace(
                          "{PRESSUREPSI}",
                          thisPressurePSI
                        )).replace("{PRESSUREBAR}", thisPressureBAR)).replace(
                          "{LOADINDEX}",
                          thisLoadIndex
                        ));
                  }),
                  $(n.RearTyres).each(function (e, a) {
                    (thisTyreSize =
                      a.Width +
                      "/" +
                      a.Ratio +
                      a.SpeedRating +
                      a.Rim.replace("R", "").replace(/\D/g, "")),
                      (thisPosition = "Rear"),
                      (thisPressureBAR = Number(
                        Number((thisPressurePSI = a.PressureStandard)) /
                          14.5037738007
                      ).toFixed(2)),
                      (thisLoadIndex = a.LoadIndex),
                      "" == thisPressurePSI &&
                        ((thisPressurePSI = "Sorry, not found"),
                        (thisPressureBAR = "Sorry, not found")),
                      (tyreHTML += thisTyre =
                        (thisTyre = (thisTyre = (thisTyre = (thisTyre =
                          (thisTyre = tyreTemplate).replace(
                            "{TYRESIZE}",
                            thisTyreSize
                          )).replace("{POSITION}", thisPosition)).replace(
                          "{PRESSUREPSI}",
                          thisPressurePSI
                        )).replace("{PRESSUREBAR}", thisPressureBAR)).replace(
                          "{LOADINDEX}",
                          thisLoadIndex
                        ));
                  }),
                  $(".tyre-pressure-output tbody").html(tyreHTML),
                  $(".tyre-pressure-output").show());
            } else
              modalBasic(
                "#modal_basic",
                'Vehicle Not Found <i class="fa fa-exclamation"></i>',
                "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
              );
          } else
            "SUCCCESS" == xml.find("STATUS").text() &&
              swzkgud(function () {
                tyrePressureSearch(a);
              });
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $(a).disable().button("reset");
      },
      error: function (e, t, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', t),
          $(a).enable().button("reset");
      },
    });
}
function motDueDateSearch(e, a) {
  var a, t, i;
  (a = $(a)),
    (t = { vrn: $("#VRN").val() }),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: t,
      type: "POST",
      beforeSend: function (e, t) {
        $(a).disable().button("loading");
      },
      success: function (t, o, n) {
        if (jQuery.isXMLDoc(t)) {
          if ("SUCCESS" == (xml = $(t)).find("STATUS").text()) {
            try {
              var r = $.parseJSON(xml.find("JSON").text());
            } catch (c) {
              var r = "";
            }
            if ("object" == typeof r) {
              var s = r.Vehicle;
              for (var l in s)
                s.hasOwnProperty(l) &&
                  $(e + " input[name='Vehicle." + l + "']").val(s[l]);
              $("#frmMOTDueDateCheck").submit();
            } else
              modalBasic(
                "#modal_basic",
                'Vehicle Not Found <i class="fa fa-exclamation"></i>',
                "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
              );
          } else
            "SUCCCESS" == xml.find("STATUS").text()
              ? swzkgud(function () {
                  motDueDateSearch(e, a);
                })
              : modalBasic(
                  "#modal_basic",
                  'Vehicle Not Found <i class="fa fa-exclamation"></i>',
                  "<p>Sorry, your vehicle could not be found.</p>"
                );
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        logMotDueDateSearch(), $(a).disable().button("reset");
      },
      error: function (e, t, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', t),
          $(a).enable().button("reset");
      },
    });
}
function logMotDueDateSearch() {
  var e, a;
  (e = $(e)),
    (a = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/mot-due-date-checker/log.asp",
      data: $("#frmMOTDueDateCheck").serialize(),
      type: "POST",
      beforeSend: function (e, a) {},
      success: function (e, a, t) {},
      error: function (e, a, t) {},
    });
}
function tyresSetTyreSizeSelectFromDTS(e, a, t, i, o) {
  var n =
    null == $(e + " input[name='dts']").val()
      ? ""
      : $(e + " input[name='dts']").val();
  if (!0 == /[1-3][0-9]{2}\/[2-9][0-9][HMNPQRSTVWYZ][1-2][0-9]/i.test(n)) {
    var r = n.substr(0, 3),
      c = n.substr(4, 2),
      s = n.substr(7, 2),
      l = n.substr(6, 1);
    $.ajax({
      url: "/ajax/engine-starter/tyresize-from-dts.asp",
      type: "POST",
      data: { sec: r, asp: c, rim: s, spd: l },
      success: function (e) {
        jQuery.isXMLDoc(e) &&
          ((xml = $(e)),
          $(o).html(xml.find("SPD").text()).removeAttr("disabled"),
          $(o).val(l),
          $(i).html(xml.find("RIM").text()).removeAttr("disabled"),
          $(i).val(s),
          $(t).html(xml.find("ASP").text()).removeAttr("disabled"),
          $(t).val(c),
          $(a).html(xml.find("SEC").text()).removeAttr("disabled"),
          $(a).val(r));
      },
    });
  }
}
function tyresUpdateForm(e) {}
function tyresVehicleSearch(e, a) {
  $(a).button("loading");
  var t,
    i = $(e + " input[name='vrn']").val();
  "" == i && (i = $("#TyresVrn").val()),
    $(e + " input[name='Postcode']").val() &&
      (t = $(e + " input[name='Postcode']").val()),
    $.ModalTyreSizeOptions({
      vrn: i,
      postcode: t,
      token: $("#RecaptchaToken").val(),
      FleetProceed: $("#FleetProceed").val(),
      btn: $(this),
      onShown: function () {
        $(a).button("reset"), $('[data-toggle="tooltip"]').tooltip();
      },
      onHidden: function () {
        !0 == $(this).hasClass("g-recaptcha") && grecaptcha.reset();
      },
    });
}
function tyresSelectTyreSizeSelectConfirm(e, a) {
  (dts = $(a + " input[name='dts']").val()),
    (tsf = $(a + " input[name='tsf']").val()),
    (tsr = $(a + " input[name='tsr']").val()),
    "" == tsf && "" == tsr
      ? $(e + " .alert-select-tyre-size-confirm").show()
      : ("" != tsr
          ? ((dts = tsr), $(a + " input[name='dts']").val(tsr))
          : ((dts = tsf), $(a + " input[name='dts']").val(tsf)),
        (sec = dts.substr(0, 3)),
        (asp = dts.substr(4, 2)),
        (spd = dts.substr(6, 1)),
        (rim = dts.substr(7, 2)),
        $(a + " input[name='sec']").val(sec),
        $(a + " input[name='asp']").val(asp),
        $(a + " input[name='spd']").val(spd),
        $(a + " input[name='rim']").val(rim),
        (svc = $(a + " input[name='svc']").val()),
        tyresSetTyreSearchFormActionAndSearch(a, svc, dts));
}
function tyresSetTyreSearchFormActionAndSearch(e, a, t) {
  var i = t.substr(0, 3),
    o = t.substr(4, 2),
    n = t.substr(6, 1),
    r = t.substr(7, 2);
  (url =
    "*" == n
      ? a + "/" + i + "/" + o + "/" + r
      : a + "/" + i + "/" + o + "/" + r + "/" + n),
    $(e).attr("action", url).submit();
}
function tyresTyreSizeSearchUpdate(e, a, t, i, o, n) {
  tyresUpdateForm(e);
  var r,
    c = $(a).attr("rel"),
    s = null == t.val() ? "" : t.val(),
    l = null == i.val() ? "" : i.val(),
    d = null == o.val() ? "" : o.val(),
    u = null == n.val() ? "" : n.val(),
    f = "",
    m = !1;
  "" == s
    ? ((r = {}),
      $(i).attr("disabled", "disabled").html(""),
      $(o).attr("disabled", "disabled").html(""),
      $(n).attr("disabled", "disabled").html(""),
      (f = t))
    : "" == l || "sec" == c
    ? ((r = { sec: s }),
      $(i).attr("disabled", "disabled").html(""),
      $(o).attr("disabled", "disabled").html(""),
      $(n).attr("disabled", "disabled").html(""),
      (f = i))
    : "" == d || "asp" == c
    ? ((r = { sec: s, asp: l }),
      $(o).attr("disabled", "disabled").html(""),
      $(n).attr("disabled", "disabled").html(""),
      (f = o))
    : "" == u || "rim" == c
    ? ((r = { sec: s, asp: l, rim: d }),
      $(n).attr("disabled", "disabled").html(""),
      (f = n))
    : ((f = "TYRESIZESELECTED"),
      (r = { sec: s, asp: l, rim: d, spd: u }),
      (m = !0)),
    $(e + " input[name='sec']").val(r.sec),
    $(e + " input[name='asp']").val(r.asp),
    $(e + " input[name='rim']").val(r.rim),
    $(e + " input[name='spd']").val(r.spd),
    "object" == typeof f
      ? $.ajax({
          url: "/ajax/engine-starter/tyresize-search.asp",
          type: "POST",
          data: r,
          success: function (e) {
            $(f).html(e).removeAttr("disabled").focus();
          },
        })
      : "TYRESIZESELECTED" == f &&
        "btn" == c &&
        ((dts = r.sec + "/" + r.asp + r.spd + r.rim),
        $(e + " input[name='dts']").val(dts),
        $(e + " input[name='tsf']").val(dts),
        $(e + " input[name='tsr']").val(dts),
        (svc = $(e + " input[name='svc']").val()),
        $(a).button("loading"),
        tyresSetTyreSearchFormActionAndSearch(e, svc, dts));
}
function modalSelectTyreSize(e, a, t, i) {
  var o = function (e) {
      return (
        e.Width +
        "/" +
        e.Ratio +
        e.SpeedRating +
        e.Rim.replace("R", "").replace(/\D/g, "")
      );
    },
    n = !0;
  $(a).each(function (e, i) {
    if ((thisTSF = o(a[e])) != (thisTSR = o(t[e]))) return (n = !1), !1;
  }),
    !0 == n
      ? ($(e + " .tyre-size-options_single").show(),
        $(e + " .tyre-size-options_multiple").hide(),
        (tyreOptions = ""),
        $(a).each(function (t, i) {
          tyreOptions += thisOption = (thisOption = (thisOption = (thisOption =
            (thisOption = $(
              e + " .tyre-size-radio-option_template"
            ).html()).replace("{FRONTORREAR}", "dts")).replace(
            "{VALUE}",
            o(a[t])
          )).replace("{LABEL}", o(a[t]) + " (front and rear)")).replace(
            "{REL}",
            "dts"
          );
        }),
        $(e).find(".tyre-size-option_dts").html(tyreOptions),
        1 == a.length &&
          ($(e).find("[name='tyre-size-radio_dts']").prop("checked", !0),
          (dts = o(a[0])),
          $("input[name='tsr']").val(dts),
          $("input[name='tsf']").val(dts),
          $("input[name='dts']").val(dts)))
      : ($(e + " .tyre-size-options_single").hide(),
        $(e + " .tyre-size-options_multiple").show(),
        (tyreOptions = ""),
        $(a).each(function (t, i) {
          tyreOptions += thisOption = (thisOption = (thisOption = (thisOption =
            (thisOption = $(
              e + " .tyre-size-radio-option_template"
            ).html()).replace("{FRONTORREAR}", "front")).replace(
            "{VALUE}",
            o(a[t])
          )).replace("{LABEL}", o(a[t]))).replace("{REL}", "tsf");
        }),
        $(e).find(".tyre-size-options_front").html(tyreOptions),
        1 == a.length &&
          ($(e).find("[name='tyre-size-radio_front']").prop("checked", !0),
          $("input[name='tsf']").val(o(a[0]))),
        (tyreOptions = ""),
        $(a).each(function (a, i) {
          tyreOptions += thisOption = (thisOption = (thisOption = (thisOption =
            (thisOption = $(
              e + " .tyre-size-radio-option_template"
            ).html()).replace("{FRONTORREAR}", "rear")).replace(
            "{VALUE}",
            o(t[a])
          )).replace("{LABEL}", o(t[a]))).replace("{REL}", "tsr");
        }),
        $(e).find(".tyre-size-options_rear").html(tyreOptions),
        1 == a.length &&
          ($(e).find("[name='tyre-size-radio_rear']").prop("checked", !0),
          $("input[name='tsr']").val(o(t[0])))),
    $("body").on(
      "change",
      ".tyre-size-radio-option input[type='radio']",
      function () {
        $(e).find(".alert-select-tyre-size-confirm").hide(),
          "dts" == (rel = $(this).attr("rel"))
            ? ($("input[name='tsf']").val($(this).val()),
              $("input[name='tsr']").val($(this).val()),
              $("input[name='dts']").val($(this).val()))
            : "tsr" == rel
            ? ($("input[name='tsr']").val($(this).val()),
              $("input[name='dts']").val($(this).val()))
            : ($("input[name='tsf']").val($(this).val()),
              $("input[name='dts']").val($(this).val()));
      }
    );
  var r = $(".tyre-size-options-instructions_template").html();
  (r = r.replace("{VEHICLE}", i.Year + " " + i.Make + " " + i.Model)),
    $(".tyre-size-options-instructions").html(r),
    $(e).modal();
}
function vehicleListSelectVehicle(e, a, t) {
  $.ModalVehicleList({
    onSelect: function (e) {
      vehicleListToVehicle(e), jQuery.isFunction(t) && t();
    },
  });
}
function vehicleListToVehicle(e) {
  $("input[name='Vehicle.BodyStyle']").val(""),
    $("input[name='Vehicle.Colour']").val(""),
    $("input[name='Vehicle.Engine']").val(e.engine.capacity),
    $("input[name='Vehicle.ForwardGears']").val(""),
    $("input[name='Vehicle.FuelType']").val(e.engine.fuel),
    $("input[name='Vehicle.Make']").val(e.make),
    $("input[name='Vehicle.Model']").val(e.model),
    $("input[name='Vehicle.RegNum']").val(e.vrn),
    $("input[name='Vehicle.Transmission']").val(""),
    $("input[name='Vehicle.VIN']").val(""),
    $("input[name='Vehicle.Year']").val(e.year),
    $("input[name='Vehicle.VehicleCategoryDescription']").val(
      e.vehicleCategory
    );
}
function swzkgud(e) {
  $.ajax({
    url: "/ajax/common/vehicle/swzkgud.asp",
    success: function (a, t, i) {
      jQuery.isXMLDoc(a) &&
        ("SUCCESS" == (xml = $(a)).find("STATUS").text()
          ? e()
          : modalBasic(
              "#modal_basic",
              xml.find("TITLE").text(),
              xml.find("BODY").text()
            ));
    },
    error: function (e, a, t) {
      modalBasic("#modal_basic", t + ' <i class="fa fa-exclamation"></i>', a),
        $(btn).enable().button("reset");
    },
  });
}
function addBatteryHealthCheckAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/battery-health-check/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addBatteryHealthCheckAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function batteryHealthCheckVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addBatteryHealthCheckAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                addBatteryHealthCheckAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  addBatteryHealthCheckAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  batteryHealthCheckVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addDiagnosticsCheckAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/diagnostics/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addDiagnosticsCheckAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addBrakeFluidChangeAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/brake-fluid-change/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addBrakeFluidChangeAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function diagnosticsCheckVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addDiagnosticsCheckAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                addDiagnosticsCheckAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  addDiagnosticsCheckAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  diagnosticsCheckVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function brakeFluidChangeVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addBrakeFluidChangeAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("BRAKES", "basic", function () {
                addBrakeFluidChangeAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("BRAKES", "basic", function () {
                  addBrakeFluidChangeAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  brakeFluidChangeVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function vehicleSafetyCheckVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addVehicleSafetyCheckAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("FREEWINTERCHECK", "basic", function () {
                addVehicleSafetyCheckAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle(
                  "FREEWINTERCHECK",
                  "basic",
                  function () {
                    addVehicleSafetyCheckAppointmentToOrder(e, a);
                  }
                )
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  vehicleSafetyCheckVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addVehicleSafetyCheckAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/vehicle-safety-check/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(t).prop("disabled", "disabled").button("loading"), $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addVehicleSafetyCheckAppointmentToOrder(e, a);
                    }, 500);
                  });
              }),
              $(t).prop("disabled", !1).button("reset"))
            : (modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
              $(t).prop("disabled", !1).button("reset"));
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          ),
            $(t).prop("disabled", !1).button("reset");
        $("#modal_basic-ajax-call").modal();
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function addHiyacarAppointmentToOrder(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an error occurred.</p>"),
    $.ajax({
      url: "/ajax/hiyacar/add-to-order.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (e, a) {
        $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (o, n, r) {
        if (jQuery.isXMLDoc(o)) {
          if ("SUCCESS" == (xml = $(o)).find("STATUS").text()) {
            $(e).submit();
            return;
          }
          "BOOKINGEXISTS" == xml.find("STATUS").text()
            ? (modalCustomButtons({
                id: "#modal_custom-buttons",
                title: xml.find("TITLE").text(),
                html: xml.find("BODY").text(),
                footer: xml.find("BUTTONS").text(),
              }),
              $("body").on("click", ".btn-create-new-booking", function () {
                $("#modal_custom-buttons").modal("hide"),
                  createNewBooking(function () {
                    setTimeout(function () {
                      addHiyacarAppointmentToOrder(e, a);
                    }, 500);
                  });
              }))
            : modalBasic(
                "#modal_basic",
                xml.find("TITLE").text(),
                xml.find("BODY").text()
              ),
            $(t).prop("disabled", !1).button("reset");
        } else
          modalBasic(
            "#modal_basic",
            'Unknown Error <i class="fa fa-exclamation"></i>',
            i
          );
        $("#modal_basic-ajax-call").modal(),
          $(t).prop("disabled", "disabled").button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function hiyacarVehicleSearch(e, a) {
  var t, i;
  (t = $(a)),
    (i = "<p>Sorry, an unknown error has occurred.</p>"),
    $.ajax({
      url: "/ajax/common/vehicle/carweb-vehicle-multi-tyre.asp",
      data: $(e).serialize(),
      type: "POST",
      beforeSend: function (a, i) {
        $(e + " input[name^='Vehicle.']").val(""),
          $(t).prop("disabled", "disabled").button("loading");
      },
      success: function (i, o, n) {
        if (jQuery.isXMLDoc(i)) {
          var r = (xml = $(i)).find("STATUS").text();
          if ("SUCCESS" == r) {
            try {
              var c = $.parseJSON(xml.find("JSON").text());
            } catch (s) {
              var c = "";
            }
            if ("object" == typeof c) {
              var l = c.Vehicle;
              for (var d in l)
                l.hasOwnProperty(d) &&
                  $(e + " input[name='Vehicle." + d + "']").val(l[d]);
              addHiyacarAppointmentToOrder(e, a);
            } else
              vehicleListSelectVehicle("HIYACAR", "basic", function () {
                addHiyacarAppointmentToOrder(e, a);
              });
          } else
            "NOTFOUND" == r
              ? vehicleListSelectVehicle("HIYACAR", "basic", function () {
                  addHiyacarAppointmentToOrder(e, a);
                })
              : "SUCCCESS" == r
              ? swzkgud(function () {
                  hiyacarVehicleSearch(e, t);
                })
              : modalBasic(
                  "#modal_basic",
                  xml.find("TITLE").text(),
                  xml.find("BODY").text()
                );
        } else
          modalBasic(
            "#modal_basic",
            'XML Data Error <i class="fa fa-exclamation"></i>',
            "<p>Sorry, the data for your vehicle has come back incorrectly formatted.</p>"
          );
        $(t).prop("disabled", !1).button("reset");
      },
      error: function (e, a, i) {
        modalBasic("#modal_basic", i + ' <i class="fa fa-exclamation"></i>', a),
          $(t).prop("disabled", !1).button("reset");
      },
    });
}
function createLog(e, a, t) {
  $.ajax({
    url: "/ajax/common/log.asp",
    data: { BookingEngine: e, BookingEngineStep: a, Stage: t },
    type: "POST",
    beforeSend: function (e, a) {},
    success: function (e, a, t) {},
    error: function (e, a, t) {},
  });
}
$(document).ready(function () {
  if (
    ($(".kf-sub-menu-list .active").parents("ul").show(),
    $(".kf-sub-menu-list .active").children("ul").show(),
    $(".paypal-modal").on("click", function () {
      paypalModal();
    }),
    $(".bumper-modal").on("click", function () {
      bumperModal();
    }),
    $(".other-pages-engine-starter").height())
  )
    var e = $(".other-pages-engine-starter").height();
  else var e = 0;
  if ($(".cookie-settings-message").height())
    var a = $(".cookie-settings-message").height();
  else var a = 0;
  if ($("#wp-submenu").height() < $(".kf-main-content").height()) {
    if ($(".kf-jumbotron").length > 0) {
      if (
        $("#wp-submenu").length > 0 &&
        $(".other-pages-engine-starter").length > 0
      ) {
        var t = $("#wp-submenu")[0].compareDocumentPosition(
          $(".other-pages-engine-starter")[0]
        );
        if (t & Node.DOCUMENT_POSITION_FOLLOWING)
          var i =
            $(".kf-main-header").height() +
            $(".kf-main-menu").height() +
            $(".kf-jumbotron").height() +
            $(".kf-breadcrumbs").height() +
            a -
            107;
        else if (t & Node.DOCUMENT_POSITION_PRECEDING)
          var i =
            $(".kf-main-header").height() +
            $(".kf-main-menu").height() +
            $(".kf-jumbotron").height() +
            $(".kf-breadcrumbs").height() +
            a +
            e -
            107;
      } else
        var i =
          $(".kf-main-header").height() +
          $(".kf-main-menu").height() +
          $(".kf-jumbotron").height() +
          $(".kf-breadcrumbs").height() +
          a -
          107;
    } else
      var i =
        $(".kf-main-header").height() +
        $(".kf-main-menu").height() +
        $(".kf-breadcrumbs").height() +
        a -
        60;
    $("#wp-submenu").affix({
      offset: {
        top: i,
        bottom:
          e +
          $(".kf-promo-banner").height() +
          $(".kf-main-footer").height() +
          190,
      },
    });
  } else $("#wp-submenu").attr("data-spy", ""), $("#wp-submenu").removeClass("affix"), $("#wp-submenu").removeClass("affix-top");
  $(function () {
    $(".btn-clear-vrm").tooltip();
  }),
    $("body").on("click", ".copy-text", function () {
      $(this).attr("data-toggle", "tooltip"),
        $(this).attr("title", "Copied to clipboard!"),
        $(this).tooltip("enable"),
        $(this).tooltip("show"),
        setTimeout(function () {
          $(".copy-text").tooltip("hide"), $(".copy-text").tooltip("disable");
        }, 1500),
        navigator.clipboard.writeText($(this).html());
    }),
    $(".expanding-section .panel-collapse").on("show.bs.collapse", function () {
      $(this).siblings(".expanding-section .panel-heading").addClass("active");
    }),
    $(".expanding-section .panel-collapse").on("hide.bs.collapse", function () {
      $(this)
        .siblings(".expanding-section .panel-heading")
        .removeClass("active");
    });
}),
  (jQuery.fn.disable = function () {
    var e = $(this[0]);
    return e.prop("disabled", !0), e.attr("disabled", "disabled"), e;
  }),
  (jQuery.fn.enable = function () {
    var e = $(this[0]);
    return e.prop("disabled", !1), e.removeAttr("disabled"), e;
  }),
  (jQuery.fn.mqDetector = function () {
    return $("#mq-detector span:visible").data("breakpoint");
  }),
  $.ajaxSetup({ cache: !1 }),
  $("a[href^='tel:']").on("click", function (e) {
    "xs" != $(window).mqDetector() && e.preventDefault();
  });
