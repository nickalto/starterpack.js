class @PostHelper
  constructor: ->
    this.init()

  init: =>
    # for any other forms that need validation add them here
    $('.login-container').on('click', '.create-user, .update-user', this.onUserCreatePost)

  onUserCreatePost: (e) =>
    target = $(e.currentTarget)
    form = $(target.closest('form'))
    e.preventDefault()

    # remove errors from page
    $('.error').remove()
    $('.label-error').removeClass('label-error')
    form.find('form-group').removeClass('has-error')

    # validate form
    for input in form.find('input')
        if( input.required && (input.value.length == 0 || input.value == '' ))
            return $(input).parent().parent().addClass('has-error')
        

    # post form and parse out errors if necessary
    $.ajax form.attr('action'),
        type: form.attr('method')
        data: form.serialize()
        error: (data, status, headers, error) -> 
        	console.log('create user failure')
        success: (data, status, headers, config) -> 
        	if data.error 
                # if error - surface to body or to specific input depending on error type
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





