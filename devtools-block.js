document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', function(e) {
	if (
		e.key === 'F12' ||
		(e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
		(e.ctrlKey && e.key.toUpperCase() === 'U')
	) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
});
let devtoolsOpen = false;
const threshold = 160;
setInterval(() => {
	const widthThreshold = window.outerWidth - window.innerWidth > threshold;
	const heightThreshold = window.outerHeight - window.innerHeight > threshold;
	if (widthThreshold || heightThreshold) {
		if (!devtoolsOpen) {
			devtoolsOpen = true;
			document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:2rem;color:#ff5e62;background:#181a20;">DevTools are not allowed.</div>';
		}
	} else {
		devtoolsOpen = false;
	}
}, 500);
