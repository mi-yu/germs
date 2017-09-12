var express = require('express')
var app = express()
app.set('port', (process.env.PORT || 3000))

app.set('views', 'views')
app.set('view engine', 'pug')

app.use('/static', express.static(__dirname + '/public'))

require('./routes/routes')(app)

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'))
})