/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module basic-styles/bold
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import PaintitgreenEditing from './paint-it-green/paintitgreenediting';
import PaintitgreenUI from './paint-it-green/paintitgreenui';

/**
 * The highlight feature.
 *
 * For a detailed overview check the {@glink features/basic-styles Basic styles feature documentation}
 * and the {@glink api/basic-styles package page}.
 *
 * This is a "glue" plugin which loads the {@link module:basic-styles/bold/boldediting~BoldEditing bold editing feature}
 * and {@link module:basic-styles/bold/boldui~BoldUI bold UI feature}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Paintitgreen extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ PaintitgreenEditing,PaintitgreenUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Paintitgreen';
	}
}
