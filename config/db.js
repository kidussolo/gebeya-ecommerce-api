const mongoose = require('mongoose');

module.exports = connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB Connected Successfully.')
    } catch(e) {
        console.log('Can Not Connect to DB!');
        console.log(e.message);
        process.exit(1);
    }
}
