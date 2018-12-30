$(document).ready(function() {
    console.log('ready')
    
    $('.fa-heart').on('click', function(e) {
      console.log("trying to favorite now")
      e.preventDefault()
      $.get($(this).attr('href')).done(function(result) {
        console.log(result)
        location.reload();
      })
  })
  })
