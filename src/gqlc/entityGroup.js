import {composeWithMongoose} from 'graphql-compose-mongoose';
import {Resolver, schemaComposer,} from 'graphql-compose';
import {Entity, EntityGroup} from '../db'
// import {addUserToEntityGroup} from "../business/entityGroupProcessor";

const customizationOptions = {}; // left it empty for simplicity, described below

const EntityTC = composeWithMongoose(Entity, customizationOptions)
const EntityGroupTC = composeWithMongoose(EntityGroup, customizationOptions)

const outputType = schemaComposer.getOrCreateOTC("entityGroupCreate", t => {
	t.addFields({
		recordId: {
			type: 'MongoID',
			description: 'Created document ID',
		},
		record: {
			type: EntityGroupTC,
			description: 'Created document',
		},
	});
});

const createEntityGroupResolver = EntityGroupTC.getResolver('createOne')
const createEntityResolver = EntityTC.getResolver('createOne')

const entityGroupCreate = schemaComposer.createResolver({
	name: 'entityGroupCreate',
	type: createEntityGroupResolver.type,
	args: createEntityGroupResolver.args,
	resolve: async ({source, args, context, info}) => {
		const entityGroupCreated = await createEntityGroupResolver.resolve({source, args, context, info});
		const created = entityGroupCreated.record
		const newArgs = {
			record:
					{name: args.record.name, entityGroupId: created._id, kind: 'AS'}
		}
		const asEntity = await createEntityResolver.resolve({source, args: newArgs, context, info});
		created.asEntityId = asEntity.record._id
		await created.save()
		return entityGroupCreated
	}
});

// const entityGroupAddUser = schemaComposer.createResolver({
// 	name: 'entityGroupAddUser',
// 	type: EntityGroupTC,
// 	args: {_id: 'String!', userId: 'String!', role: 'String!', state: 'String'},
// 	resolve: async ({source, args: resolveArgs, context, info}) => {
// 		const {user: connectedUser} = context
// 		const {_id: entityGroupId, userId: userToAddId, role, state} = resolveArgs;
// 		//FIXME check that the connected user has the right to add a user to this shop
// 		// console.log("Connected user : ", connectedUser)
// 		return await addUserToEntityGroup(connectedUser, userToAddId, entityGroupId, role, state)
// 	}
// });

// const entityGroupChangeUserRole = schemaComposer.createResolver({
// 	name: 'entityGroupChangeUserRole',
// 	type: EntityGroupTC,
// 	args: {_id: 'String!', userId: 'String!', role: 'String', state: 'String'},
// 	resolve: async ({source, args: resolveArgs, context, info}) => {
// 		const {user: connectedUser} = context
// 		let {id: userId, name: userName, picId: userPicId} = connectedUser
// 		const {_id, userId: userToModifyId, role, state} = resolveArgs;
// 		//FIXME check that the connected user has the right to modify a user to this entity group
// 		if (userToModifyId !== userId) {
// 			const user = await User.findOne({_id: userToModifyId})
// 			userId = user._id
// 			userName = user.name
// 			userPicId = user.picId
// 		}
// 		const toModify = await EntityGroup.findOne({_id})
// 		const {userList} = toModify
// 		for (let i = 0; i < userList.length; i++) {
// 			const userRole = userList[i]
// 			if (userRole.userId == userId) {
// 				if( role != null )
// 					userRole.role = role
// 				if( state != null )
// 					userRole.state = state
// 				break
// 			}
// 		}
// 		await toModify.save()
// 		return toModify
// 	}
// });

const verifyFilterArg = (resolverName, arg) => {
	const filterCfg = EntityGroupTC.getResolver(resolverName).getArgConfig('filter');

	const filterITC = schemaComposer.createInputTC((filterCfg.type));
	console.log("FOUND EntityGroup resolver's ", resolverName," filter arg ", arg, " :", filterITC.getField(arg).description);
}

const addEntityGroupNameRegexpSearch = function (resolverName) {
	const extendedResolver = EntityGroupTC.getResolver(resolverName).addFilterArg({
		name: 'nameRegexp',
		type: 'String',
		description: 'Search by name in regExp',
		query: (query, value, resolveParams) => {
			query.name = new RegExp(value, 'i');
			console.log("EG quesy: ", query)
		},
	});
	extendedResolver.name = resolverName;
	EntityGroupTC.addResolver(extendedResolver);

	verifyFilterArg(resolverName, 'nameRegexp')
}
addEntityGroupNameRegexpSearch('connection')
addEntityGroupNameRegexpSearch('findMany')

schemaComposer.Query.addFields({
	entityGroupById: EntityGroupTC.getResolver('findById'),
	entityGroupByIds: EntityGroupTC.getResolver('findByIds'),
	entityGroupOne: EntityGroupTC.getResolver('findOne'),
	entityGroupMany: EntityGroupTC.getResolver('findMany'),
	entityGroupCount: EntityGroupTC.getResolver('count'),
	entityGroupConnection: EntityGroupTC.getResolver('connection'),
	userEntityGroupConnection: EntityGroupTC.getResolver('connection').wrapResolve(next => async rp => {
				const {user} = rp.context
				if (!user)
					throw new Error("IllegalState: no user connected, this method should not be called")

				rp.args.filter = {userList: {$elemMatch: {userId: user.id}}}
				return next(rp);
			}
	)

});

schemaComposer.Mutation.addFields({
	entityGroupCreate,
	// entityGroupAddUser,
	// entityGroupChangeUserRole,
	entityGroupUpdateById: EntityGroupTC.getResolver('updateById'),
	entityGroupUpdateOne: EntityGroupTC.getResolver('updateOne'),
	entityGroupUpdateMany: EntityGroupTC.getResolver('updateMany'),
	entityGroupRemoveById: EntityGroupTC.getResolver('removeById'),
	entityGroupRemoveOne: EntityGroupTC.getResolver('removeOne'),
	entityGroupRemoveMany: EntityGroupTC.getResolver('removeMany'),
});


export default schemaComposer;