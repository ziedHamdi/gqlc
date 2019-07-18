import {composeWithMongoose} from 'graphql-compose-mongoose';
import {Resolver, TypeComposer, InputTypeComposer, schemaComposer} from 'graphql-compose';

import {Entity, EntityGroup} from '../db'


const customizationOptions = {}; // left it empty for simplicity, described below
const EntityTC = composeWithMongoose(Entity, customizationOptions)
// const entityCreate = EntityTC.getResolver('createOne');


// const LatLngTC = schemaComposer.createObjectTC({
// 	name: 'LatLng',
// 	fields: {
// 		lat: 'String!',
// 		lng: 'String!'
// 	}
// })
//
// const InputLatLngTC = schemaComposer.createInputTC({
// 	name: 'LatLngInput',
// 	fields: {
// 		lat: 'String',
// 		lng: 'String'
// 	}
// })
//
// const ViewportTC = schemaComposer.createObjectTC({
// 	name: "Viewport",
// 	fields: {
// 		northeast: LatLngTC,
// 		southwest: LatLngTC
// 	}
// })
//
// const InputViewportTC = schemaComposer.createInputTC({
// 	name: "ViewportInput",
// 	fields: {
// 		northeast: InputLatLngTC,
// 		southwest: InputLatLngTC
// 	}
// })
//
// const ReverseGeolocTC = schemaComposer.createObjectTC({
// 	name: "ReverseGeoLoc",
// 	fields: {
// 		formatted_address: 'String!',
// 		viewport: ViewportTC
// 	}
// })

//TODO make this function evolve to allow filtering on a specified field in params
//Found in https://github.com/graphql-compose/graphql-compose-examples/blob/master/examples/northwind/models/product.js#L38,L49

// composeWithConnection(EntityTC, {
// 	findResolverName: 'findMany',
// 	countResolverName: 'count',
// 	sort: {
// 		_ID_ASC: {
// 			value: {_id: 1},
// 			cursorFields: ['_id'],
// 			beforeCursorQuery: (rawQuery, cursorData, resolveParams) => {
// 				if (!rawQuery._id) rawQuery._id = {};
// 				rawQuery._id.$lt = cursorData._id;
// 			},
// 			afterCursorQuery: (rawQuery, cursorData, resolveParams) => {
// 				if (!rawQuery._id) rawQuery._id = {};
// 				rawQuery._id.$gt = cursorData._id;
// 			},
// 		},
//
// 		CREATED_ASC: {
// 			value: {createdAt: 1},
// 			cursorFields: ['createdAt'],
// 			beforeCursorQuery: (rawQuery, cursorData, resolveParams) => {
// 				if (!rawQuery.createdAt) rawQuery.createdAt = {};
// 				rawQuery.createdAt.$lt = cursorData.createdAt;
// 			},
// 			afterCursorQuery: (rawQuery, cursorData, resolveParams) => {
// 				if (!rawQuery.createdAt) rawQuery.createdAt = {};
// 				rawQuery.createdAt.$gt = cursorData.createdAt;
// 			},
// 		},
//
// 		_ID_DESC: {
// 			value: {_id: -1},
// 			cursorFields: ['_id'],
// 			beforeCursorQuery: (rawQuery, cursorData, resolveParams) => {
// 				if (!rawQuery._id) rawQuery._id = {};
// 				rawQuery._id.$gt = cursorData._id;
// 			},
// 			afterCursorQuery: (rawQuery, cursorData, resolveParams) => {
// 				if (!rawQuery._id) rawQuery._id = {};
// 				rawQuery._id.$lt = cursorData._id;
// 			},
// 		}
// 	}
// })


const verifyFilterArg = (resolverName, arg) => {
	const resolver = EntityTC.getResolver(resolverName);
	const filterCfg = resolver.getArgConfig('filter');

	const filterITC = schemaComposer.createInputTC((filterCfg.type));
	const field = filterITC.getField(arg);
	console.log("FOUND entity resolver's ", resolverName," filter ", filterCfg," arg ", arg, " :", field.description);
}

// const addEntityNameRegexpSearch = function (resolverName) {
// 	const extendedResolver = EntityTC.getResolver(resolverName).addFilterArg({
// 		name: 'nameRegexp1',
// 		type: 'String',
// 		description: 'Search by name in regExp',
// 		query: (query, value, resolveParams) => {
// 			query.name = new RegExp(value, 'i');
// 		},
// 	});
// 	extendedResolver.name = resolverName;
// 	EntityTC.addResolver(extendedResolver);
//
// 	verifyFilterArg(resolverName, 'nameRegexp1')
// }

const addEntityNameRegexpSearch = function (resolverName) {
	const extendedResolver = EntityTC.getResolver(resolverName).addFilterArg({
		name: 'nameRegexp',
		type: 'String',
		description: 'Search by name in regExp',
		query: (query, value, resolveParams) => {
			query.name = new RegExp(value, 'i');
			console.log("Entity query: ", query)
		},
	});
	extendedResolver.name = resolverName;
	EntityTC.addResolver(extendedResolver);

	verifyFilterArg(resolverName, 'nameRegexp')
}


// const addEntityByLocationSearch = function (resolverName) {
// 	const extendedResolver = EntityTC.getResolver(resolverName).addFilterArg({
// 		name: 'location',
// 		type: InputLatLngTC,
// 		description: 'Search aroind a given location (lat, lng) in priority',
// 		query: (query, value, resolveParams) => {
// 			// FIXME do localized query
// 			// query.name = new RegExp(value, 'i');
// 		},
// 	});
// 	extendedResolver.name = resolverName;
// 	EntityTC.addResolver(extendedResolver);
// }

// const addEntityViewportSearch = function (resolverName) {
// 	const extendedResolver = EntityTC.getResolver(resolverName).addFilterArg({
// 		name: 'viewport',
// 		type: InputViewportTC,
// 		description: 'Search in a given viewport in priority',
// 		query: (query, value, resolveParams) => {
// 			// FIXME do localized query
// 			// query.name = new RegExp(value, 'i');
// 		},
// 	});
// 	extendedResolver.name = resolverName;
// 	EntityTC.addResolver(extendedResolver);
// }

// addEntityByLocationSearch('connection')
// addEntityByLocationSearch('findMany')

// const entityConnectionRaw = EntityTC.getResolver('connection')
// const entityFindManyRaw = EntityTC.getResolver('findMany')

// const entityConnection = schemaComposer.createResolver({
// 	name: 'entityConnection',
// 	type: entityConnectionRaw.type,
// 	args: entityConnectionRaw.args,
// 	resolve: async (rp) => {
// 		const {args, context} = rp
// 		const foundEntities = await entityConnectionRaw.resolve(rp)
// 		// console.log("Found entities for args: ", args, "\n_t :=> ", foundEntities)
// 		if (!foundEntities.pageInfo.hasNextPage) {
// 			const filter = args.filter
// 			// console.log("########## filter :", filter)
// 			const predictionsAsEntities = await mapsPlacesAutocomplete(filter, context.sessionID)
// 			removeDuplicates(foundEntities.edges, predictionsAsEntities)
//
// 			foundEntities.count += predictionsAsEntities.length
// 			foundEntities.edges.push(...predictionsAsEntities.map((entity) => ({
// 				cursor: "fakeCursor-GMapsEntries",
// 				node: entity
// 			})))
// 		}
// 		return foundEntities
// 	}
// })

// function removeDuplicates(toKeep, toFilter) {
// 	for (let i = 0; i < toKeep.length; i++) {
// 		const currentExternalId = toKeep[i].node.externalId
// 		const foundIndex = toFilter.findIndex((entity) => entity.externalId === currentExternalId)
// 		// console.log( "############################ ", currentExternalId , " found in google results at index : ", foundIndex)
// 		if (foundIndex != -1) toFilter.splice(foundIndex, 1)
// 	}
// }


// async function mapsPlacesAutocomplete(filter, sessionID) {
// 	// console.log("Maps filter executing against: ", filter)
//
// 	const response = await googleMapsClient.placesAutoComplete({
// 		input: filter.nameRegexp.substring(1),
// 		location: filter.location,
// 		radius: 50000,
// 		language: 'fr',
// 		sessiontoken: sessionID,
// 		types: 'establishment'
// 	}).asPromise()
//
// 	// if (response.status !== 200) {
// 	// 	console.error(response)
// 	// 	throw new Error(response.)
// 	// }
//
// 	const predictions = response.json.predictions
// 	const predictionsAsEntities = predictions.map(pred => ({
// 		_id: "gmaps_" + pred.place_id,
// 		name: pred.structured_formatting.main_text,
// 		secondaryText: pred.structured_formatting.secondary_text,
// 		externalId: pred.place_id,
// 		types: pred.types,
// 		source: "GMAPS",
// 		issueCount: 0
// 	}))
// 	return predictionsAsEntities;
// }

// async function mapsReverseGeoLoc(lat, lng) {
// 	console.log("mapsReverseGeoLoc entred: lat", lat, ", lng", lng)
//
// 	const response = await googleMapsClient.reverseGeocode({
// 		latlng: [lat, lng],
// 		result_type: ['street_address'],
// 		location_type: ['ROOFTOP']
// 	}).asPromise()
//
// 	console.log("gmaps response", response)
//
// 	const json = response.json;
// 	if (json.status === 'ZERO_RESULTS') {
// 		return {
// 			formatted_address: 'error'
// 		}
// 	}
// 	const found = json.results[0]
// 	return {
// 		formatted_address: found.formatted_address,
// 		viewport: found.geometry.viewport
// 	}
// }

// const registerEntity = schemaComposer.createResolver({
// 	name: 'registerEntity',
// 	type: entityCreate.type,
// 	args: {
// 		source: 'String!',
// 		externalId: 'String!'
// 	},
// 	resolve: async ({source, args, context, info}) => {
// 		const {source: origin, externalId} = args
// 		const inDb = await Entity.findOne({externalId})
//
// 		if (inDb) return {
// 			recordId: inDb.id,
// 			record: inDb
// 		}
//
// 		if (origin === "GMAPS") {
// 			try {
// 				const place = await googleMapsClient.place({
// 					placeid: externalId,
// 					fields: ["address_component", "adr_address", "formatted_address", "geometry", "name", "permanently_closed", "place_id", "type", "url", "utc_offset", "formatted_phone_number", "website"]
// 				}).asPromise()
// 				const placeDetail = place.json.result
// 				const location = {
// 					type: 'Point',
// 					coordinates: [placeDetail.geometry.location.lng, placeDetail.geometry.location.lat]
// 				};
// 				const entityGroup = {
// 					externalId,
// 					origin,
// 					kind: "SERVICE",
// 					name: placeDetail.name,
// 					types: placeDetail.types,
// 					mapsUrl: placeDetail.url,
// 					address: placeDetail.formatted_address,
// 					phone: placeDetail.formatted_phone_number,
// 					web: placeDetail.website,
// 					location
// 				}
// 				const createdEntityGroup = await EntityGroup.create(entityGroup)
// 				const entity = {
// 					entityGroupId: createdEntityGroup._id,
// 					kind: "AS",
// 					name: entityGroup.name,
// 					externalId,
// 					origin,
// 					types: placeDetail.types,
// 					mapsUrl: placeDetail.url,
// 					address: placeDetail.formatted_address,
// 					web: placeDetail.website,
// 					location
// 				}
// 				const createdEntity = await Entity.create(entity);
//
// 				return {
// 					recordId: createdEntityGroup.id,
// 					record: createdEntity
// 				}
// 			} catch (err) {
// 				console.error("error while requesting gmaps : ", err)
// 			}
// 		} else console.error("Unsupported origin type: ", origin)
//
// 		return null
// 	}
// })

// const reverseGeoLoc = schemaComposer.createResolver({
// 	kind: 'query',
// 	name: "reverseGeoLoc",
// 	type: ReverseGeolocTC,
// 	args: {
// 		lat: 'String!',
// 		lng: 'String!'
// 	},
// 	resolve: async ({source, args, context, info}) => {
// 		try {
// 			const geoLoc = await mapsReverseGeoLoc(args.lat, args.lng)
// 			console.log("found geoloc ", JSON.stringify(geoLoc))
// 			return geoLoc
// 		} catch (err) {
// 			console.error("Error while requesting geoloc: ", err)
// 			return null
// 		}
// 	}
// })

// const entityMany = schemaComposer.createResolver({
// 	name: 'entityMany',
// 	type: entityFindManyRaw.type,
// 	args: entityFindManyRaw.args,
// 	resolve: async ({source, args, context, info}) => {
// 		const location = args.filter.location;
// 		// console.log('########### args before : ', args)
// 		if (location != null && location.lat != null) {
// 			args.filter.location = {
// 				$near: {
// 					$geometry: {
// 						type: "Point",
// 						coordinates: [location.lng, location.lat]
// 					},
// 					$maxDistance: 50000
// 				}
// 			}
// 		}
//
// 		// console.log('########### args: ', args)
// 		const foundEntities = await entityFindManyRaw.resolve({
// 			source,
// 			args,
// 			context,
// 			info
// 		})
// 		// console.log("Find many result for : ", JSON.stringify(args), " : ", foundEntities)
// 		const mapsFilter = {
// 			location,
// 			nameRegexp: args.filter.nameRegexp
// 		};
// 		// console.log('########### maps mapsFilter : ', mapsFilter)
// 		if (args.filter.kind !== 'AS') return foundEntities
//
// 		if (foundEntities.length == 0) {
// 			const predictionsAsEntities = await mapsPlacesAutocomplete(mapsFilter, context.sessionID)
//
// 			return predictionsAsEntities
// 		}
//
// 		return foundEntities
// 	}
// })

// addEntityNameRegexpSearch('connection')
addEntityNameRegexpSearch('findMany')

schemaComposer.Query.addFields({
	// entityById: EntityTC.getResolver('findById'),
	// entityByIds: EntityTC.getResolver('findByIds'),
	// entityOne: EntityTC.getResolver('findOne'),
	// entityCount: EntityTC.getResolver('count'),
	entityMany : EntityTC.getResolver('findMany'),
	// entityConnection,
	// reverseGeoLoc
});

// schemaComposer.Mutation.addFields({
// 	// entityCreate,
// 	// registerEntity,
// 	// entityUpdateById: EntityTC.getResolver('updateById'),
// 	// entityUpdateOne: EntityTC.getResolver('updateOne'),
// 	// entityUpdateMany: EntityTC.getResolver('updateMany'),
// 	// entityRemoveById: EntityTC.getResolver('removeById'),
// 	// entityRemoveOne: EntityTC.getResolver('removeOne'),
// 	// entityRemoveMany: EntityTC.getResolver('removeMany'),
// });


export { EntityTC };
export default schemaComposer;