'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProfileSchema extends Schema {
	up() {
		this.create('profiles', (table) => {
			table.increments();
			table
				.integer('price')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('CASCADE');
			table.string('title', 240).notNullable();
			table.string('image', 240);
			table.timestamps();
		});
	}

	down() {
		this.drop('profiles');
	}
}

module.exports = ProfileSchema;
