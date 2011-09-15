var THREEx	= THREEx		|| {};
THREEx.jigliber	= THREEx.jigliber	|| {};

THREEx.jigliber.System	= function()
{
	this._system	= jiglib.PhysicsSystem.getInstance();
	//system.setCollisionSystem(); // CollisionSystemBrite
	this._system.setCollisionSystem(true); // CollisionSystemGrid
	//system.setSolverType("FAST");
	//system.setSolverType("NORMAL");
	this._system.setSolverType("ACCUMULATED");
	this._setGravity( new Vector3D( 0, -9.8*2, 0, 0 ) );

}

THREEx.jigliber.addMesh	= function(system, mesh)
{
	var geometry	= mesh.geometry;
	var body	= null;

	if( geometry instanceof THREE.CubeGeometry ){
		body	= THREEx.jigliber._cube2Body(mesh);
	}else if( geometry instanceof THREE.SphereGeometry ){
		body	= THREEx.jigliber._sphere2Body(mesh);
	}else if( geometry instanceof THREE.PlaneGeometry ){
		body	= THREEx.jigliber._plane2Body(mesh);
	}else	console.assert(false, "mesh of an unhandled geometry");

	// TODO replace this one by something more specific later
	mesh.rigidBody = body;
	
	system.addBody( body );

}

THREEx.jigliber._sphere2Body	= function(mesh)
{
	var geometry	= mesh.geometry;	
	console.assert( geometry instanceof THREE.SphereGeometry );
	// get the radius of the THREE.SphereGeometry
	// - TODO what about mesh.scale THREE.Vector3 ?
	geometry.computeBoundingBox();
	var radius	= geometry.boundingBox.x[1] - geometry.boundingBox.x[0];
	
	// build the RigidBody for this Sphere
	var body	= new jiglib.JSphere( null, radius );
	// TODO this is bad. to hard that here
	body.set_mass( 4 / 3 * Math.PI * Math.pow( radius, 3 ) / 100 );
	body.moveTo( new Vector3D( mesh.position.x, mesh.position.y, mesh.position.z, 0 ) );
	
	return body;
}



THREEx.jigliber._cube2Body	= function(mesh)
{
	var geometry	= mesh.geometry;
	console.assert( geometry instanceof THREE.CubeGeometry );

	// get the radius of the THREE.CubeGeometry
	// - TODO what about mesh.scale THREE.Vector3 ?
	geometry.computeBoundingBox();
	var width	= geometry.boundingBox.x[1] - geometry.boundingBox.x[0];
	var height	= geometry.boundingBox.y[1] - geometry.boundingBox.y[0];
	var depth	= geometry.boundingBox.z[1] - geometry.boundingBox.z[0];

	var body = new jiglib.JBox( null, width, depth, height );
	body.set_mass( width * height * depth );
	body.moveTo( new Vector3D( mesh.position.x, mesh.position.y, mesh.position.z, 0 ) );

	return body;
}

THREEx.jigliber._plane2Body	= function(mesh)
{
	var geometry	= mesh.geometry;
	console.assert( geometry instanceof THREE.PlaneGeometry );

	// NOTE: plane on three.js are limited, in
	// 

	// get the radius of the THREE.CubeGeometry
	// - TODO what about mesh.scale THREE.Vector3 ?
	geometry.computeBoundingBox();
	var width	= geometry.boundingBox.x[1] - geometry.boundingBox.x[0];
	var height	= geometry.boundingBox.y[1] - geometry.boundingBox.y[0];
	var depth	= geometry.boundingBox.z[1] - geometry.boundingBox.z[0];

console.log("geometry", geometry.boundingBox);
console.log(width, height, depth);
	console.assert(depth === 0);
	depth		= 0.5;

	var body = new jiglib.JBox( null, width, depth, height );

	body.set_mass( width * height * depth );

	body.set_x( mesh.position.x );
	body.set_y( mesh.position.y );
	body.set_z( mesh.position.z );
	body.set_rotationX( mesh.rotation.x / Math.PI*180 );
	body.set_rotationY( mesh.rotation.y / Math.PI*180 );
	body.set_rotationZ( mesh.rotation.z / Math.PI*180 );

	body.moveTo( new Vector3D( mesh.position.x, mesh.position.y, mesh.position.z, 0 ) );

	return body;
}
