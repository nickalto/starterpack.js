class @PostHelper
  constructor: ->
    this.init()

  init: =>
    $('.login-container').on('click', '.create-user .update-user', this.onUserCreatePost)

  onUserCreatePost: (e) =>
    target = $(e.currentTarget)
    form = $(target.closest('form'))
    e.preventDefault()
    console.log('fkjda;fnkdla; ' + form.attr('action') + ' ' + form.attr('method') + ' ' + form.serialize())
    $('.error').remove()

    $.ajax form.attr('action'),
        type: form.attr('method')
        data: form.serialize()
        error: (data, status, headers, error) -> 
        	console.log('create user failure')
        success: (data, status, headers, config) -> 
        	if data.error 
        		for key, value of data.error
        			$('body').append('<p class="error">' + value + '</p>')
        	else 
        		window.location = data.redirect

$ -> 
	ph = new PostHelper()





