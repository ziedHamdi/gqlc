/**
 * this schema was inspired from https://listflow.io/fr/fichiers-entreprises/paris/#DownloadFile
 *
 * Also see
 * https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/
 * and
 * https://api.insee.fr/catalogue/
 */
import mongoose, {Schema} from 'mongoose';
import {PointSchema} from "./geoPoint";

const IssuesStats = new Schema({
	period: {
		type: String,
		enum: ["WEEK", "MONTH", "YEAR"]
	},
	issues: Number,
	solvedIssues: Number,
	rejectedIssues: Number,
})

const EntitySchema = new Schema({
	kind: {
		type: String,
		enum: ["AS", "PRODUCT"],
		required: true
	},
	name: {
		type: String,
		required: true,
		index: true
	},
	secondaryText: String,
	externalId: String,
	types: [String],
	source: {
		type: String,
		enum: ["GMAPS", "AMAZON", "ADMIN", "USER"]
	},
	origin: {
		type: String,
		enum: ["GMAPS", "AMAZON", "ADMIN", "USER"]
	},
	address: String,
	mapsUrl: {type: String},


	entityGroupId: {
		type: String,
		required: true
	},
	city: String,
	img: String,
	barCode: String,
	issueCount: {
		type: Number,
		default: 0
	},
	weekIssuesStats: IssuesStats,
	monthIssuesStats: IssuesStats,
	yearIssuesStats: IssuesStats,

	location: PointSchema,

	web: String,
	fb: String,
	ln: String,

	createdAt: {
		type: Date,
		index: true
	},
	updatedAt: {
		type: Date,
		index: true
	},

}, {timestamps: {}})

const indexCreationCb = (err, db) => {
	console.log("After index creation : err: ", err, ", db : ", db)
}

mongoose.connection.collection('entities').createIndex({
	kind: 1,
	location: "2dsphere"
}, indexCreationCb)

// mongoose.connection.collection('entities').createIndex({
// 	kind: 1,
// 	name: 1,
// 	location: "2dsphere"
// })

export default mongoose.model('Entity', EntitySchema)
