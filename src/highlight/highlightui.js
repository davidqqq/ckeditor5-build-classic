/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module basic-styles/bold/boldui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';


import boldIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg'
const HIGHLIGHT = 'highlight';

/**
 * The highlight UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class HighlightUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add bold button to feature components.
		editor.ui.componentFactory.add( HIGHLIGHT, locale => {
			const command = editor.commands.get( HIGHLIGHT );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Highlight' ),
				icon: boldIcon,
				keystroke: 'CTRL+H',
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				editor.execute( HIGHLIGHT ) 
			});

			return view;
		} );
	}
}
