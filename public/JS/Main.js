window.addEventListener('load', () => {

	const app = new Application(60, 60);
	const canvas = new Canvas('main', new Vector2(500, 500));

	const scene = new Scene();

	app.onStart = () => {
		canvas.fullscreen(true);

		let cubeShader = new DebugShader();
		Shader.addShader('cube', cubeShader);

		let cube = new Cube(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
		cube.setShader('cube');

		scene.children.push(cube);
	};

	app.onRender = (deltaTime) => {
		scene.update();
	};

	app.onUpdate = (deltaTime) => {
		scene.render();
		Shader.render();
	};

	app.start();
});