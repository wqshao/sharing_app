$(document).ready(function() {
    console.log('ready')
    
    $('.fa-trash').on('click', function(e) {
      console.log("trying to delete now")
      e.preventDefault()
      $.get($(this).attr('href')).done(function(result) {
        console.log(result)
        location.reload();
      })
  })
  })
