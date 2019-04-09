/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module code-block/codeblockediting
 */


import {
	findOptimalInsertionPosition
} from '@ckeditor/ckeditor5-widget/src/utils';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import quoteIcon from './javascript.svg'
import JavascriptCommand from './javascriptcommand';
import {
	downcastElementToElement,
	downcastAttributeToAttribute
} from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {upcastElementToElement} from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
/**
 * The code block editing.
 *
 * Introduces the `'javascriptCodeBlock'` command and the `'javascriptCodeBlock'` model element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class JavascriptEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;

		editor.commands.add('javascriptCodeBlock', new JavascriptCommand(editor));

		schema.register('javascriptCodeBlock', {
			isObject: true,
			isBlock: true,
			allowContentOf: '$root',
			allowWhere: ['$block'],
			allowIn: ['$root'],
			allowAttributes: ['language']
		});

		// Disallow javascriptCodeBlock in javascriptCodeBlock.
		schema.addChildCheck((ctx, childDef) => {
			
			if (ctx.endsWith('javascriptCodeBlock') && childDef.name == 'javascriptCodeBlock') {
				return false;
			}
		});

		editor.conversion.for('editingDowncast').add(
			// downcastElementToElement({
			// 	converterPriority: 'high' ,
			// 	view:"javascriptCodeBlock",
			// 	model:(modelElement, viewWriter)=>{
			// 		console.log('editingDowncast')
			// 		const codeElement = viewWriter.createElement('code', {
			// 			class: 'language'
			// 		});
			// 		return viewWriter.createElement('pre',{},preElement);
					

			// 		// return viewWriter.insert(ViewPosition._createAt(preElement,0), codeElement);
			// 	}
			// })
		modelCodeBlockToView.bind(this)()	
		)
		editor.conversion
			.for('dataDowncast')
			.add(modelCodeBlockToView.bind(this)());
		editor.conversion.for('upcast')
			.add(upcastElementToElement( {
				converterPriority: 'high' ,
				view: 'pre',
				model: ( viewElement, modelWriter ) => {
					const codeElement = Array.from(viewElement.getChildren())[0]
					const javascriptCodeBlock = modelWriter.createElement( 'javascriptCodeBlock')
					modelWriter.setAttribute("language",'javascript hljs',javascriptCodeBlock)
					return javascriptCodeBlock 
				}
			} ));

		editor.ui.componentFactory.add('javascriptCodeBlock', locale => {
			const command = editor.commands.get('javascriptCodeBlock');
			const buttonView = new ButtonView(locale);

			buttonView.set({
				label: 'Code block',
				icon: quoteIcon,
				tooltip: true
			});

			// Bind button model to command.
			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			// Execute command.
			this.listenTo(buttonView, 'execute', () => {
				console.log('execuute code block')
				editor.execute('javascriptCodeBlock')
			});

			return buttonView;
		});
	}

	/**
	 * @inheritDoc
	 */
	afterInit() {
		const editor = this.editor;
		const command = editor.commands.get('javascriptCodeBlock');

		// Overwrite default Enter key behavior.
		// If Enter key is pressed with selection collapsed in empty block inside a block, break the block.
		// This listener is added in afterInit in order to register it after list's feature listener.
		// We can't use a priority for this, because 'low' is already used by the enter feature, unless
		// we'd use numeric priority in this case.
		this.listenTo(this.editor.editing.view.document, 'enter', (evt, data) => {
			const doc = this.editor.model.document;
			const positionParent = doc.selection.getLastPosition().parent;
			console.log('unless enter, dont code block')
			if (doc.selection.isCollapsed && positionParent.isEmpty &&
				command.value
			) {
				this.editor.execute('javascriptCodeBlock');
				this.editor.editing.view.scrollToTheSelection();

				data.preventDefault();
				evt.stop();
			}

			if (doc.selection.isCollapsed && data.isSoft &&
				command.value
			) {
				this.editor.execute('input', {
					text: '\n'
				});
				this.editor.editing.view.scrollToTheSelection();

				data.preventDefault();
				evt.stop();
			}
		});
	}
}



/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module code-block/codeblockcommand
 */


export function modelCodeBlockToView() {
	return dispatcher => {
		console.log('recevied event insert:javascriptCodeBlock')
		dispatcher.on('insert:javascriptCodeBlock', converter.bind(this), {
			priority: 'high'
		});
		dispatcher.on('insert:paragraph',()=>console.log('p inserted'), {
			priority: 'high'
		});
	};

	function converter(evt, data, conversionApi) {
		const javascriptCodeBlock = data.item;
		
		// Consume the codeblock and texts
		conversionApi.consumable.consume(javascriptCodeBlock, 'insert')
		// We require the codeblock to have a single text node.
		if (javascriptCodeBlock.childCount === 0) {
			return;
		}
		const viewWriter = conversionApi.writer;
		// Create <pre> and <code> block
		const preElement = new ContainerElement('pre');
		const codeElement = new ContainerElement('code', {
			class: 'javascript hljs'
		});
		
		conversionApi.mapper.bindElements(javascriptCodeBlock, codeElement);

		// Create position at ^text
		const textPosition = conversionApi.mapper.toViewPosition(data.range.start);
		// Create position at <pre>^
		const prePosition = viewWriter.createPositionAt(preElement,0)

		// Insert <pre> at ^text
		viewWriter.insert(textPosition, preElement);
		// Insert <code> at <pre>^text
		viewWriter.insert(prePosition, codeElement);
		console.log("Create code block view")
		evt.stop();
	}
}