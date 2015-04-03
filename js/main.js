window.onload = function() {

	var black = false;
	
	var container = document.getElementById( 'container' ),
		containerWidth, containerHeight,
		renderer,
		scene,
		camera,
		cubes,
		geom,
		range = 50,
		mouseVector,
		axes,
		controls;

	if( window.parent != window ) {
		var h1 = document.querySelector( 'h1' );
		h1.parentNode.removeChild( h1 );
	}
	
	containerWidth = container.clientWidth;
	containerHeight = container.clientHeight;

	// Set up renderer, scene and camera
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( containerWidth, containerHeight );
	container.appendChild( renderer.domElement );

	renderer.setClearColorHex( 0x999999, 1.0 );
	
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 10000 );
	camera.position.set( range*1.3, range*1.3, range*1.3  );
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	// Add some cubes to the scene
	geom = new THREE.CubeGeometry(.5, .5, .5);

	cubes = new THREE.Object3D();
	scene.add( cubes );

	// rendererx = renderer;

	var n = 7;
	range = range / n;
	n = Math.floor(n/2);

	for(var i = -n; i < n+1; i++ ) {
		for(var j = -n; j < n+1; j++ ) {
			for(var k = -n; k < n+1; k++ ) {
				var grayness = 0.4,
					mat = new THREE.MeshBasicMaterial(),
					cube = new THREE.Mesh( geom, mat );

					mat.color.setRGB( grayness, grayness, grayness );
					cube.position.set( range * i, range * j, range * k );
					cube.grayness = grayness;

					//cube.addEventListener( 'onclick', onMouseDown, true );
					cubes.add( cube );
	}}}

	// Axes
	axes = buildAxes();
	//scene.add( axes );

	// Picking stuff

	projector = new THREE.Projector();
	mouseVector = new THREE.Vector3();

	// User interaction
	//window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'click', onMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );

	controls = new THREE.TrackballControls( camera );
	controls.zoomSpeed = 0.01;

	// And go!
	animate();


	// function onMouseMove( e ) {

	// 	// console.log('mousemove');
		
	// 	mouseVector.x = 2 * (e.clientX / containerWidth) - 1;
	// 	mouseVector.y = 1 - 2 * ( e.clientY / containerHeight );

	// 	var raycaster = projector.pickingRay( mouseVector.clone(), camera ),
	// 		intersects = raycaster.intersectObjects( cubes.children );

	// 	// cubes.children.forEach(function( cube ) {
	// 	// 	cube.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
	// 	// });
			
	// 	for( var i = 0; i < intersects.length; i++ ) {
	// 		var intersection = intersects[ i ],
	// 			obj = intersection.object;
	// 			objx = obj;
	// 			//objx.scale.x = 3; objx.scale.y = 3; objx.scale.z = 3;

	// 		obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
	// 	}
	// }


	function onMouseDown( e ) {

		console.log('mousedown');
		
		mouseVector.x = 2 * (e.clientX / containerWidth) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY / containerHeight );

		var raycaster = projector.pickingRay( mouseVector.clone(), camera ),
			intersects = raycaster.intersectObjects( cubes.children );

		// cubes.children.forEach(function( cube ) {
		// 	cube.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
		// });
			
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ],
				obj = intersection.object;
			
			obj.scale.x = 3; obj.scale.y = 3; obj.scale.z = 3;

			if(black) obj.material.color.setRGB( 1, 1, 1 );
			else obj.material.color.setRGB( 0, 0, 0 );
			black = !black;
		}
	}

	function onWindowResize( e ) {
		containerWidth = container.clientWidth;
		containerHeight = container.clientHeight;
		renderer.setSize( containerWidth, containerHeight );
		camera.aspect = containerWidth / containerHeight;
		camera.updateProjectionMatrix();
	}

	function animate() {
		requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );
	}


	http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/
	function buildAxes() {
		var axes = new THREE.Object3D();

		//var col = renderer.setClearColor( 0x000000, 0.2 ); // the default

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( n*range, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -n*range, 0, 0 ), 0x800000, false) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, n*range, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -n*range, 0 ), 0x008000, false ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, n*range ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -n*range ), 0x000080, false ) ); // -Z

		return axes;
	}

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat; 

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 1, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );

		var axis = new THREE.Line( geom, mat );

		return axis;
	}

}
