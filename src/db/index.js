import mongoose from 'mongoose';

mongoose.set('useFindAndModify', false)

import Entity from "./entity.js"
import EntityGroup from "./entityGroup.js"

mongoose.connect('mongodb://localhost:27017/weally', {useNewUrlParser: true})

export {
	Entity, EntityGroup
}