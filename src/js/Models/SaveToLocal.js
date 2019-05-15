export default function saveStateToLocalStorage(data) {
	// Save state to localStorage
	localStorage.setItem('state_LocalStorage', JSON.stringify(data));
}
