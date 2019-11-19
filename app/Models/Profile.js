'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Profile extends Model {
	getUrl({ path }) {
		return `${Env.get('APP_URL')}/images/${path}`;
	}
}

module.exports = Profile;
