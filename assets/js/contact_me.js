---
---
$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
      var name = $("input#name").val();
      var email = $("input#email").val();
      var phone = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      $this = $("#sendMessageButton");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
      
      // Format WhatsApp message
      var whatsappMessage = "🔔 New Contact Form Submission 🔔\n\n" +
        "👤 Name: " + name + "\n" +
        "📧 Email: " + email + "\n" +
        "📱 Phone: " + phone + "\n" +
        "💬 Message: " + message + "\n\n" +
        "⏰ Time: " + new Date().toLocaleString();
      
      var whatsappUrl = "https://wa.me/{{ site.data.sitetext[site.locale].contact_phone | default: site.data.sitetext.contact_phone }}?text=" + encodeURIComponent(whatsappMessage);
      
      // Send email using a simple mailto approach as fallback
      var emailSubject = "New Contact Form Submission from " + name;
      var emailBody = "Name: " + name + "\n" +
                     "Email: " + email + "\n" +
                     "Phone: " + phone + "\n" +
                     "Message: " + message + "\n\n" +
                     "Submitted at: " + new Date().toLocaleString();
      
      var mailtoUrl = "mailto:{{ site.data.sitetext[site.locale].contact_email | default: site.data.sitetext.contact_email }}?subject=" + encodeURIComponent(emailSubject) + 
                     "&body=" + encodeURIComponent(emailBody);
      
      // Try to send via formspree first
      var formspreeUrl = "https://formspree.io/f/xdkojpkw"; // You'll need to create this endpoint
      
      $.ajax({
        url: formspreeUrl,
        type: "POST",
        dataType: "json",
        data: {
          name: name,
          phone: phone,
          email: email,
          message: message,
          _subject: emailSubject
        },
        cache: false,

        success: function() {
          // Success message - both email and WhatsApp
          $('#success').html("<div class='alert alert-success'>");
          $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-success')
            .append("<strong>Thank you " + firstName + "! </strong>");
          $('#success > .alert-success')
            .append("Your message has been sent via email successfully! WhatsApp will also open for instant contact.");
          $('#success > .alert-success').append('</div>');
          
          // Clear form
          $('#contactForm').trigger("reset");
          
          // Open WhatsApp after delay
          setTimeout(function() {
            window.open(whatsappUrl, '_blank');
          }, 2000);
        },

        error: function() {
          // If Formspree fails, try mailto
          $('#success').html("<div class='alert alert-warning'>");
          $('#success > .alert-warning').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-warning')
            .append("<strong>Thank you " + firstName + "! </strong>");
          $('#success > .alert-warning')
            .append("Your message will be sent via your email client and WhatsApp. Please complete both sending processes.");
          $('#success > .alert-warning').append('</div>');
          
          // Clear form
          $('#contactForm').trigger("reset");
          
          // Open both email client and WhatsApp
          setTimeout(function() {
            window.location.href = mailtoUrl;
            setTimeout(function() {
              window.open(whatsappUrl, '_blank');
            }, 1000);
          }, 1500);
        },

        complete: function() {
          setTimeout(function() {
            $this.prop("disabled", false);
          }, 2000);
        }
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});
