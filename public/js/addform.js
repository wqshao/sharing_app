  $(document).ready(function() {
    console.log('ready')
    
    $("#add_form").submit(function(e) {
      console.log("form submitted")
      e.preventDefault()
      var user_name = "<%= user_name %>"
      $.post('/add/', {user: user_name , newlink: $("#newlink").val()}).done(function(result) { // 5 seconds
        console.log(result)
        location.reload();
      })
    })

  })
