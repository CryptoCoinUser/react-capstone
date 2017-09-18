let DATABASE_URL

if(process.env.DBURL) {
	DATABASE_URL = process.env.DBURL
}

else if(process.env.NODE_ENV == 'test') {
	DATABASE_URL ='mongodb://localhost/reactCapstoneTest'
}
else {
	DATABASE_URL ='mongodb://localhost/reactCapstone'
}


module.exports = {DATABASE_URL}
