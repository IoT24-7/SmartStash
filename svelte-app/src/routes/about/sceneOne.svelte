<script>
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { OrbitControls, Environment, Sky } from '@threlte/extras';
	import Device1 from '../../lib/models/device1.svelte';
</script>

<T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={80} near={0.1} far={1000}>
	<OrbitControls
		autoRotate
		autoRotateSpeed={1.0}
		allowPan={false}
		enableDamping
		maxDistance={3}
		minDistance={1.5}
	/>
</T.PerspectiveCamera>

<!-- <Sky /> -->

<!-- <T.Mesh position={[0, 0.5, 0]} scale={1}>
	<T.SphereGeometry />
	<T.MeshStandardMaterial roughness={0} color="gray" side={0} />
</T.Mesh> -->

<!-- <T.GridHelper args={[10, 10]} /> -->
<T.Group position={[0, 0.7, 0]} scale={2}>
	<Device1 />
</T.Group>
<Environment path="/hdr/" format="hdr" isBackground={true} files="studio_country_hall_1k.hdr" />
