import EntitySC from "./entity.js"

//BUG IS HERE!!! Comment the following line and things will work fine
// import EntityGroupSC from "./entityGroup.js"

import { schemaComposer } from 'graphql-compose';

const graphqlSchema = schemaComposer.buildSchema();

export default graphqlSchema