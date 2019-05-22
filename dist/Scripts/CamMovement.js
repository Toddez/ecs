class CamMovement extends Behaviour {
	OnStart() {
	  this.transform = this.object.getComponent('Transform');
	  this.down = false;
	  this.distance = 5;
	}
  
	OnUpdate(deltaTime) {		
		if (this.Canvas.mouseDown) {
			if (!this.down) {
				{ 
					const delta = this.Canvas.mouseDelta();
				}
				this.down = true;
			}

			{ 
				const delta = this.Canvas.mouseDelta();
				this.transform.rotation.x += delta.y;
				this.transform.rotation.y += delta.x;
			}
		} else {
			this.down = false;
		}
		
		this.distance += this.Canvas.scrollDelta().y * 0.01;

		this.transform.position.x = Math.sin(this.transform.rotation.y * Math.PI / 180) * Math.cos(-this.transform.rotation.x * Math.PI / 180) * this.distance;
		this.transform.position.y = Math.sin(-this.transform.rotation.x * Math.PI / 180) * this.distance;
		this.transform.position.z = Math.cos(this.transform.rotation.y * Math.PI / 180) * Math.cos(-this.transform.rotation.x * Math.PI / 180) * this.distance;
	}
}