const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './klm.mind',
			maxTrack: 3,
        });

        const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
 		const Tap = await  loadGLTF('./Tap/scene.gltf');
		Tap.scene.scale.set(1.2, 1.2, 1.2);
		
		// calling TapAclip and we are loading the audio from our hard disk
		const TapAclip = await loadAudio("./sound/Tap.mp3");
		const TapListener = new THREE.AudioListener();
		const TapAudio = new THREE.PositionalAudio(TapListener);
		
		const Umbrella = await  loadGLTF('./Umbrella/scene.gltf');
		Umbrella.scene.scale.set(0.015, 0.015, 0.015);
		
		const Volcano = await  loadGLTF('./Volcano/scene.gltf');
		Volcano.scene.scale.set(0.005, 0.005, 0.005);
		Volcano.scene.position.set(0, -0.4, 0);
		
		const UmbrellaMixer = new THREE.AnimationMixer(Umbrella.scene);
		const UmbrellaAction = UmbrellaMixer.clipAction(Umbrella.animations[0]);
		UmbrellaAction.play();
		
		const UmbrellaAclip = await loadAudio("./sound/Umbrella.mp3");
		const UmbrellaListener = new THREE.AudioListener();
		const UmbrellaAudio = new THREE.PositionalAudio(UmbrellaListener);
		
		const VolcanoMixer = new THREE.AnimationMixer(Volcano.scene);
		const VolcanoAction = VolcanoMixer.clipAction(Volcano.animations[0]);
		VolcanoAction.play();
		
		const VolcanoAclip = await loadAudio("./sound/Volcano.mp3");
		const VolcanoListener = new THREE.AudioListener();
		const VolcanoAudio = new THREE.PositionalAudio(VolcanoListener);
		
		const TapAnchor = mindarThree.addAnchor(0);
		TapAnchor.group.add(Tap.scene);
		camera.add(TapListener);
		TapAudio.setRefDistance(300);
		TapAudio.setBuffer(TapAclip);
		TapAudio.setLoop(true);
		TapAnchor.group.add(TapAudio)
		
		TapAnchor.onTargetFound = () => {
			TapAudio.play();
		}
		
		TapAnchor.onTargetLost = () => {
			TapAudio.pause(); 
		}
		
		const UmbrellaAnchor = mindarThree.addAnchor(1);
		UmbrellaAnchor.group.add(Umbrella.scene);
		camera.add(UmbrellaListener);
		UmbrellaAudio.setRefDistance(300);
		UmbrellaAudio.setBuffer(UmbrellaAclip);
		UmbrellaAudio.setLoop(true);
		UmbrellaAnchor.group.add(UmbrellaAudio)
		
		UmbrellaAnchor.onTargetFound = () => {
			UmbrellaAudio.play();
		}
		
		UmbrellaAnchor.onTargetLost = () => {
			UmbrellaAudio.pause(); 
		}
		
		
		const VolcanoAnchor = mindarThree.addAnchor(2);
		VolcanoAnchor.group.add(Volcano.scene);
		camera.add(VolcanoListener);
		VolcanoAudio.setRefDistance(300);
		VolcanoAudio.setBuffer(VolcanoAclip);
		VolcanoAudio.setLoop(true);
		VolcanoAnchor.group.add(VolcanoAudio)
		
		VolcanoAnchor.onTargetFound = () => {
			VolcanoAudio.play();
		}
		
		VolcanoAnchor.onTargetLost = () => {
			VolcanoAudio.pause(); 
		}
		
		const clock = new THREE.Clock();
		
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			VolcanoMixer.update(delta);
			UmbrellaMixer.update(delta);
			Umbrella.scene.rotation.set(0, Umbrella.scene.rotation.y + delta, 0);
			Tap.scene.rotation.set(0, Tap.scene.rotation.y + delta, 0);
			Volcano.scene.rotation.set(0, Volcano.scene.rotation.y + delta, 0);
            renderer.render(scene, camera);
        });
    }

    start();
});