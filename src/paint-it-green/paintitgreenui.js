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
const PAINTITGREEN = 'highlight';

/**
 * The PAINTITGREEN UI feature. It introduces the PAINTITGREEN button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class PaintitgreenUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add bold button to feature components.
		editor.ui.componentFactory.add( PAINTITGREEN, locale => {
			const command = editor.commands.get( PAINTITGREEN );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Paintitgreen' ),
				icon: boldIcon,
				keystroke: 'CTRL+H',
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				editor.execute( PAINTITGREEN ) 
			});

			return view;
		} );
	}
}
