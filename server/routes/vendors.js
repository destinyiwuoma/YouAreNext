'use strict';


var db = require('../database.js'); 
var mongoose = require('mongoose');

exports.createVendor = function (req, res) {
	var shortcodeId = req.body.shortcodeId;
	db.Vendors.create({shortcodeId:shortcodeId}, function (err, vendor) {
		if (err){
			res.send(err,500); 
		}else{
			res.send({message:'Vendor Created',vendorId:vendor._id},201);  
		}	
		// saved!
	});
};

exports.getVendorInfo = function(req,res){
	var vendorId=req.params.vendorId;
	
	db.Vendors.findOne({_id:vendorId},function(err,vendor){
		if(err){
			res.send(err,500);
		}else{
			db.Visitors.find({vendorId:vendorId}, function(err, visitors) {

				var lastPosition = visitors.length == 0 ? 1 : visitors.length;
				var currentlySeen = visitors.filter(function(visitor){
					if(visitor.finished){
						return visitor;
					}
				}).length;
				var shortcodeId = vendor.shortcodeId; 
				db.Shortcodes.findOne({_id:shortcodeId},function(err,shortcode){
					if(err){
						res.send(err,500);
					}else{
						shortcode.vendorId = vendorId; 
						shortcode.save();
						res.send({vendor:vendor,lastPosition:lastPosition,currentlySeen:currentlySeen,shortcode:shortcode.code},200);
					}
				})
				
				
			});
			
		}
	});
};

exports.addVisitor = function(req,res){
	var shortcode = req.body.shortcode;
	
	db.Shortcodes.findOne({code:shortcode},function(err,s){
		
		var obj = {	vendorId:s.vendorId};
		
		db.Visitors.find(obj,function(err,result){
			var n = result.length;
			console.log(result);
			var v = new db.Visitors({position:n,vendorId:s.vendorId});
			v.save(function(err,data){
				res.send(data);
			});
			
			
		});		
	});
	
	
}

exports.finishVisitor = function(req,res){

	var visitorId = req.params.visitorId;
	var vendorId = req.params.vendorId;
	db.Visitors.find({vendorId:vendorId},function(err,visitors){
		if(err){
			res.send(err,500);
		}else{
			for(var visitor=0;visitor<visitors.length;visitor++){
				if(visitors[visitor].visitorId == visitorId){
					visitors[visitor].time.out = new Date();
				}else{
					visitors[visitor].position--;
					if(visitor[visitor].position<5){
						//send notification to person that they will be next
					}
				}
			}
		
			visitors.save();
			res.send(visitors,200);
			
		}

	});


};
