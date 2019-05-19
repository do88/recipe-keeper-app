// Required
import $ from 'jquery';
import { elements } from './base';

export default function displayUserMessage(messageType, messageContent) {
	const markup = `
		<p class="message__${messageType}">${messageContent}</p>
	`;
	$(elements.recipeMessages)
		.stop()
		.hide()
		.html(markup)
		.slideToggle()
		.delay(1500)
		.slideToggle();
}
