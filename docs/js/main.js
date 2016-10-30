
var devices = [
  {
    name : "a",
    particleDeviceId : "37003e001551353531343431",
    greetingName : "sweetheart"
  },
  {
    name : "b",
    particleDeviceId : "37003e001551353531343431",
    greetingName : "Snugs"
  }
]

var particleDeviceId;
var accessKey;
var greetingName;

$( document ).ready(function() {
  // Bind to UI
  $('#new-message').on("input", updateValidationForNote);
  $('#check-view-status').click(checkViewStatus);
  $( "#save-note" ).click(saveNote);
  $( "#change-note" ).click(function() {
    $("#display-note").fadeOut(function() {
      $("#change-note-section").fadeIn();
    });
  });
  $("#cancel-change").click(function() {
    $("#change-note-section").fadeOut(function() {
      $("#display-note").fadeIn();
    });
  });

  // Setup values
  var deviceName = getUrlParameter("name");
  var device = $.grep(devices, function(d) { return d.name == deviceName; })[0];
  particleDeviceId = device.particleDeviceId;
  accessKey = getUrlParameter("key");
  greetingName = device.greetingName;

  if (particleDeviceId === undefined || accessKey === undefined) {
    alert("Looks like the web address needs some more things in it.");
    return;
  }

  $("#greeting-name").html(greetingName);

  // Animate in the loading UI
  $("#greeting").delay(1000).fadeIn("slow");
  $("#progress-note").delay(2000).fadeIn("slow");
  $("#progress").delay(3000).fadeIn(function() {
    updateCurrentNote();
    updateViewStatus("");
  });
});

function saveNote() {
  $.ajax({
    url: "https://api.particle.io/v1/devices/" + particleDeviceId + "/message",
    method: "POST",
    data: {
      "access_token" : accessKey,
      "args" : $("#new-message").val()
    }
  }).done(function(result) {
    if(result.return_value == "1") {
      $("#change-note-section").fadeOut(function() {
        $("#progress").fadeIn(function() {
          updateCurrentNote();
        });
      });
    } else {
      alert( "Damn, there was a problem, couldn't save." );
      console.log("Unexpected return value");
    }
  }).fail(function( jqXHR, textStatus ) {
    alert( "Damn, there was a problem, couldn't save." );
  });
}

function updateCurrentNote() {
  $.ajax({
    url: "https://api.particle.io/v1/devices/" + particleDeviceId + "/message?access_token=" + accessKey,
    method: "GET"
  }).done(function(result) {
    $("#progress-note").fadeOut();
    $("#progress").fadeOut(function() {
      $("#current-message").html(result.result);

      $("#display-note").fadeIn();
    });

    console.log(result);
  }).fail(function( jqXHR, textStatus ) {
    alert( "Damn, there was a problem, couldn't get current note." );
  });
}

var currentStatusModifierIndex = 0;
var statusModifiers = [ "still", "really", "most likely" ] ;

function checkViewStatus() {

}

function updateViewStatus(modifierWord) {

}

function updateValidationForNote() {
  if ($('#new-message').val().length > 255) {
    $('#length-error').fadeIn();
  } else {
    $('#length-error').fadeOut();
  }
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
