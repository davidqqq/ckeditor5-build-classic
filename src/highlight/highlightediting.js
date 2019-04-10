/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module basic-styles/highlight/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '../attributecommand';

const HIGHLIGHT = 'highlight';

/**
 * The highlight editing feature.
 *
 * It registers the `'highlight'` command and introduces the `highlight` attribute in the model which renders to the view
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
		// Allow highlight attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: HIGHLIGHT } );

		// Build converter from model to view for data and editing pipelines.

		editor.conversion.attributeToElement( {
			model: HIGHLIGHT,
			view: {
				name:'code',
				styles: { 
					'background-color': 'rgba(0,0,0,.05)',
					'padding': '3px 4px',
    				'margin':'0 2px',
    				'font-family': 'Menlo,Monaco,"Courier New",Courier,monospace',
    				'font-size': '16px'
			   }	   
			}
		} );

		// Create highlight command.
		editor.commands.add( HIGHLIGHT, new AttributeCommand( editor, HIGHLIGHT ) );

		// Set the Ctrl+H keystroke.
		editor.keystrokes.set( 'CTRL+H', HIGHLIGHT );
	}
}
