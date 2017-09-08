import React from 'react';

export default function LoginPage() {
    return (
    	<div id="loginWrapper">
	    	<h2>Watch My Bitcoin Address App</h2>
	    	<a href={'/api/auth/google'} id="loginLink">Login with Google</a>
	    	<h4>30-second demo video:</h4>
	    	<video controls autoPlay preload="auto" width='640' height='821' poster='/videoPoster.png'>
				<source src='/demo30sec.mp4' type='video/mp4' />
				Your browser does not support the HTML5 'video' tag
			</video>
    	</div>
    	)
}
