var mongoose=require('mongoose');

var Schema = mongoose.Schema;

var shortcodesSchema = new Schema({code:{type: String, default: null},vendorId:{type: String, default: null}});
var Shortcodes = mongoose.model('Shortcodes', shortcodesSchema);

var vendorsSchema = new Schema({name:{type: String, default: null},email:{type: String, default: null},greeting:{type: String, default: null}});
var Vendors = mongoose.model('Vendors', vendorsSchema);

var visitorsSchema = new Schema({name:{type: String, default: null},vendorId:{type: String, default: null},time:{in:{type: Date, default: null},out:{type: Date, default: null},position:{type: Number, default: null}}});
var Visitors = mongoose.model('Visitors', visitorsSchema);


function Models() {
        var self = this;
        this.Shortcodes = Shortcodes;
        this.Vendors = Vendors;
        this.Visitors = Visitors;
        var connection = mongoose.connect('mongodb://localhost/SaveMySpot');

        mongoose.connection.once('open', function () {
                console.log("Mongodb Database Connection Established");
                // all set!
        })
        this.connection = connection;
};


module.exports = new Models();
