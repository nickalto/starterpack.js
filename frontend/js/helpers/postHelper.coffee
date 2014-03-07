class @PostHelper
  constructor: ->
    this.init()

  init: =>
    $('.login-container').on('click', '.create-user, .update-user', this.onUserCreatePost)

  onUserCreatePost: (e) =>
    target = $(e.currentTarget)
    form = $(target.closest('form'))
    e.preventDefault()
    $('.error').remove()
    $('.label-error').removeClass('label_error')

    $.ajax form.attr('action'),
        type: form.attr('method')
        data: form.serialize()
        error: (data, status, headers, error) -> 
        	console.log('create user failure')
        success: (data, status, headers, config) -> 
        	if data.error 
        		for key, value of data.error
                    console.log('error key = ' + key + ' value = ' + value)
                    if (key == 'body')
                        $('.navbar').after('<p class="error_message">' + value + '</p>')
                    else 
                        element = "input[name='" + key + "']"
                        $("label[for='" + key + "']").addClass('label-error')
                        $(element).before('<p class="error label-error">' + value + '</p>')
        	else 
        		window.location = data.redirect

$ -> 
	ph = new PostHelper()





