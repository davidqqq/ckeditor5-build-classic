/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module basic-styles/paintitgreen/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '../attributecommand';

const PAINTITGREEN = 'paintitgreen';

/**
 * The paintitgreen editing feature.
 *
 * It registers the `'paintitgreen'` command and introduces the `paintitgreen` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class HighlightEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow paintitgreen attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: PAINTITGREEN } );

		// Build converter from model to view for data and editing pipelines.

		editor.conversion.attributeToElement( {
			model: PAINTITGREEN,
			view: {
				name:'code',
				styles: { 
					'background-color': 'green',
					'color': 'white'
			   }	   
			}
		} );

		// Create paintitgreen command.
		editor.commands.add( PAINTITGREEN, new AttributeCommand( editor, PAINTITGREEN ) );

		// Set the Ctrl+H keystroke.
		editor.keystrokes.set( 'CTRL+H', PAINTITGREEN );
	}
}
