// ALONSO JR. 
// https://github.com/alonsojr1980

// MONGODB SCHEMA FOR EASY SEQUENCIAL ID GENERATION

// USAGE EXAMPLE:

/*
var Generator = require('../models/generator.js');

Generator.gen_id("quotation_" + quotation.sp_id, 1, function (err, seq) {
    if (!err) {
        quote.sp_sequence = seq;                  
        quote.save(function(error){
            if (!error) {
                callback(null, quote);
            } else {
                callback(error, null);
            }
        });
    } else {
        callback(err, null);
    }
});

*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeneratorSchema = new Schema({
    name: String,
    sequence: Number
}, { collection: 'generators' });

GeneratorSchema.methods = {
    incrementAndSave: function (increment, callback) {
        var that = this;
        that.sequence += increment;
        that.save(function(err) {
            if (!err) {
                callback(null, that.sequence);
            } else {
                callback(err, null);
            }
        });
    }
};

GeneratorSchema.statics = {
    //sequence name, quantity to increment, callback function
    gen_id: function (name, increment, callback) {
        var gen = this.findOne({name: name}, function(err, generator){
            if (!err) {
                if (!generator) {
                    var model = mongoose.model('Generator', GeneratorSchema);
                    generator = model({name: name, sequence: 0});
                }

                generator.incrementAndSave(increment, callback);
            }
        });
    }

}

module.exports = mongoose.model('Generator', GeneratorSchema);;
