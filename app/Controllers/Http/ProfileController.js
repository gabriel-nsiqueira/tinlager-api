'use strict';

const Profile = use('App/Models/Profile');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with profiles
 */
class ProfileController {
	/**
   * Show a list of all profiles.
   * GET profiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async index() {
		const profiles = await Profile.query().with('user').fetch();
		return profiles;
	}

	/**
   * Create/save a new profile.
   * POST profiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async store({ request, auth }) {
		const data = request.only([ 'title' ]);
		const images = request.file('image', {
			types: [ 'image' ],
			size: '2mb'
		});

		await images.moveAll(Helpers.tmpPath('uploads'), (file) => ({
			name: `${Date.now()}-${file.clientName}`
		}));

		if (!images.movedAll()) {
			return images.errors();
		}
		const profile = Profile.create({ ...data, images });
		return profile;
	}

	/**
   * Display a single profile.
   * GET profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
	async show({ params }) {
		const profile = await Profile.findOrFail(params.id);
		profile.with('user');
		return profile;
	}

	/**
   * Update profile details.
   * PUT or PATCH profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async getImage({ params, response }) {
		const profile = await Profile.findOrFail(params.id);
		return response.download(Helpers.tmpPath(`uploads/${profile.image}`));
	}

	/**
   * Delete a profile with id.
   * DELETE profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
	async destroy({ params, auth, response }) {
		const profile = await Profile.findOrFail(params.id);

		if (profile.username != '777') {
			return response.status(401);
		}

		await profile.delete();
	}
}

module.exports = ProfileController;
