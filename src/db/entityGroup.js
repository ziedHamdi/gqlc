import mongoose, {Schema} from 'mongoose';
import {PointSchema} from "./geoPoint";

/**
 * Represents meta data of an entity : an entity may belong to only one group, this group contains the persons
 * responsible for the after sales service. If many entities belong to the same group, they can manage their employees
 * in a central manner. In more complex cases, each entity will belong to its own group (with its own employees) and the
 * groups will belong to a bigger group, which will eventually have its own people (that may have a different role in
 * each entity)
 */

const EmployeeCountCat = {
	'NN': -1,
	'00' : 0,
	'01' : 1,
	'02' : 3,
	'03' : 6,
	'11' : 10,
	'12' : 20,
	'21' : 50,
	'22' : 100,
	'31' : 200,
	'32' : 250,
	'41' : 500,
	'42' : 1000,
	'51' : 2000,
	'52' : 5000,
	'53' : 10000
}

const PhoneSchema = new mongoose.Schema({
	nbr:String,
	personName:String,
	personFunction:String,
	type:String
})

const MailSchema = new mongoose.Schema({
	mail:String,
	personName:String,
	personFunction:String,
	type:String
})

const UserRoleSchema = new mongoose.Schema({
	userId: String,
	userName:String,
	userPicId:String,
	role: {type: String, enum: ['ADMIN', 'ASR'/*after sales responsible*/, 'ASA' /*after sales agent*/]},
	state: {type: String, enum: ['PENDING', 'ACTIVE', 'QUIT']}
}, {timestamps: {}})

const IssuesStats = new Schema({
	period:{type:String, enum:["WEEK", "MONTH", "YEAR"]},
	issues:Number,
	solvedIssues:Number,
	rejectedIssues:Number,
})

/**
 * An entity group contains a list of users grouped by roles
 */
const EntityGroupSchema = new mongoose.Schema({
	//even if this field should be required, it isn't until the company registers at weally
	legalId: {type:String, index: true},
	country: String,
	activityLegalCode: String,
	employeeCountCat: String,
	isHeadOffice: {type:Boolean, default:true},
	existsSince:Date,
	categoryTree:[String],

	location: PointSchema,

	kind:{type:String, enum:["BRAND", "SERVICE"], required: true},
	//the after sales entity id is directly available here
	asEntityId:{type:String},
	parentGroupId: String, //optional for group of groups

	name: String,
	secondaryText: String,
	externalId:String,
	origin:{type:String, enum:["GMAPS", "AMAZON", "ADMIN", "USER"]},
	types: [String],
	address: String,
	phone:String,
	mapsUrl:String,

	desc: String,

	userList: {type: [UserRoleSchema]},
	issueCount:{type:Number, default:0},
	weekIssuesStats: IssuesStats,
	monthIssuesStats: IssuesStats,

	yearIssuesStats: IssuesStats,
	phones: [PhoneSchema],

	emails: [MailSchema],
	fb: String,
	ln: String,
	web: String,

	city: String,
	street_number: String,
	street_name: String,
	postal_code: Number,
	domain: String,
	leader_firstname: String,
	leader_lastname: String,
	legal_id: String,
	legal_format: String,
	legal_name: String,
	founded_year: Number,
	industry_code: String,
	industry_label: String,
	category: String,
	category_sub: String,
	metrics_employees_nb: Number,
	metrics_size: String,
	metrics_annual_revenues: String,
	metrics_annual_profit: String

}, {timestamps : {}})

const indexCreationCb = (err, db) => {
	console.log("After index creation : err: ", err, ", db : ", db)
}

mongoose.connection.collection('entitygroups').createIndex({
	kind: 1,
	location: "2dsphere"
}, indexCreationCb)

export default mongoose.model('EntityGroup', EntityGroupSchema)
