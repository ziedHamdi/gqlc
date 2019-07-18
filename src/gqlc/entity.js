import {composeWithMongoose} from 'graphql-compose-mongoose';
import {Resolver, TypeComposer, InputTypeComposer, schemaComposer} from 'graphql-compose';

import {Entity, EntityGroup} from '../db'


const customizationOptions = {}; // left it empty for simplicity, described below
const EntityTC = composeWithMongoose(Entity, customizationOptions)

const verifyFilterArg = (resolverName, arg) => {
	const resolver = EntityTC.getResolver(resolverName);
	const filterCfg = resolver.getArgConfig('filter');

	const filterITC = schemaComposer.createInputTC((filterCfg.type));
	const field = filterITC.getField(arg);
	console.log("FOUND entity resolver's ", resolverName," filter ", filterCfg," arg ", arg, " :", field.description);
}

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


addEntityNameRegexpSearch('findMany')

schemaComposer.Query.addFields({
	entityMany : EntityTC.getResolver('findMany'),
});

export { EntityTC };
export default schemaComposer;